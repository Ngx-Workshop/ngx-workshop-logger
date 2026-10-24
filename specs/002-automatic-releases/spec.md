# Feature: Automatic release PRs and npm publication

Status: Implemented; integration pending
Feature ID: 002-automatic-releases
Created: 2026-10-24
Updated: 2026-10-24
Request/source: Automate version bumps through release PRs and publish from main.

## Problem and audience

Maintainers currently bump versions manually. A workflow attempted to republish
0.0.1 and npm rejected it because that version already exists.

## Scope and requirements

- FR-001: Release-worthy Conventional Commits pushed to main create/update a
  reviewable release PR with package versions and release notes.
- FR-002: Merging that PR creates a versioned GitHub release and publishes the
  corresponding library after tests, library/demo builds, and packing succeed.
- FR-003: Keep npm OIDC bound to publish.yml without storing an npm token.
- FR-004: Validate generated PR branches and allow retrying an existing release
  tag without creating or overwriting a package version.

Automatic merging and publication of every ordinary push are outside scope.

## Acceptance scenarios

- AC-001 / FR-001: Given published 0.0.1, a new fix commit on main proposes
  0.0.2 in the library manifest, root manifests, release manifest, and changelog.
- AC-002 / FR-002, FR-003: Merging a release PR publishes exactly its tag/version
  from publish.yml; ordinary pushes cannot enter the publish job.
- AC-003 / FR-004: Bot-created release branches get explicitly dispatched CI.
- AC-004 / FR-004: A manual retry accepts an existing version-matching tag on
  main; a missing/mismatched/off-main tag cannot reach npm publication.

## Boundaries and assumptions

The package API and library behavior stay unchanged. The release PR merge remains
human approval. GitHub owns PR creation/tagging and npm owns registry state.
The initial manifest baseline is the registry's existing 0.0.1; bootstrap history
ends at cec18fbd648b0db259888c24f94ec80bd0f3f1f0. An organization owner must
permit Actions PR creation. Live acceptance requires pushing and merging changes
and is tracked separately from local checks.
