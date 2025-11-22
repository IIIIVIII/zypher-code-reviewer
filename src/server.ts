/**
 * HTTP Server with Server-Sent Events (SSE) support
 * Handles bug hunt requests and streams progress to the UI
 */

import { serveDir } from '@std/http/file-server';
import { BugHuntAgent } from './agent.ts';

export interface BugHuntSession {
  id: string;
  description: string;
  files: Array<{ name: string; content: string }>;
  controller: ReadableStreamDefaultController | null;
  startTime: number;
}

const activeSessions = new Map<string, BugHuntSession>();

export async function startServer(agent: BugHuntAgent, port: number) {
  const handler = async (req: Request): Promise<Response> => {
    const url = new URL(req.url);

    if (url.pathname === '/' || url.pathname.startsWith('/static')) {
      if (url.pathname === '/') {
        return new Response(await Deno.readTextFile('./static/index.html'), {
          headers: { 'content-type': 'text/html' },
        });
      }
      return serveDir(req, { fsRoot: './static' });
    }

    if (url.pathname === '/api/hunt' && req.method === 'POST') {
      return handleBugHunt(req, agent);
    }

    if (url.pathname.startsWith('/api/stream/')) {
      const sessionId = url.pathname.split('/').pop();
      return handleStream(sessionId!);
    }

    return new Response('Not Found', { status: 404 });
  };

  console.log(`\n🚀 Server running at http://localhost:${port}`);
  console.log(`📱 Open your browser and visit: http://localhost:${port}\n`);

  await Deno.serve({ port }, handler).finished;
}

async function handleBugHunt(req: Request, agent: BugHuntAgent): Promise<Response> {
  try {
    const formData = await req.formData();
    const description = formData.get('description') as string;
    const filesData = formData.getAll('files');

    if (!description) {
      return new Response(
        JSON.stringify({ error: 'Bug description is required' }),
        { status: 400, headers: { 'content-type': 'application/json' } }
      );
    }

    const sessionId = crypto.randomUUID();
    const files = filesData.map((f) => JSON.parse(f as string));

    activeSessions.set(sessionId, {
      id: sessionId,
      description,
      files,
      controller: null,
      startTime: Date.now(),
    });

    console.log(`🆕 New bug hunt session: ${sessionId}`);
    console.log(`📝 Description: ${description.substring(0, 50)}...`);
    console.log(`📁 Files: ${files.length}`);

    runBugHunt(sessionId, description, files, agent);

    return new Response(
      JSON.stringify({ sessionId, status: 'started' }),
      { headers: { 'content-type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error handling bug hunt:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to start bug hunt' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

function handleStream(sessionId: string): Response {
  console.log(`📡 SSE connection for session: ${sessionId}`);
  
  const stream = new ReadableStream({
    start(controller) {
      const session = activeSessions.get(sessionId);
      if (session) {
        session.controller = controller;
        console.log(`✅ Controller attached to session`);
      } else {
        activeSessions.set(sessionId, {
          id: sessionId,
          description: '',
          files: [],
          controller,
          startTime: Date.now(),
        });
        console.log(`✅ New session created with controller`);
      }
    },
    cancel() {
      console.log(`🔌 SSE connection closed for session: ${sessionId}`);
      activeSessions.delete(sessionId);
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'connection': 'keep-alive',
      'access-control-allow-origin': '*',
    },
  });
}

function sendSSE(session: BugHuntSession, data: any): boolean {
  if (!session.controller) {
    console.log('⚠️ No controller available');
    return false;
  }
  
  try {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    session.controller.enqueue(new TextEncoder().encode(message));
    return true;
  } catch (error) {
    console.error('Error sending SSE:', error);
    return false;
  }
}

function closeSession(sessionId: string) {
  const session = activeSessions.get(sessionId);
  if (session && session.controller) {
    try {
      session.controller.close();
    } catch (_e) {
      // Ignore close errors
    }
  }
  activeSessions.delete(sessionId);
}

function parseAgentResponse(rawResult: string): any {
  try {
    // Remove markdown code blocks if present
    let cleaned = rawResult.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();
    
    const parsed = JSON.parse(cleaned);
    return {
      success: true,
      summary: parsed.summary || 'Analysis complete',
      totalBugs: parsed.totalBugs || parsed.bugs?.length || 0,
      bugs: parsed.bugs || [],
      fixedCode: parsed.fixedCode || '',
    };
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    // Return raw result as fallback
    return {
      success: false,
      summary: 'Analysis complete (raw format)',
      totalBugs: 0,
      bugs: [],
      fixedCode: '',
      rawReport: rawResult,
    };
  }
}

async function runBugHunt(
  sessionId: string,
  description: string,
  files: Array<{ name: string; content: string }>,
  agent: BugHuntAgent
) {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const session = activeSessions.get(sessionId);
  if (!session) {
    console.error(`❌ Session ${sessionId} not found`);
    return;
  }

  if (!session.controller) {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  if (!session.controller) {
    console.error(`❌ Session ${sessionId} has no controller`);
    return;
  }

  try {
    console.log(`🚀 Starting bug hunt for session: ${sessionId}`);
    
    sendSSE(session, { type: 'log', message: '🔍 Bug Hunt Agent activated...', level: 'info' });
    await new Promise(resolve => setTimeout(resolve, 300));

    sendSSE(session, { type: 'log', message: `📝 Analyzing bug description...`, level: 'info' });
    await new Promise(resolve => setTimeout(resolve, 300));

    if (files.length > 0) {
      sendSSE(session, { 
        type: 'log', 
        message: `📁 Processing ${files.length} file(s): ${files.map(f => f.name).join(', ')}`, 
        level: 'info' 
      });
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    sendSSE(session, { type: 'log', message: '🤖 Connecting to Claude Sonnet 4.5...', level: 'working' });
    await new Promise(resolve => setTimeout(resolve, 200));

    let taskPrompt = `Analyze this code for bugs.\n\nBug Report: ${description}\n\n`;

    if (files.length > 0) {
      taskPrompt += `Code to analyze:\n\n`;
      files.forEach((file) => {
        taskPrompt += `=== File: ${file.name} ===\n${file.content}\n\n`;
      });
    }

    taskPrompt += `\nFind ALL bugs in this code and provide the complete fixed version.`;

    sendSSE(session, { type: 'log', message: '🔬 Analyzing code structure...', level: 'working' });

    console.log(`📤 Sending task to agent...`);

    const rawResult = await agent.analyze(taskPrompt);

    console.log(`✅ Agent completed analysis (${rawResult.length} chars)`);

    sendSSE(session, { type: 'log', message: '🔍 Parsing bug analysis...', level: 'working' });
    await new Promise(resolve => setTimeout(resolve, 300));

    const parsedResult = parseAgentResponse(rawResult);

    sendSSE(session, { type: 'log', message: '💡 Generating fixed code...', level: 'working' });
    await new Promise(resolve => setTimeout(resolve, 300));

    sendSSE(session, { type: 'log', message: '✅ Analysis complete!', level: 'success' });
    await new Promise(resolve => setTimeout(resolve, 200));

    const bugsCount = parsedResult.totalBugs || parsedResult.bugs?.length || 0;

    console.log(`✅ Bug hunt complete: ${bugsCount} bugs found`);

    sendSSE(session, {
      type: 'result',
      bugsFound: bugsCount,
      fixesApplied: bugsCount, // Same as bugs if we have fixed code
      summary: parsedResult.summary,
      bugs: parsedResult.bugs,
      fixedCode: parsedResult.fixedCode,
      rawReport: parsedResult.rawReport || null,
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    closeSession(sessionId);
    
  } catch (error) {
    console.error('Error in bug hunt:', error);
    
    sendSSE(session, {
      type: 'error',
      message: `Analysis failed: ${error.message}`,
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    closeSession(sessionId);
  }
}
