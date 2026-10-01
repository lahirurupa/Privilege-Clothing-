import crypto from "node:crypto";


export function createSlug(name) {

  const cleanName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");


  const uniquePart =
    crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 8);


  return `${cleanName}-${uniquePart}`;
}