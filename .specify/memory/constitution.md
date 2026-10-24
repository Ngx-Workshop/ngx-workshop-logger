# Constitution

1. One independently publishable Angular library serves shells and MFEs through its public API.
2. Consumers supply severity, origin class name, and message and/or data. Console
   output preserves the agreed timestamp/severity/origin format and inspectable data.
3. Console and backend transports are independently selectable. The default backend
   is an asynchronous mock with no network, persistence, or false delivery claims.
4. Configuration belongs to each application's injector; no global mutable singleton
   or dependency on another repository is required.
5. Do not enrich logs with tokens, credentials, or user data automatically. Consumers
   own redaction and must select data suitable for the configured destination.
6. Specs, tests, builds, and handoffs describe observed behavior and limitations honestly.
