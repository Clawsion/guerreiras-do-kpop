/**
 * LED Video Streaming Proxy — Cloudflare Pages Function
 *
 * Streams the LED tunnel video from GitHub Releases with:
 * - CORS headers (required for canvas pixel sampling in the browser)
 * - HTTP Range request support (required for video seeking/streaming)
 * - Cloudflare Cache API for edge caching (no upstream request on cache hit)
 *
 * Video is stored permanently on GitHub Releases (free, never expires).
 * This function adds the headers the browser needs that GitHub doesn't provide.
 */

const VIDEO_URL =
  "https://github.com/Clawsion/guerreiras-do-kpop/releases/download/v1.0-led-video/led-tunnel.mp4";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Range, Content-Type",
  "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges",
};

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
};

/**
 * Fetch video from GitHub with CORS headers, using Cloudflare Cache API
 */
async function fetchVideo(request, rangeHeader) {
  const cache = caches.default;
  const cacheKey = new Request(VIDEO_URL, { method: "GET" });

  // Try Cloudflare Cache first
  let response = await cache.match(cacheKey);
  let body;

  if (response) {
    body = await response.arrayBuffer();
  } else {
    // Fetch from GitHub Releases (follows redirect to Azure Blob)
    const upstream = await fetch(VIDEO_URL, {
      method: "GET",
      redirect: "follow",
      headers: rangeHeader ? { Range: rangeHeader } : undefined,
    });

    if (!upstream.ok) {
      return new Response("Upstream error", { status: upstream.status, headers: CORS_HEADERS });
    }

    body = await upstream.arrayBuffer();

    // Store in Cloudflare Cache for future requests (cache for 1 day)
    const cacheResponse = new Response(body, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(body.byteLength),
        "Cache-Control": "public, max-age=86400",
      },
    });
    await cache.put(cacheKey, cacheResponse);
  }

  const totalSize = body.byteLength;

  // Handle HTTP Range requests for video seeking/streaming
  if (rangeHeader) {
    const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
    if (match) {
      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : totalSize - 1;
      const clampedEnd = Math.min(end, totalSize - 1);
      const chunkSize = clampedEnd - start + 1;

      const sliced = body.slice(start, clampedEnd + 1);

      return new Response(sliced, {
        status: 206,
        headers: {
          ...CORS_HEADERS,
          ...CACHE_HEADERS,
          "Content-Type": "video/mp4",
          "Content-Length": String(chunkSize),
          "Content-Range": `bytes ${start}-${clampedEnd}/${totalSize}`,
          "Accept-Ranges": "bytes",
        },
      });
    }
  }

  // Full response
  return new Response(body, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      ...CACHE_HEADERS,
      "Content-Type": "video/mp4",
      "Content-Length": String(totalSize),
      "Accept-Ranges": "bytes",
    },
  });
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// Handle HEAD requests
export async function onRequestHead(context) {
  try {
    const upstream = await fetch(VIDEO_URL, { method: "GET", redirect: "follow" });
    const contentLength = upstream.headers.get("content-length") || "0";

    return new Response(null, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        ...CACHE_HEADERS,
        "Content-Type": "video/mp4",
        "Content-Length": contentLength,
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return new Response("Upstream error", { status: 502, headers: CORS_HEADERS });
  }
}

// Handle GET requests
export async function onRequestGet(context) {
  try {
    const rangeHeader = context.request.headers.get("range");
    return await fetchVideo(context.request, rangeHeader);
  } catch (error) {
    return new Response("Upstream error", { status: 502, headers: CORS_HEADERS });
  }
}
