# Feature: Shared journey logging

Status: Complete
Feature ID: 001-shared-logging
Created: 2026-10-23
Request/source: Shared logging library requested for MFE and shell user journeys.

## Problem and scope

Replace the library-card starter with a shared Angular logger. Deliver colored
inspector logs and a mock backend API. Migrating existing shells/MFEs, real HTTP,
server retention, batching, retries, and production redaction policies are outside scope.

## Requirements

- FR-001: Accept Info, Warning, Error, an origin class name, and message and/or data.
- FR-002: Console output uses `[Timestamp] :: [Log Level] :: [Class Name]`,
  followed by message and data on separate lines when provided. Use ISO UTC timestamps.
- FR-003: Give each severity a distinct color and corresponding info/warn/error method;
  preserve inspectable objects and offer a color opt-out.
- FR-004: Select console, backend, or both per application or per call; default to console.
- FR-005: Mock backend acknowledgement is asynchronous, explicitly mocked, and makes
  no network request or persistence claim. Allow replacement via dependency injection.
- FR-006: Support a minimum severity threshold for both transports. Propagate backend
  rejection to the awaiting caller without recursive logging or unrequested retries.
- FR-007: Export a typed package API, working demo, and self-contained Spec Kit artifacts.

## Acceptance scenarios

- AC-001 (FR-001–003): Each severity prints a colored header, multiline message, and
  original object through the matching inspector method. Format tokens remain literal.
- AC-002 (FR-001–003): Message-only and data-only events work; falsy data is preserved;
  colors can be disabled; an empty origin rejects the call.
- AC-003 (FR-004–005): Backend-only emits no console output and returns a mock receipt;
  both destinations receive the same event timestamp and content.
- AC-004 (FR-006): Below-threshold events reach neither transport; backend failures reject.
- AC-005 (FR-007): Tests, production library/demo builds, and package generation succeed.

## Assumptions and boundaries

Info, Warning, Error are the initial severities; console colors apply to the header.
Browser inspector CSS formatting is the target; terminal ANSI output is out of scope.
The backend contract is local only and will require a separate spec when an endpoint
exists. A mock receipt is not evidence of external integration. Data is passed by
reference for inspection and must be redacted by callers. Each independently
bootstrapped MFE configures its own injector. No shell changes are needed for local acceptance.
