# Plan

Pin the workspace Angular runtime/compiler, CLI/build, and ng-packagr to 21.1.0;
lower package peers to ^21.1.0 and regenerate the lockfile with normal npm
resolution. Update both READMEs and development compatibility guidance.
Run npm run check and npm run pack, inspect package peers and compilation metadata,
and install/use the tarball in a disposable Angular 21.1.0 consumer.
Do not change MFE Angular versions or existing consumer work. Leave release
versioning to the existing release-please process (docs/publishing.md).
No constitution deviations; no runtime API or backend contract change.

Reference: https://angular.dev/tools/libraries/creating-libraries — applications
should use an Angular version at least as new as their libraries' build version.
