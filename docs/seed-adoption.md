# Seed adoption

Prefer ngx-workshop create-library <name> --template <seed-checkout>. It rewrites
ngx-workshop-logger in file paths, Angular projects, scripts, output directories and docs;
sets the chosen npm scope (default @tmdjr), GitHub organization, repository metadata,
and demo port; and creates a fresh Git repository. The generated workspace root is
private, while projects/ngx-<name>/package.json names the publishable package.

For direct cloning, remove the inherited Git history, replace ngx-workshop-logger in
text and paths with ngx-<name>, replace @tmdjr with the desired scope, update the
repository URL and demo port, and regenerate the root package lock with npm install.
Start a new Git repository and configure its origin. Do not publish under the seed name.

Before release:

- Replace LibraryCard, ngx-library-card and the demo content with your domain API.
- Keep all supported exports in src/public-api.ts and use them in the demo.
- Update the library README, description, version and license information.
- Add runtime dependencies deliberately; Angular belongs in peerDependencies.
- Keep compilationMode: partial for npm distribution.
- Run npm run check and npm run pack; install the tarball in a consumer app.
- Configure npm package ownership and trusted publishing per publishing.md.
- CI and manual publishing workflows remain in .github/workflows in generated libraries.

The demo:build:pages script uses a repository-specific base href for optional
static hosting. It creates files only; configure hosting separately if needed.
