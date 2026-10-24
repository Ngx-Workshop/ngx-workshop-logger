# Architecture

The private workspace builds `@tmdjr/ngx-workshop-logger` and a standalone demo.
ng-packagr produces Angular Package Format output with partial compilation.
The demo imports the built package from dist to verify the public boundary.

`src/lib/logger.types.ts` defines the event and transport contracts.
`logger.providers.ts` owns application configuration and injectable mock backend.
`workshop-logger.service.ts` creates one timestamped event, filters severity, then
routes to the console, backend, or both. UTC timestamps use `HH:MM:SS` on the first
line beside severity; origin and message share the second line. Only the first line
receives the synthwave neon glow; the second line uses the same severity color in
a separate CSS segment without text shadow. Message-only entries use `console.log`.
Entries with data use a collapsed group and pass the original data to
`console.table`; the browser controls native table rendering. No JSON serialization
is required, so circular objects and Error instances remain available to the native
console renderer.

The backend receives the same in-memory entry and returns an asynchronous mock
receipt without network or storage. Consumers may override LOG_BACKEND_TRANSPORT
with a real transport once a backend contract exists. Rejections propagate to callers.
Independent Angular roots have independent configuration. No existing MFE/shell
is modified or assumed to share an injector. Consumers own data redaction.
