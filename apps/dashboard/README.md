# Dashboard

Code for the dashboard app.

## Tech Stack

Next.js, RadixUI, Zod, Auth.js, Drizzle, Tailwind

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
  turbo dev --filter dashboard
```

## Deployment

To deploy this app run

```bash
  turbo build --filter dashboard
```

```bash
  turbo start --filter dashboard
```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env.local` file.

`AUTH_GOOGLE_ID`
`AUTH_GOOGLE_SECRET`
`AUTH_SECRET`

`DATABASE_URL`

`IMPORTER_URL`
`IMPORTER_OPENAPI_URL`

`OPENAI_API_KEY`
