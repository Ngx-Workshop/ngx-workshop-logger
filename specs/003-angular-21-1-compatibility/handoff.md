# Handoff

Status: Complete
Updated: 2026-10-24

## Delivered

Workspace Angular runtime/compiler, CLI/build, and ng-packagr are pinned to
21.1.0. Published core/common peers are ^21.1.0. Lockfile regenerated with normal
npm resolution; both READMEs and development guidance describe the minimum.
The logger source/API and partial compilation are unchanged. No MFE files changed.

## Verification

- npm install: PASS after moving the old generated node_modules/lockfile to a
  temporary backup; the initial in-place downgrade encountered stale-tree ERESOLVE.
- npm ci --ignore-scripts --no-audit --no-fund: PASS, regenerated lockfile installs cleanly.
- npm run check: PASS, 24 tests and production library/demo builds on Angular 21.1.0.
- npm run pack: PASS; tmdjr-ngx-workshop-logger-0.1.0.tgz,
  SHA-1 e5e6764dee30455827c278752674dea66dac3e42.
- Packed peers are ^21.1.0; partial declaration compiler metadata is 21.1.0.
- Disposable consumer installed the tarball with Angular core/common/compiler
  21.1.0, injected WorkshopLogger, and verified a log entry and transport receipt.
  No force or legacy-peer-deps was used.
- mfe-shell-admin npm install --dry-run --ignore-scripts --no-save
  --package-lock=false ../ngx-workshop-logger/tmdjr-ngx-workshop-logger-0.1.0.tgz:
  PASS, resolved 1,362 packages. This verifies resolution only, not the shell build
  or browser/federation runtime. Its existing local changes were preserved.
- git diff --check: PASS.

npm reported 20 dependency vulnerabilities (1 low, 6 moderate, 12 high, 1 critical)
for this older workspace toolchain. Security remediation is outside this requested
compatibility change; no audit fix or Angular consumer upgrade was applied.

## Release and adoption

The npm 0.1.0 release is immutable and still has its original peer constraints.
Commit this fix with a Conventional Commit such as
`fix: support Angular 21.1 consumers`, then use the existing release-please process
to publish the next version. Versions have deliberately not been manually bumped.
Once published, update the shell dependency and its explicit webpack shared
requiredVersion together. In the meantime, the local tarball is available for
installation; its unchanged 0.1.0 version is a local build, not a registry fix.
No commit, push, publication, or shell installation was performed.
