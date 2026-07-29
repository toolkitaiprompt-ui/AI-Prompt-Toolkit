import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const SITEMAP_NAMESPACE = "http://www.sitemaps.org/schemas/sitemap/0.9";
const MAX_URLS = 50_000;
const MAX_BYTES = 50 * 1024 * 1024;
const VALID_CHANGE_FREQUENCIES = new Set([
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
]);

const filePath = resolve(process.argv[2] ?? "public/sitemap.xml");
const sitemapXml = await readFile(filePath, "utf8");
const byteLength = Buffer.byteLength(sitemapXml, "utf8");

function fail(message) {
  console.error(`Sitemap validation failed (${filePath}): ${message}`);
  process.exit(1);
}

if (byteLength > MAX_BYTES) {
  fail(`file is ${byteLength} bytes; Google permits at most ${MAX_BYTES} uncompressed bytes`);
}

if (!sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
  fail('the first line must be <?xml version="1.0" encoding="UTF-8"?>');
}

const syntaxResult = XMLValidator.validate(sitemapXml);
if (syntaxResult !== true) {
  const { line, col, msg } = syntaxResult.err;
  fail(`invalid XML at line ${line}, column ${col}: ${msg}`);
}

const parser = new XMLParser({
  ignoreAttributes: false,
  isArray: (_tagName, jPath) => jPath === "urlset.url",
});
const document = parser.parse(sitemapXml);
const urlset = document.urlset;

if (!urlset || urlset["@_xmlns"] !== SITEMAP_NAMESPACE) {
  fail(`urlset must use the namespace ${SITEMAP_NAMESPACE}`);
}

const entries = urlset.url ?? [];
if (entries.length === 0 || entries.length > MAX_URLS) {
  fail(`found ${entries.length} URLs; a sitemap must contain 1-${MAX_URLS} URLs`);
}

const seenLocations = new Set();
entries.forEach((entry, index) => {
  const entryNumber = index + 1;
  const location = typeof entry.loc === "string" ? entry.loc.trim() : "";

  if (!location) {
    fail(`URL entry ${entryNumber} is missing <loc>`);
  }

  let parsedLocation;
  try {
    parsedLocation = new URL(location);
  } catch {
    fail(`URL entry ${entryNumber} has an invalid <loc>: ${location}`);
  }

  if (parsedLocation.protocol !== "https:" || parsedLocation.hostname !== "aiworldhub.site") {
    fail(`URL entry ${entryNumber} must be an https://aiworldhub.site URL: ${location}`);
  }

  if (seenLocations.has(location)) {
    fail(`duplicate <loc>: ${location}`);
  }
  seenLocations.add(location);

  if (entry.lastmod !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(entry.lastmod))) {
    fail(`URL entry ${entryNumber} has an invalid <lastmod>: ${entry.lastmod}`);
  }

  if (entry.changefreq !== undefined && !VALID_CHANGE_FREQUENCIES.has(String(entry.changefreq))) {
    fail(`URL entry ${entryNumber} has an invalid <changefreq>: ${entry.changefreq}`);
  }

  if (entry.priority !== undefined) {
    const priority = Number(entry.priority);
    if (!Number.isFinite(priority) || priority < 0 || priority > 1) {
      fail(`URL entry ${entryNumber} has an invalid <priority>: ${entry.priority}`);
    }
  }
});

console.log(`Sitemap valid: ${entries.length} unique URLs (${byteLength} bytes) in ${filePath}`);
