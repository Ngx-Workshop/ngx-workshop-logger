# Handoff — shared logging

Status: Complete
Updated: 2026-10-23
Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md) · Tasks: [tasks.md](tasks.md)

## Delivered

Replaced the starter component with the shared WorkshopLogger API, console and
mock backend routing, colored severity headers, minimum severity configuration,
transport injection, and a public-package demo. Added the self-contained Markdown
Spec Kit workflow, constitution, templates, context docs, and feature artifacts.

## Verification

- `npm run check`: PASS; 23 tests passed, production Angular library and demo built.
- AC-001/002: PASS in unit tests for formatted console arguments, severities,
  color styles, literal text, structured/falsy/circular data, and invalid origins.
- AC-003/004: PASS in unit tests for isolated/both targets, shared timestamp/data,
  configuration, filters, asynchronous mock acknowledgement, and rejection propagation.
- AC-005: PASS; `npm run pack` generated `tmdjr-ngx-workshop-logger-0.0.1.tgz`
  with compiled code, type declarations, package manifest, README, and license.
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
