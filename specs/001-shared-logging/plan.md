# Plan — shared logging

Replace starter LibraryCard with types, DI configuration/transport tokens, and a
root-provided WorkshopLogger service. Keep the existing Angular package name,
peer dependencies, scripts, publication workflows, and dist-based demo imports.

- `logger.types.ts`: severity, target, content union, event, receipt, transport/config contracts (FR-001/004/005).
- `logger.providers.ts`: defaults, configuration helper, injectable mock transport (FR-004/005).
- `workshop-logger.service.ts`: format/color, threshold, dispatch, severity helpers (FR-001–006).
- `public-api.ts`: explicit library surface; demo consumes the built package (FR-007).
- Tests: inspect console call arguments, dispatch isolation, filters, DI defaults,
  mock semantics, and rejection behavior. Build and pack verify the consumer boundary.

Constitution check: no external endpoint, no global mutable state, no automatic
sensitive context collection. No deviations. Starter component removal is intentional
for this new unreleased library; real backend transport can replace the token later.
