# Architecture

One Angular workspace contains one independently publishable library and its demo
consumer. The root package is private. ng-packagr generates Angular Package Format
output from the explicit public-api.ts entry point, with partial compilation for
consumers to link. Angular dependencies are peers; tslib is a runtime dependency.

LibraryCard demonstrates a standalone OnPush component with a typed signal input,
content projection, accessible labeling and scoped inline styles. Its test verifies
changes to the public input. The demo imports the scoped package from dist/, not
private source files, so its production build verifies the package's public boundary.

Keep reusable domain logic and components in the library; demo-only composition
belongs in the demo. Do not assume a particular shell, backend, global theme,
Material installation or service contract. Introduce and document those integrations
only when the library needs them.
