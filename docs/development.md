# Development

npm ci installs the locked Angular 21.2 toolchain. npm start builds the library
and serves the demo. The demo resolves the compiled package from dist/, so keep
npm run watch running in a second terminal while editing library code.

npm run build produces the publishable partial-compiled library. npm run demo:build
builds it first, then the production demo. npm run demo:build:pages sets the base
href for repository static hosting. npm test runs the library's Vitest/jsdom suite;
npm run test:watch watches tests. Tests build against the demo target while using
the library's spec config. npm run check runs tests and both production builds.
npm run pack rebuilds and writes the distributable tarball into the workspace root.

No external service, account, browser, or sibling repository is required for local
builds/tests. npm registry access is needed for installation. Node 22.12+ or 24+
is required by Angular; workflows use the current Node 22 release.
