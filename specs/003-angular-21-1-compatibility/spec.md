# Angular 21.1 compatibility

Status: Complete

The published logger 0.1.0 requires Angular ^21.2.25, blocking installation in
mfe-shell-admin on 21.1.0. Existing MFEs must not require an Angular upgrade.

- FR-001: Support Angular core/common ^21.1.0 and compile with Angular 21.1.0.
- FR-002: Preserve the logger public API, behavior, and partial compilation.
- FR-003: Verify unit tests, production library/demo builds, and a packed consumer
  on Angular 21.1.0 without dependency-resolution bypasses.

Acceptance: npm resolves the tarball with Angular 21.1.0; the consumer can inject
and call WorkshopLogger. Existing checks pass. Publication is a separate release
step; the existing immutable 0.1.0 release cannot be repaired in place.
