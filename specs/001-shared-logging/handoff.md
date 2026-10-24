# Handoff — shared logging

Status: Complete
Updated: 2026-10-24
Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md) · Tasks: [tasks.md](tasks.md)

## Delivered

Replaced the starter component with the shared WorkshopLogger API, console and
mock backend routing, synthwave neon severity headers, minimum severity configuration,
transport injection, and a public-package demo. Message-only console entries use
`console.log`; entries with data use a synthwave-styled collapsed group and pass the
original payload to `console.table`. The first line contains severity/UTC timestamp
and receives the neon glow. On the second line, the brackets use the severity color,
the origin is pink, and the message is purple. Banner and log presentation now come
from an internal declarative theme and composable safe console fragments; the public
configuration API is unchanged. Added the self-contained Markdown Spec Kit workflow,
constitution, templates, context docs, and feature artifacts.

## Verification

- `npm run check`: PASS; 24 tests passed, production Angular library and demo built.
- AC-001/002: PASS in unit tests for styled collapsed groups, original-value
  `console.table` calls, message-only `console.log` routing, first-line-only glow,
  severity-colored brackets, pink origin, purple message, the requested two-line
  severity/UTC timestamp and origin/message format, literal text,
  structured/falsy/circular data, and invalid origins.
- AC-003/004: PASS in unit tests for isolated/both targets, shared timestamp/data,
  configuration, filters, asynchronous mock acknowledgement, and rejection propagation.
- AC-005: PASS; `npm run pack` generated `tmdjr-ngx-workshop-logger-0.2.0.tgz`
  with compiled code, type declarations, package manifest, README, and license
  (SHA-1 `6b5703ccb7c8f75c1e3a9d0791923e34e0c3a61a`).
- `git diff --check`: PASS.

Tests verify console formatting arguments under jsdom. Actual browser inspector
rendering was not manually checked; a manual recipe is in docs/development.md.
No real endpoint or host MFE integration was exercised. npm emitted an existing
user configuration warning about scripts-prepend-node-path; checks still passed.

## Consumer handoff

Consumers inject WorkshopLogger and optionally call provideWorkshopLogger in
application providers. Supply an explicit origin plus message and/or data; await
calls to handle custom backend failures. Defaults: console, color enabled, info
threshold. A transport override implements LogBackendTransport.send(LogEntry).
A mock receipt explicitly marks mocked=true; it is not a server delivery receipt.

No scoped tasks remain. The library has not been published and existing MFEs and
shells have not been migrated. The next adoption step is to install the local
tarball in a selected consumer and use the documented API. A real backend requires
a future contract/spec, endpoint, authentication, and serialization decisions.
