# Importer

Code for the importer app.

## Tech Stack

Cloudflare Workers, R2, Hono, Drizzle, Zod, Scalar

## Run Locally

Clone the project

```bash
  git clone https://github.com/mislavjc/planino
```

Go to the project directory

```bash
  cd planino
```

Install dependencies

```bash
  pnpm install
```

Start the dev server

```bash
  turbo dev --filter importer
```

## Deployment

To deploy this app run

```bash
  npm run deploy:importer
```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.wrangler.toml` file.

## `[vars]`

`DATABASE_URL`
`R2_ACCESS_KEY_ID`
`R2_SECRET_ACCESS_KEY`
`R2_ENDPOINT`
`R2_BUCKET_NAME`
`OPENAI_API_KEY`

## `[[r2_buckets]]`

`binding`
`bucket_name`
`preview_bucket_name`

## API Reference

API reference can be found when accessing `/reference` for interactive docs or `/doc` for OpenAPI schema.
