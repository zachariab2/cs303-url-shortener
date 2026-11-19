import { MongoClient } from "mongodb";

function connect() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      "Missing MONGO_URI. Add it to .env.local locally, and to the project's environment variables on Vercel."
    );
  }

  return new MongoClient(uri).connect();
}

// The connection is opened on first use rather than at import time, so building
// the app never tries to reach the database.
//
// Next.js re-evaluates modules on every hot reload in development, which would
// otherwise open a fresh connection pool on each save. Caching the promise on
// globalThis keeps a single pool alive across reloads and across invocations.
export default function getClient() {
  globalThis._mongoClientPromise ??= connect().catch((error) => {
    // A failed connection must not be cached, or every later request would be
    // handed the same rejection instead of retrying.
    globalThis._mongoClientPromise = undefined;
    throw error;
  });

  return globalThis._mongoClientPromise;
}
