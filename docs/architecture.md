# Architecture

The private workspace builds `@tmdjr/ngx-workshop-logger` and a standalone demo.
ng-packagr produces Angular Package Format output with partial compilation.
The demo imports the built package from dist to verify the public boundary.

`src/lib/logger.types.ts` defines the event and transport contracts.
`logger.providers.ts` owns application configuration and injectable mock backend.
`workshop-logger.service.ts` creates one timestamped event, filters severity, then
routes to the console, backend, or both. Console CSS colors style the header;
message and inspectable data appear below it. No JSON serialization is required,
so circular objects and Error instances can be inspected in the console.

The backend receives the same in-memory entry and returns an asynchronous mock
receipt without network or storage. Consumers may override LOG_BACKEND_TRANSPORT
with a real transport once a backend contract exists. Rejections propagate to callers.
Independent Angular roots have independent configuration. No existing MFE/shell
is modified or assumed to share an injector. Consumers own data redaction.
