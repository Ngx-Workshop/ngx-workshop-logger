# Library adoption and release

This repository has adopted the Angular library seed as the shared workshop logger.
The starter LibraryCard is replaced with WorkshopLogger, transport contracts, DI
configuration, tests, and a demo. Read the local Spec Kit workflow before feature work.

Before release, verify package ownership and trusted publishing using
[publishing.md](publishing.md), review the version in the library package.json,
and run `npm run check` and `npm run pack`. The root package remains private;
publish only dist/ngx-workshop-logger. Install the resulting tarball in a target
MFE or shell and verify its browser console before broader adoption.

Consumers need Angular core/common ^21.2.25. Independently bootstrapped applications
configure their own logger. The mock backend is the only built-in backend transport;
a real endpoint and its authentication/serialization contract need separate work.

The demo:build:pages script prepares a repository base href for optional static
hosting. Hosting and npm publication are separate actions.
