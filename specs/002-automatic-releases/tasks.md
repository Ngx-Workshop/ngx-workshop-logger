# Tasks: Automatic releases

Spec: [spec.md](spec.md)
Plan: [plan.md](plan.md)
Updated: 2026-10-24

- [x] T001 — Implement Release Please configuration and publish.yml gates (FR-001–003).
- [x] T002 — Add bot-branch CI dispatch and tagged manual recovery (FR-004).
- [x] T003 — Update publishing/development docs and feature index.
- [x] T004 — Verify workflow syntax, release configuration, tests/build/pack; record evidence.
- [ ] X001 — Organization owner permits Actions PR creation; repository setting enabled.
- [ ] X002 — Push configuration, observe release PR/CI, merge it, confirm npm version.

T001/T002 evidence: pinned action, output-gated publisher, explicit dispatch, and
tag validation in .github/workflows. X001 currently blocked by an organization
policy (HTTP 409); it does not prevent local implementation or validation.

T004 evidence: actionlint 1.7.12 and git diff --check passed; all 24 tests,
library/demo builds, and pack passed. Release Please 17.6.0 strategy checks with
local file data verified fix → 0.0.2, feat → 0.1.0, breaking → 1.0.0, synchronized
root/lock/library manifests, and no release for docs-only commits.
