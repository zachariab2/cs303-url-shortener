# URL Shortener

CS303 mini project. Turn a long URL into a short alias, then visiting
`YOUR-APP.COM/alias` redirects to the original link.

Built with the Next.js App Router and MongoDB.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root with your MongoDB Atlas connection
   string:

   ```
   MONGO_URI="mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority"
   ```

   In Atlas, under Network Access, allow access from any IP address so the
   deployed version can reach the database.

3. Run the dev server:

   ```bash
   npm run dev
   ```

## Deploying

Add `MONGO_URI` to the project's Environment Variables in the Vercel dashboard
before deploying, otherwise the deployed app cannot reach the database.
`.env.local` is gitignored and is never uploaded.

## How it works

| Path | What it does |
| --- | --- |
| `app/page.js` | Home page; renders the form |
| `app/components/ShortenForm.js` | Client form: validates input, posts to the API, shows errors |
| `app/components/ResultCard.js` | Shows the finished short link with a copy button |
| `app/api/shorten/route.js` | `POST` handler: validates, then stores the alias |
| `app/[alias]/page.js` | Looks up the alias and server-side `redirect()`s to the URL |
| `app/not-found.js` | Shown when an alias does not exist |
| `lib/mongodb.js` | Cached MongoDB connection |
| `lib/links.js` | Reads and writes the `links` collection |
| `lib/validation.js` | URL and alias rules, shared by the form and the API |

Validation lives in one module that both the browser and the server import, so
the two can never disagree. The client checks run first for instant feedback;
the API route runs them again because a client can be bypassed.

Duplicate aliases are prevented by a unique index on `alias`. That holds even if
two people submit the same alias at the same moment — the database rejects the
second write, and the API turns that into a "that alias is taken" message.
