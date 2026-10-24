export type LogLevel = "info" | "warning" | "error";
export type LogTarget = "console" | "backend" | "both";
export type LogContent =
  | { readonly message: string; readonly data?: unknown }
  | { readonly message?: never; readonly data: unknown };

export interface LogEntry {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly origin: string;
  readonly message?: string;
  readonly data?: unknown;
}

export interface LogReceipt {
  readonly mocked: boolean;
  readonly accepted: boolean;
}

/** Replace this transport when a backend contract is available. */
export interface LogBackendTransport {
  send(entry: LogEntry): Promise<LogReceipt>;
}

export interface WorkshopLoggerConfig {
  readonly target: LogTarget;
  readonly color: boolean;
  readonly minLevel: LogLevel;
}
