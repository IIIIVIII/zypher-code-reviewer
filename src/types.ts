/**
 * TypeScript type definitions for Bug Hunt Agent
 */

export interface BugReport {
  description: string;
  files?: FileContent[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export interface FileContent {
  name: string;
  content: string;
  language?: string;
}

export interface BugHuntResult {
  bugsFound: number;
  fixesApplied: number;
  report: string;
  success: boolean;
  timestamp: number;
}

export interface AgentProgress {
  type: 'log' | 'progress' | 'result' | 'error';
  message: string;
  level?: 'info' | 'success' | 'warning' | 'error' | 'working';
  timestamp?: number;
}

export interface BugAnalysis {
  rootCause: string;
  affectedFiles: string[];
  suggestedFixes: CodeFix[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface CodeFix {
  file: string;
  lineNumber?: number;
  before: string;
  after: string;
  explanation: string;
}

export interface AgentConfig {
  enableCheckpointing?: boolean;
  maxIterations?: number;
  model: string;
}
