# my little airport

A collection of all musical publications, including albums, EPs, singles, compilations, and corresponding tracks, of the Hong Kong based band my little airport. Published at [mylittleairport.app](https://mylittleairport.app).

## Installation

### Basic Installation

1. Clone the repository.
2. Install dependencies.
```
pnpm install
```
3. Run development server at `localhost:3000`.
```
pnpm dev
```

### Data model & build

All site content is edited at [`src/__data`](src/__data). No extra setup is needed to run the site: `pnpm dev` and `pnpm build` automatically regenerate a SQLite database from those files before starting, so there's nothing to install, configure, or import by hand.

Under the hood:

| Piece | Role |
| --- | --- |
| [`src/__data`](src/__data) | Source of truth — one JSON file per album/track/artist, referencing each other by slug. This is what you edit. |
| [`src/services/database/schema.sql`](src/services/database/schema.sql) | Normalized SQLite schema (albums/tracks/artists + join tables) the data is loaded into. |
| [`src/scripts/buildDatabase.mjs`](src/scripts/buildDatabase.mjs) | Rebuilds the SQLite database from `src/__data`. Runs automatically via `predev`/`prebuild`. |
| Generated `.sqlite` file | A gitignored build artifact, not something you edit directly. |
| [`src/services/database/{album,track}.ts`](src/services/database) | Queries the generated database; used by pages' `getStaticProps`/`getStaticPaths`. |

## Contribution

Guidelines for contributions will be published soon. Welcome to modify or provide further information to current data at [`src/__data`](src/__data) by submitting a pull request.

### Known dependency blockers

- [`tsconfig.json`](tsconfig.json) sets `"ignoreDeprecations": "6.0"` and keeps `baseUrl` (alongside `paths`) even though TypeScript has deprecated `baseUrl`-based path resolution. This is required because Next.js still relies on `baseUrl` for its module resolution; removing it breaks path aliases. The flag should be revisited (and ideally removed) once Next.js supports `paths` without `baseUrl`, rather than left permanently suppressed.
- Upgrading `typescript` to 7.x is currently blocked: `typescript-eslint@8.67.0` (the latest stable release) declares `peerDependencies.typescript: ">=4.8.4 <6.1.0"`, so TypeScript 7 is not yet supported by the lint toolchain.
- Upgrading `eslint` to 10.x is currently blocked: `eslint-config-next@16.3.0` bundles `eslint-plugin-react@7.37.5`, which still calls the removed `context.getFilename()` API and crashes under ESLint 10. Node has already been bumped to `^20.19.0 || ^22.13.0 || >=24` (see `.node-version`/`engines`) to be ready once `eslint-config-next` ships ESLint 10 support.

## Credits

All copyright and credits, including album artworks and intellectual propreties, go to my little airport.