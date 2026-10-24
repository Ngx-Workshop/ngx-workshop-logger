import { inject, Injectable } from '@angular/core';
import { LOG_BACKEND_TRANSPORT, WORKSHOP_LOGGER_CONFIG } from './logger.providers';
import type { LogContent, LogEntry, LogLevel, LogReceipt, LogTarget } from './logger.types';

const PRIORITY: Record<LogLevel, number> = { info: 0, warning: 1, error: 2 };
const COLORS: Record<LogLevel, string> = {
  info: '#0284c7', warning: '#b45309', error: '#dc2626',
};

@Injectable({ providedIn: 'root' })
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
    target: LogTarget = this.config.target,
  ): Promise<LogReceipt | undefined> {
    if (!origin.trim()) throw new Error('A log origin class name is required.');
    if (PRIORITY[level] < PRIORITY[this.config.minLevel]) return;
    const entry: LogEntry = {
      timestamp: new Date().toISOString(), level, origin,
      ...('message' in content ? { message: content.message } : {}),
      ...('data' in content ? { data: content.data } : {}),
    };
    if (target === 'console' || target === 'both') this.writeConsole(entry);
    if (target === 'backend' || target === 'both') return this.backend.send(entry);
    return;
  }

  info(origin: string, content: LogContent, target?: LogTarget) {
    return this.log('info', origin, content, target);
  }

  warning(origin: string, content: LogContent, target?: LogTarget) {
    return this.log('warning', origin, content, target);
  }

  error(origin: string, content: LogContent, target?: LogTarget) {
    return this.log('error', origin, content, target);
  }

  private writeConsole(entry: LogEntry): void {
    const header = `[${entry.timestamp}] :: [${entry.level.toUpperCase()}] :: [${entry.origin}]`;
    // %s keeps consumer text literal, even when it contains console format tokens.
    let format = this.config.color ? '%c%s%c' : '%s';
    const args: unknown[] = this.config.color
      ? [`color: ${COLORS[entry.level]}; font-weight: bold`, header, '']
      : [header];
    if (entry.message !== undefined) { format += '\n%s'; args.push(entry.message); }
    if ('data' in entry) { format += '\n%o'; args.push(entry.data); }
    const method = entry.level === 'warning' ? 'warn' : entry.level;
    console[method](format, ...args);
  }
}
