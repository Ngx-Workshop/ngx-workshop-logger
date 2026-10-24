# Tasks — shared logging

- [x] T001: Record requirements and constitution in `.specify/` and `specs/001-shared-logging/`.
- [x] T002: Implement types, providers, service, public API (FR-001–006); depends on T001.
- [x] T003: Replace starter demo and package documentation (FR-007); depends on T002.
- [x] T004: Verify acceptance scenarios with tests and production builds; depends on T002/T003.
- [x] T005: Pack library and record evidence in handoff; depends on T004.
- [x] T006: Route all severities through `console.log`, apply synthwave neon
  foreground/background styles, and format UTC timestamps as `HH:MM:SS`; update
  tests and documentation (FR-002/003, AC-001); depends on T005.
- [x] T007: Move timestamp to its own line, combine origin/severity/message on the
  second line, and keep one background style active across the full log block;
  update tests and documentation (FR-002/003, AC-001); depends on T006.
- [x] T008: Remove console backgrounds and replace them with severity-specific
  synthwave neon text colors and layered glow; update tests and documentation
  (FR-003, AC-001); depends on T007.
- [x] T009: Restore synthwave backgrounds, change the summary to timestamp/origin
  then severity/message, and render data in a collapsed `console.table` group;
  update tests and documentation (FR-002/003, AC-001); depends on T008.
- [x] T010: Change the summary to timestamp/severity then origin/message, restrict
  the neon glow to the first line, and update tests and documentation
  (FR-002/003, AC-001); depends on T009.
- [x] T011: Apply the first line's severity color to the origin/message line without
  applying its glow; update tests and documentation (FR-003, AC-001); depends on T010.
