import { NextResponse } from "next/server";

import { createLink, DUPLICATE_KEY_ERROR } from "@/lib/links";
import { validateAlias, validateUrl } from "@/lib/validation";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request body." }, { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url.trim() : "";
  const alias = typeof body.alias === "string" ? body.alias.trim() : "";

  // The form runs these same checks for instant feedback, but the server repeats
  // them because anyone can post here directly and skip the browser entirely.
  const validationError = validateUrl(url) ?? validateAlias(alias);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    await createLink(alias, url);
  } catch (error) {
    if (error?.code === DUPLICATE_KEY_ERROR) {
      return NextResponse.json(
        { error: `The alias "${alias}" is already taken. Try another one.` },
        { status: 409 }
      );
    }

    console.error("Failed to create short link:", error);
    return NextResponse.json(
      { error: "Something went wrong saving your link. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ alias }, { status: 201 });
}
