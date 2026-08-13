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

### Using MongoDB (optional)

Data files are available at [`src/__data`](src/__data) and act as a database for generating the pages. MongoDB (Mongoose) are used as an alternative database to manipulate the files. If you wish to use these specific database functions, additional setup is needed. 

1. Create a MongoDB cluster.
2. Clone [`.env.local.example`](.env.local.example).
3. Paste your [connection string](https://www.mongodb.com/docs/drivers/node/current/quick-start/create-a-connection-string/#copy-your-connection-string) as the value of `MONGODB_URI`.
```
MONGODB_URI=<CONNECTION_STRING>
```
4. Save the file as `.env.local`.

You may then run the server and import the data into your cluster.

5. Run development server at `localhost:3000`.
```
pnpm dev
```
6. Call API `localhost:3000/api/import`.

Certain functions on Next.js SSG function `getStaticProps` can be replaced to fetch from MongoDB instead. Example functions are included in [`src/services/database/*`](src/services/database).

For more details on setup, reference [MongoDB documentation](https://www.mongodb.com/docs/drivers/node/current/quick-start/).

## Contribution

Guidelines for contributions will be published soon. Welcome to modify or provide further information to current data at [`src/__data`](src/__data) by submitting a pull request.

### Known dependency blockers

- [`tsconfig.json`](tsconfig.json) sets `"ignoreDeprecations": "6.0"` and keeps `baseUrl` (alongside `paths`) even though TypeScript has deprecated `baseUrl`-based path resolution. This is required because Next.js still relies on `baseUrl` for its module resolution; removing it breaks path aliases. The flag should be revisited (and ideally removed) once Next.js supports `paths` without `baseUrl`, rather than left permanently suppressed.
- Upgrading `typescript` to 7.x is currently blocked: `typescript-eslint@8.67.0` (the latest stable release) declares `peerDependencies.typescript: ">=4.8.4 <6.1.0"`, so TypeScript 7 is not yet supported by the lint toolchain.
- Upgrading `eslint` to 10.x is currently blocked: `eslint-config-next@16.3.0` bundles `eslint-plugin-react@7.37.5`, which still calls the removed `context.getFilename()` API and crashes under ESLint 10. Node has already been bumped to `^20.19.0 || ^22.13.0 || >=24` (see `.node-version`/`engines`) to be ready once `eslint-config-next` ships ESLint 10 support.

## Credits

All copyright and credits, including album artworks and intellectual propreties, go to my little airport.