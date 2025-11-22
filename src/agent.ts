/**
 * Bug Hunt Agent Configuration
 * Uses Anthropic Claude API with Zypher-style architecture
 */

import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-5-20250929';

const BUG_HUNT_SYSTEM_PROMPT = `You are Bug Hunt Agent, an expert AI debugger.

Your mission: Analyze code and identify ALL bugs, errors, and potential issues.

IMPORTANT: You must respond in this EXACT format. Do not include any text before or after the JSON:

{
  "summary": "Brief summary of analysis",
  "totalBugs": <number>,
  "bugs": [
    {
      "id": 1,
      "title": "Brief bug title",
      "severity": "High|Medium|Low",
      "location": "file/function/line",
      "problem": "What is wrong",
      "rootCause": "Why this happens"
    }
  ],
  "fixedCode": "Complete fixed version of the code with ALL bugs fixed"
}

Rules:
1. Find EVERY bug in the code - be thorough
2. totalBugs MUST equal the length of the bugs array
3. fixedCode must contain the COMPLETE fixed code, not snippets
4. Respond ONLY with valid JSON, no markdown code blocks, no explanation before or after`;

export interface BugHuntAgent {
  analyze: (prompt: string) => Promise<string>;
}

export async function createBugHuntAgent(apiKey: string): Promise<BugHuntAgent> {
  console.log('🤖 Initializing Zypher Agent...');
  console.log(`📦 Using model: ${MODEL}`);
  
  const anthropic = new Anthropic({ apiKey });

  const agent: BugHuntAgent = {
    async analyze(prompt: string): Promise<string> {
      try {
        const startTime = Date.now();
        
        const response = await anthropic.messages.create({
          model: MODEL,
          max_tokens: 8000,
          system: BUG_HUNT_SYSTEM_PROMPT,
          messages: [
            { role: 'user', content: prompt }
          ],
        });

        const endTime = Date.now();
        console.log(`⏱️  Response time: ${((endTime - startTime) / 1000).toFixed(1)}s`);

        const textContent = response.content
          .filter((block) => block.type === 'text')
          .map((block) => block.text)
          .join('\n');

        return textContent;
      } catch (error) {
        console.error('Error calling Anthropic API:', error);
        throw error;
      }
    },
  };

  console.log('✅ Bug Hunt Agent ready!\n');

  return agent;
}
