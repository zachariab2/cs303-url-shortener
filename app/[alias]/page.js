import { notFound, redirect } from "next/navigation";

import { findUrlByAlias } from "@/lib/links";

// Aliases are created at runtime, so this route can never be cached or
// prerendered — every visit has to ask the database where to go.
export const dynamic = "force-dynamic";

export default async function AliasPage({ params }) {
  const { alias } = await params;
  const url = await findUrlByAlias(alias);

  if (!url) {
    notFound();
  }

  // Server-side redirect, so the visitor is on their way before any of this
  // page renders and without having to click anything.
  redirect(url);
}
