# Implementation plan: Automatic releases

Status: Implemented; integration pending
Spec: [spec.md](spec.md)
Updated: 2026-10-24

## Baseline and design

Baseline: cec18fbd648b0db259888c24f94ec80bd0f3f1f0. The root workspace is private
at 0.0.0; the public library and npm registry are at 0.0.1. No GitHub releases exist.

| Requirements | Approach | Files |
| --- | --- | --- |
| FR-001 | Pin Release Please v5.0.0; root node strategy with extra JSON version updater for the Angular library | release-please-config.json, .release-please-manifest.json |
| FR-002, FR-003 | Release output gates publishing in the same OIDC-trusted workflow; build exact release tag | .github/workflows/publish.yml |
| FR-004 | Dispatch existing CI at generated PR branch; validate retry tag/version/ancestry | .github/workflows/ci.yml, .github/workflows/publish.yml |

The root node strategy accounts for changes anywhere in this single-library repo
and keeps root package-lock.json synchronized. Separate jobs restrict OIDC to the
publisher and repository write permissions to release management. Serial workflow
concurrency protects release operations and publication. No release-event chaining
is used because GITHUB_TOKEN-generated release events do not trigger workflows.

## Constitution check

All six principles satisfied or unaffected: no public API, transport, DI, data,
or formatting changes; integration claims distinguish local from live evidence.

## Verification and rollout

Validate workflow syntax/expressions with actionlint, inspect version configuration,
and run npm run check and npm run pack. Exercise the Release Please strategy with
local file data if available. Live AC-001 through AC-004 require GitHub/npm runs.

The organization must allow Actions PR creation, then this repository must allow
it. GitHub rejected the repository setting update with HTTP 409 because the
organization currently prohibits it. No organization-wide setting was changed.
Commit configuration with a fix: message and push main, review the generated PR,
then merge to verify publication. npm trusted publisher filename stays publish.yml.
