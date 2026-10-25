import "server-only";

import * as cheerio from "cheerio";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_REDIRECTS = 4;
const MAX_HTML_BYTES = 2_000_000;
const FETCH_TIMEOUT_MS = 10_000;

function isPrivateIpv4(ip: string) {
  const parts = ip.split(".").map(Number);

  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return false;
  }

  const [a, b] = parts;

  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function isPrivateIpv6(ip: string) {
  const normalized = ip.toLowerCase();

  return (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:")
  );
}

function isPrivateIp(ip: string) {
  const version = isIP(ip);

  if (version === 4) {
    return isPrivateIpv4(ip);
  }

  if (version === 6) {
    return isPrivateIpv6(ip);
  }

  return true;
}

async function validatePublicUrl(rawUrl: string) {
  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("That doesn't look like a valid URL.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only public HTTP or HTTPS URLs are supported.");
  }

  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "0.0.0.0"
  ) {
    throw new Error("Local or private URLs are not supported.");
  }

  if (isIP(hostname) && isPrivateIp(hostname)) {
    throw new Error("Local or private URLs are not supported.");
  }

  const resolved = await lookup(hostname, {
    all: true,
    verbatim: true,
  });

  if (
    resolved.length === 0 ||
    resolved.some((entry) => isPrivateIp(entry.address))
  ) {
    throw new Error("This URL does not resolve to a public address.");
  }

  return url;
}

async function fetchPublicHtml(
  initialUrl: string,
): Promise<{ html: string; finalUrl: string }> {
  let currentUrl = await validatePublicUrl(initialUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      FETCH_TIMEOUT_MS,
    );

    let response: Response;

    try {
      response = await fetch(currentUrl, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: "text/html,application/xhtml+xml",
          "User-Agent":
            "Mozilla/5.0 (compatible; PlotTwist/1.0; +https://plottwist.app)",
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    if (
      response.status >= 300 &&
      response.status < 400
    ) {
      const location = response.headers.get("location");

      if (!location) {
        throw new Error("The page redirected without a destination.");
      }

      const nextUrl = new URL(location, currentUrl);

      currentUrl = await validatePublicUrl(nextUrl.toString());
      continue;
    }

    if (!response.ok) {
      throw new Error(
        `The page couldn't be read (HTTP ${response.status}).`,
      );
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new Error(
        "This link does not appear to be a readable web page.",
      );
    }

    const declaredLength = Number(
      response.headers.get("content-length") ?? "0",
    );

    if (
      Number.isFinite(declaredLength) &&
      declaredLength > MAX_HTML_BYTES
    ) {
      throw new Error("This page is too large for PlotTwist to read.");
    }

    const html = await response.text();

    if (Buffer.byteLength(html, "utf8") > MAX_HTML_BYTES) {
      throw new Error("This page is too large for PlotTwist to read.");
    }

    return {
      html,
      finalUrl: currentUrl.toString(),
    };
  }

  throw new Error("The page redirected too many times.");
}

function extractReadableText(html: string) {
  const $ = cheerio.load(html);

  $(
    [
      "script",
      "style",
      "noscript",
      "svg",
      "canvas",
      "iframe",
      "nav",
      "footer",
      "header",
    ].join(","),
  ).remove();

  const preferredSelectors = [
    "main",
    "article",
    "[role='main']",
    ".job-description",
    ".jobDescription",
    "#job-description",
    "#jobDescription",
  ];

  let text = "";

  for (const selector of preferredSelectors) {
    const candidate = $(selector)
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim();

    if (candidate.length > text.length) {
      text = candidate;
    }
  }

  const bodyText = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  if (bodyText.length > text.length) {
    text = bodyText;
    }
return text;
}

export async function readPublicJobUrl(rawUrl: string) {
  const { html, finalUrl } = await fetchPublicHtml(rawUrl);

  const text = extractReadableText(html);

  if (text.length < 200) {
    throw new Error(
      "PlotTwist couldn't find enough readable job-posting text on this page.",
    );
  }

  const trimmedText =
  text.length <= 50_000
    ? text
    : `${text.slice(0, 35_000)}\n\n${text.slice(-15_000)}`;

return { text: trimmedText, finalUrl };
}