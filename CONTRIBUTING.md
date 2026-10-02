# Developer notes

## Running tests

```sh
yarn playwright install  # One-time: download the test browsers
yarn test                # Run tests once, in headless Chromium
yarn test:watch          # Run tests in watch mode
yarn typecheck   # Type-check with tsc
yarn lint        # Lint with oxlint
yarn format      # Format with oxfmt
yarn build       # Build dist/ with tsdown
```

## Releasing

Releases are automated with [release-please](https://github.com/googleapis/release-please). Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `feat!:` ...) when merging to `main`. release-please keeps a "release PR" open with the version bump and changelog; merging it tags a GitHub release and publishes the package to the GitHub Packages npm registry.

## Contacting me

I'm on Twitter as [@rstacruz](https://twitter.com/rstacruz), hit me up for any questions at all. I'm happy to help!
