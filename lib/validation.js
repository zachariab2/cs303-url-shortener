// These validators are imported by both the browser form and the API route, so
// the two can never disagree about what counts as a valid link. Each returns an
// error message to show the user, or null when the value is acceptable.

const ALIAS_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;

// Short links live at the root of the URL space (/<alias>), so anything the app
// itself serves has to be off limits.
const RESERVED_ALIASES = new Set([
  "api",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

export function validateUrl(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Enter a URL to shorten.";
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return "That is not a valid URL. Include the protocol, for example https://example.com";
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return "Only http:// and https:// links can be shortened.";
  }

  // new URL("https://localhost") parses happily, but it is not somewhere a
  // shared short link can take anyone.
  if (!parsed.hostname.includes(".")) {
    return "That URL is missing a valid domain name.";
  }

  return null;
}

export function validateAlias(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Choose an alias for your short link.";
  }

  if (!ALIAS_PATTERN.test(trimmed)) {
    return "Aliases can only use letters, numbers, hyphens and underscores, up to 32 characters.";
  }

  if (RESERVED_ALIASES.has(trimmed.toLowerCase())) {
    return `"${trimmed}" is reserved by the app. Pick a different alias.`;
  }

  return null;
}
