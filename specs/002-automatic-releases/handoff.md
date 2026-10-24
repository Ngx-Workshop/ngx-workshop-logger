# Handoff: Automatic releases

Status: Implemented; integration pending
Spec: [spec.md](spec.md)
Plan: [plan.md](plan.md)
Tasks: [tasks.md](tasks.md)
Updated: 2026-10-24

## Delivered behavior

publish.yml now handles main pushes with pinned Release Please v5.0.0. It opens
release PRs for Conventional Commits, dispatches validation on generated branches,
and publishes the exact release tag after a release PR merge. Version updates
include the public Angular library manifest. The existing npm trusted publisher
filename and OIDC permission remain. Manual dispatch requires an existing release
tag and validates tag/version/main ancestry.

## Verification evidence

| Check | Result and limits |
| --- | --- |
| actionlint 1.7.12 on ci.yml and publish.yml | PASS |
| git diff --check | PASS |
| npm run check | PASS: 24 tests, library and demo production builds |
| npm run pack | PASS: existing 0.0.1 tarball, not published |
| AC-001 version updates | Release Please 17.6.0 actual Node strategy with local-file GitHub substitute: fix 0.0.2, feat 0.1.0, breaking 1.0.0; root/lock/library synchronized; changelog generated; docs-only skipped |
| AC-002–004 live automation | NOT RUN: changes local; no release PR or publish attempted |
| Repository PR permission API | BLOCKED: HTTP 409, organization prohibits Actions PR creation |

The strategy check used local input and did not exercise GitHub PR creation or
live manifest history discovery. Manual retry guards were reviewed and workflow
linted; live acceptance remains unverified.

## Remaining work and next action

X001: An organization owner enables Allow GitHub Actions to create and approve
pull requests under Ngx-Workshop Settings → Actions → General, then the repository
setting is enabled. The repository setting change was rejected; no organization
setting changed. Default token permissions can remain read-only.

X002: Commit and push these local changes to main with
`fix(ci): automate versioned npm releases`. Wait for the automatic release PR
and its dispatched CI, review/merge, then verify the GitHub release and npm
version. Keep npm owner/repo/workflow as Ngx-Workshop / ngx-workshop-logger /
publish.yml with no environment. Nothing was committed, pushed, or published.

## Context maintenance

Updated docs/publishing.md, docs/development.md, and specs/README.md. Architecture,
consumer APIs, constitution, and runtime library behavior do not change.
