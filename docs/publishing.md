# Publishing

The root workspace is private. The package manifest lives in
projects/ngx-workshop-logger/package.json; only dist/ngx-workshop-logger is published.
The initial package version is 0.0.1. Commit explicit semantic version changes in
the library manifest before every release; versions are not generated from CI runs.

1. Confirm the package name (@tmdjr/ngx-workshop-logger after seed customization),
   GitHub repository URL, license, README, public exports and peer ranges.
2. Run npm ci, npm run check, and npm run pack. Inspect/install the root tarball in
   a consuming Angular application before publishing a new public API.
3. For a new npm package, bootstrap the first release from dist/ngx-workshop-logger
   using npm publish --access public with an authorized npm account and its required
   authentication. Configure its trusted publisher in npm package settings with
   the GitHub organization, new repository name, and workflow filename publish.yml.
   Choose the publish action if the settings request allowed actions.
4. Dispatch Publish from main in GitHub Actions for subsequent unused versions.
   The workflow uses OIDC (id-token: write) and npm 11.6.0. No npm token is stored.

The seed repository itself is excluded from publishing. CI can run on every push
and pull request; publication is manual. The CLI --github flag only creates/pushes
the repository. CLI --deploy is for applications/services and does not publish libraries.

npm publishing requires package ownership and the correct scope permissions.
Trusted publishing setup is an account operation and is not performed by scaffolding.
Public provenance also requires a public source repository; review npm's requirements
before publishing from a private GitHub repository.

References: [Angular library packaging](https://angular.dev/tools/libraries/creating-libraries)
and [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).
