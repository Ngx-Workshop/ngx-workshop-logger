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


## Logger verification

`projects/ngx-workshop-logger/src/lib/workshop-logger.service.spec.ts` checks all
three severities, exact first-line synthwave glow and second-line color-only style,
grouped `console.table` data, the two-line UTC timestamp/severity and origin/message
format, literal format tokens, data-only/falsy payloads, circular objects, plain
output, DI defaults, target overrides, threshold filtering, mock acknowledgement,
and backend failure propagation. These are local unit checks; they do not verify
an external backend or actual inspector rendering.

To inspect manually, run `npm start`, open the browser inspector console, and use
each severity button. Select Mock backend to see an explicit mock acknowledgement;
select Both to see console output and acknowledgement. Expand the console object
group and verify that only its first line glows while the second line and native
line shares its color without the glow. The native table uses default rendering.
No network request is expected.
