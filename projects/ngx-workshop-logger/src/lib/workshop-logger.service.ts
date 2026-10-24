import { inject, Injectable } from "@angular/core";
import {
  LOG_BACKEND_TRANSPORT,
  WORKSHOP_LOGGER_CONFIG,
} from "./logger.providers";
import type {
  LogContent,
  LogEntry,
  LogLevel,
  LogReceipt,
  LogTarget,
} from "./logger.types";

const PRIORITY: Record<LogLevel, number> = { info: 0, warning: 1, error: 2 };
const CONSOLE_COLORS: Record<LogLevel, string> = {
  info: "#00f5ff",
  warning: "#fff01f",
  error: "#ff2a6d",
};

@Injectable({ providedIn: "root" })
export class WorkshopLogger {
  private readonly config = inject(WORKSHOP_LOGGER_CONFIG);
  private readonly backend = inject(LOG_BACKEND_TRANSPORT);

  /** Console writes immediately; await the result to handle backend failures.
   * Filtered and console-only entries resolve without a receipt.
   */
  async log(
    level: LogLevel,
    origin: string,
    content: LogContent,
    target: LogTarget = this.config.target
  ): Promise<LogReceipt | undefined> {
    if (!origin.trim()) throw new Error("A log origin class name is required.");
    if (PRIORITY[level] < PRIORITY[this.config.minLevel]) return;
    const entry: LogEntry = {
      timestamp: new Date().toISOString().slice(11, 19),
      level,
      origin,
      ...("message" in content ? { message: content.message } : {}),
      ...("data" in content ? { data: content.data } : {}),
    };
    if (target === "console" || target === "both") this.writeConsole(entry);
    if (target === "backend" || target === "both")
      return this.backend.send(entry);
    return;
  }

  info(origin: string, content: LogContent, target?: LogTarget) {
    return this.log("info", origin, content, target);
  }

  warning(origin: string, content: LogContent, target?: LogTarget) {
    return this.log("warning", origin, content, target);
  }

  error(origin: string, content: LogContent, target?: LogTarget) {
    return this.log("error", origin, content, target);
  }

  private writeConsole(entry: LogEntry): void {
    const heading = `[${entry.level.toUpperCase()}] || [${entry.timestamp}]`;
    const context = `[${entry.origin}]`;
    // %s keeps consumer text literal, even when it contains console format tokens.
    let format = this.config.color ? "%c%s%c\n%c%s" : "%s\n%s";
    const color = CONSOLE_COLORS[entry.level];
    const args: unknown[] = this.config.color
      ? [
          `color: ${color}; font-size: 10px; font-weight: normal; padding: 4px 8px; text-shadow: 0 0 4px ${color}, 0 0 8px ${color}`,
          heading,
          "",
          `color: ${color}; font-size: 10px; font-weight: normal; padding: 0 4px 0 8px;`,
          context,
        ]
      : [heading, context];
    if (entry.message !== undefined) {
      format += ": %s";
      args.push(entry.message);
    }
    if (this.config.color) {
      format += "%c";
      args.push("");
    }
    if ("data" in entry) {
      console.groupCollapsed(format, ...args);
      try {
        console.table(entry.data);
      } finally {
        console.groupEnd();
      }
      return;
    }
    console.log(format, ...args);
  }
}
