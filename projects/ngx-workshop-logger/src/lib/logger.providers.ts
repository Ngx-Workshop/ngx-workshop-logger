import { InjectionToken, makeEnvironmentProviders } from "@angular/core";
import type { EnvironmentProviders } from "@angular/core";
import type {
  LogBackendTransport,
  LogEntry,
  LogReceipt,
  WorkshopLoggerConfig,
} from "./logger.types";

export class MockLogBackendTransport implements LogBackendTransport {
  async send(_entry: LogEntry): Promise<LogReceipt> {
    // Simulate an asynchronous API acknowledgement without making a network request.
    await Promise.resolve();
    return { mocked: true, accepted: true };
  }
}

export const WORKSHOP_LOGGER_CONFIG = new InjectionToken<WorkshopLoggerConfig>(
  "WORKSHOP_LOGGER_CONFIG",
  {
    providedIn: "root",
    factory: () => ({ target: "console", color: true, minLevel: "info" }),
  },
);

export const LOG_BACKEND_TRANSPORT = new InjectionToken<LogBackendTransport>(
  "LOG_BACKEND_TRANSPORT",
  {
    providedIn: "root",
    factory: () => new MockLogBackendTransport(),
  },
);

/** Configure once in each independently bootstrapped shell or MFE. */
export function provideWorkshopLogger(
  config: Partial<WorkshopLoggerConfig> = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: WORKSHOP_LOGGER_CONFIG,
      useValue: { target: "console", color: true, minLevel: "info", ...config },
    },
  ]);
}
