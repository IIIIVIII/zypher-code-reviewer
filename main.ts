/**
 * Bug Hunt Agent - Main Entry Point
 * A Zypher-powered AI agent that automatically finds and fixes bugs
 */

import { createBugHuntAgent } from './src/agent.ts';
import { startServer } from './src/server.ts';

const PORT = 8080;

// Simple .env file loader
async function loadEnv() {
  try {
    const envFile = await Deno.readTextFile('.env');
    const lines = envFile.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        Deno.env.set(key.trim(), value);
      }
    }
    
    console.log('✅ Environment variables loaded from .env');
  } catch (_error) {
    console.log('⚠️  No .env file found, using system environment variables');
  }
}

async function main() {
  console.log('🐛 Bug Hunt Agent Starting...\n');

  // Load .env file
  await loadEnv();

  // Check for API key
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable is required');
    console.error('💡 Create a .env file with your API key:');
    console.error('   ANTHROPIC_API_KEY=your_key_here\n');
    Deno.exit(1);
  }

  console.log('✅ API Key found');

  // Create the bug hunt agent
  const agent = await createBugHuntAgent(apiKey);

  console.log('✅ Agent initialized');
  console.log(`🌐 Starting web server on http://localhost:${PORT}`);

  // Start the HTTP server
  await startServer(agent, PORT);
}

// Run the application
if (import.meta.main) {
  main().catch((error) => {
    console.error('❌ Fatal error:', error);
    Deno.exit(1);
  });
}
