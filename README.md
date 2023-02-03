# Jira Clone in SvelteKit

This simplified Jira clone is built with SvelteKit, Typescript, Zod, Supabase, Prisma, Sass. Auto formatted with Prettier. It is based on this original [`Jira Clone`](https://github.com/oldboyxx/jira_clone) which is built with React & Node/Express.

## Project Setup

- Clone the project

```sh
git
```

- Install dependencies

```sh
npm i
```

## Database

- Register and create a Supabase database url and shadow database url for [`Prisma`](https://supabase.com/docs/guides/integrations/prisma)

- Update or create a `.env` file with the following content:

```
DATABASE_URL="..."
SHADOW_DATABASE_URL="..."
JWT_SECRET="..."
PUBLIC_CONTACT_EMAIL="..."
PUBLIC_GITHUB_URL="..."
PUBLIC_PERSONAL_WEBSITE_URL="..."
```

- Create a database from the Prisma schema

```sh
npx prisma db push
```

## Developing

After installing dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of the app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
