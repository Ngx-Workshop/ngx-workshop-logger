import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { WorkshopLogger } from "@tmdjr/ngx-workshop-logger";
import type { LogLevel, LogTarget } from "@tmdjr/ngx-workshop-logger";

@Component({
  selector: "app-root",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Workshop logger</h1>
      <p>
        Open your browser inspector console to see colored logs and expandable
        data.
      </p>
      <label
        >Destination
        <select #target>
          <option value="console">Console</option>
          <option value="backend">Mock backend</option>
          <option value="both">Both</option>
        </select>
      </label>
      <div class="actions">
        <button (click)="write('info', target.value)">Log info</button>
        <button (click)="write('warning', target.value)">Log warning</button>
        <button (click)="write('error', target.value)">Log error</button>
      </div>
      <p role="status">{{ status() }}</p>
      <pre>
[Timestamp] :: [Log Level] :: [Class Name]
Message
Data</pre>
      <p>
        The mock acknowledges logs asynchronously. It makes no network requests
        and stores no logs.
      </p>
    </main>
  `,
  styles: `
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin: 1rem 0;
    }
    button,
    select {
      padding: 0.65rem;
      font: inherit;
    }
    pre {
      white-space: pre-wrap;
    }
  `,
})
export class App {
  private readonly logger = inject(WorkshopLogger);
  readonly status = signal("Choose a destination and log level.");

  async write(level: LogLevel, target: string): Promise<void> {
    try {
      const receipt = await this.logger.log(
        level,
        "WorkshopLoggerDemo",
        {
          message: "Example journey event",
          data: { journey: "workshop", step: "overview" },
        },
        target as LogTarget,
      );
      this.status.set(
        receipt
          ? "Mock backend accepted the log. No network request was made."
          : "Written to console.",
      );
    } catch {
      this.status.set("The log could not be delivered.");
    }
  }
}
