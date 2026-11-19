import getClient from "./mongodb";

const DB_NAME = "url_shortener";
const COLLECTION_NAME = "links";

// MongoDB's error code for a unique index violation.
export const DUPLICATE_KEY_ERROR = 11000;

let indexReady;

async function linksCollection() {
  const client = await getClient();
  const collection = client.db(DB_NAME).collection(COLLECTION_NAME);

  // A unique index is what actually guarantees aliases are never reused: two
  // requests racing for the same alias both reach the database, and exactly one
  // of them survives. createIndex is idempotent, so this runs once per process.
  indexReady ??= collection.createIndex({ alias: 1 }, { unique: true });
  await indexReady;

  return collection;
}

export async function findUrlByAlias(alias) {
  const links = await linksCollection();
  const link = await links.findOne({ alias });

  return link?.url ?? null;
}

export async function createLink(alias, url) {
  const links = await linksCollection();

  await links.insertOne({ alias, url, createdAt: new Date() });
}
