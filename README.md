# ngx-workshop-logger

Angular 21 library scaffolded from seed-ngx-library. Published package: @tmdjr/ngx-workshop-logger.
Use Node.js 22.12+ (or 24+) and npm 11.6+.

## Development

```sh
npm ci
npm start
# In a second terminal, rebuild library changes:
npm run watch
npm run check
npm run pack
```

The demo runs at http://localhost:4200 and imports the built package through its public API.
The workspace is private; publish only dist/ngx-workshop-logger. Run npm install first if created with --no-install and no lockfile.

## Publishing

Read [publishing](docs/publishing.md) and [seed adoption](docs/seed-adoption.md).
CI validates tests, builds, and the package tarball. The manual publish.yml workflow publishes
the version in projects/ngx-workshop-logger/package.json using npm trusted publishing after setup.
The CLI --github option creates the repository; it does not publish to npm.
