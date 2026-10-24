# @tmdjr/ngx-workshop-logger

Shared Angular 21 logging for shells and microfrontends. Requires Angular core/common ^21.1.0.

```ts
import { inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { WorkshopLogger, provideWorkshopLogger } from '@tmdjr/ngx-workshop-logger';

// In your application's bootstrap configuration:
bootstrapApplication(App, {
  providers: [provideWorkshopLogger({ target: 'console', color: true, minLevel: 'info' })],
});

// In a component or service injection context:
const logger = inject(WorkshopLogger);
await logger.info('WorkshopJourney', { message: 'Journey opened', data: { step: 1 } });
await logger.warning('WorkshopJourney', { message: 'Retrying' });
await logger.error('WorkshopJourney', { data: new Error('Example') }, 'both');
const receipt = await logger.log('info', 'WorkshopJourney', { message: 'Saved' }, 'backend');
// receipt: { mocked: true, accepted: true }; no HTTP request or persistence.
```

Console output (blue info, amber warning, red error headers):

```text
[2026-10-23T12:00:00.000Z] :: [INFO] :: [WorkshopJourney]
Journey opened
{ step: 1 }
```

Data stays inspectable in the browser console. Supply a message, data, or both;
empty origin names reject the returned promise. CSS color targets browser inspectors.
Set `color: false` for plain output. `minLevel: 'warning'` filters info for all
destinations; `minLevel: 'error'` filters info and warning. Per-call targets override
the configured target. Console-only and filtered calls resolve to undefined.

Await logging calls and handle failures from a custom backend transport. Console
output occurs immediately; if both targets are selected, it precedes backend delivery.
No retry is automatic. Configure each independently bootstrapped MFE or shell.
There is no requirement to register providers when defaults are sufficient.

To replace the mock, provide `{ provide: LOG_BACKEND_TRANSPORT, useClass: YourTransport }`
where YourTransport implements `LogBackendTransport.send(entry): Promise<LogReceipt>`.
The eventual endpoint, serialization, authentication, and retention contract remain
undefined. Objects are passed by reference, not snapshotted; callers must redact
sensitive data and avoid mutating payloads while a custom transport is sending them.

Apache-2.0 licensed.

## Workspace development

Use Node 22.12+ or 24+ and npm 11.6+. Run `npm ci`, then `npm start` for the demo
at http://localhost:4200. Run `npm run watch` in another terminal for library edits.
`npm run check` runs tests and production builds. `npm run pack` creates the tarball.

See [agent entry point](AGENTS.md), [Spec Kit workflow](.specify/README.md),
[feature index](specs/README.md), [architecture](docs/architecture.md),
[development](docs/development.md), and [publishing](docs/publishing.md).
This is a Markdown adaptation of Spec Kit; no CLI or slash commands are installed.
