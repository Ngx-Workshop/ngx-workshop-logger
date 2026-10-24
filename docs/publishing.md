# Publishing

The private workspace builds `@tmdjr/ngx-workshop-logger`; only
`dist/ngx-workshop-logger` is published. Release Please manages versions, a root
CHANGELOG.md, release PRs, and GitHub release tags through
`.github/workflows/publish.yml`.

## One-time setup

1. An Ngx-Workshop organization owner must enable **Allow GitHub Actions to create
   and approve pull requests** in organization Settings → Actions → General.
   Then enable the same option in this repository's Settings → Actions → General.
   If the repository option cannot be enabled, check the organization policy first
   (the repository API returned HTTP 409 on 2026-10-24). The workflow explicitly requests its required write permissions;
   the default workflow token can stay read-only. No personal access token is needed.
2. Keep the npm trusted publisher for `@tmdjr/ngx-workshop-logger` configured as:
   owner `Ngx-Workshop`, repository `ngx-workshop-logger`, workflow `publish.yml`,
   environment blank, publish action allowed. The workflow uses npm 11.6.0 and
   `id-token: write` on a GitHub-hosted runner; no npm token is stored.
3. Commit and push this configuration to main using a release-worthy Conventional
   Commit, for example `fix(ci): automate versioned npm releases`.
   `.release-please-manifest.json` starts at the published version 0.0.1. The
   bootstrap SHA excludes earlier history from the first automated release.

## Normal releases

1. Push or merge changes into main using Conventional Commit messages (use the
   squash PR title if squash merging): `fix: correct log formatting` proposes a
   patch; `feat: add a transport` proposes a minor; `feat!: change the logger API`
   or a `BREAKING CHANGE:` footer proposes a major. These rules also apply below
   version 1.0. Documentation and ordinary chore commits alone do not open a release.
2. Release Please opens or updates one release PR. It updates the library's
   `projects/ngx-workshop-logger/package.json`, the private root package.json and
   package-lock.json, the release manifest, and CHANGELOG.md together. The private
   root version is bookkeeping; the library manifest controls the npm version.
3. Review the release PR and wait for **Validate Angular library** to pass. Bot
   PRs created with GITHUB_TOKEN do not trigger pull_request events, so publish.yml
   explicitly dispatches ci.yml against the generated release branch. No auto-merge
   is configured: merging the release PR is the release approval.
4. Merge the release PR into main. On that push, Release Please creates a GitHub
   release and `vX.Y.Z` tag. The same workflow checks out that exact tag, verifies
   its library version and ancestry on main, runs `npm ci`, `npm run check`, and
   `npm run pack`, then publishes dist/ngx-workshop-logger to npm using OIDC.
   Publishing in the same workflow avoids relying on a release event generated
   by GITHUB_TOKEN, which would not start another workflow.

Do not manually bump versions for ordinary releases. Pushing code updates the
release PR; npm publication happens after that PR is merged. The workflow has no
path filter so a release PR merge always reaches release detection.

## Recovering a failed publication

If GitHub created the release but npm publishing failed, fix the cause, then run
**Release and publish ngx-workshop-logger** manually from main and enter the
existing release tag, for example `v0.0.2`. This builds the tagged source, not the
latest main source. The tag must exist, match the library version, and belong to
main's history. If the tagged code needs fixing, make a new release instead.
Rerunning a push after its GitHub release already exists may produce no new
release output; use the manual tag retry in that case. npm never permits replacing
an already published version; check npm before retrying an ambiguous failure.

The seed repository is excluded from release automation. The CLI --github flag
creates/pushes repositories; --deploy handles applications/services rather than
publishing libraries. Package ownership, correct scope permissions, and a public
repository for public provenance remain npm account prerequisites.

References: [Release Please action](https://github.com/googleapis/release-please-action),
[manifest configuration](https://github.com/googleapis/release-please/blob/main/docs/manifest-releaser.md),
[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).
