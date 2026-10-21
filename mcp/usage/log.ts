export interface UsageEvent {
  ts: string;
  serverSession: string;
  clientSession?: string;
  clientCwd: string;
  client?: { name: string; version: string };
  tool: string;
  args: unknown;
  resultCount: number;
  topIds: string[];
  truncated: boolean;
  ms: number;
  isError: boolean;
}

export interface UsageSink {
  write(event: UsageEvent): void;
}

export const nullSink: UsageSink = { write: () => {} };
