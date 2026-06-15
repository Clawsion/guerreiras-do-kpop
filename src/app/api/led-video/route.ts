import { NextRequest, NextResponse } from "next/server";

/* ═══════════════════════════════════════════════════════════════
   LED Video Streaming Proxy (Edge Runtime)
   
   Streams the LED tunnel video from GitHub Releases with:
   - CORS headers (required for canvas pixel sampling)
   - HTTP Range request support (required for video seeking/streaming)
   - Edge runtime for low latency and streaming support
   - Smart caching to minimize upstream requests
   
   Video is stored permanently on GitHub Releases (free, never expires).
   This proxy adds the headers the browser needs that GitHub doesn't provide.
   ═══════════════════════════════════════════════════════════════ */

export const runtime = "edge";

const VIDEO_URL =
  "https://github.com/Clawsion/guerreiras-do-kpop/releases/download/v1.0-led-video/led-tunnel.mp4";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Range, Content-Type",
  "Access-Control-Expose-Headers": "Content-Range, Content-Length, Accept-Ranges",
};

const CACHE_HEADERS: Record<string, string> = {
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function HEAD() {
  try {
    /* Follow redirect to get the actual Azure Blob URL */
    const upstream = await fetch(VIDEO_URL, { method: "GET", redirect: "follow" });
    const contentLength = upstream.headers.get("content-length") || "0";

    return new NextResponse(null, {
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
    return new NextResponse("Upstream error", { status: 502, headers: CORS_HEADERS });
  }
}

/* Cache the video ArrayBuffer in edge memory for fast repeated access */
let videoCache: ArrayBuffer | null = null;
let videoCacheTime = 0;
const CACHE_TTL = 3600_000; // refresh cached video every hour

export async function GET(request: NextRequest) {
  try {
    const rangeHeader = request.headers.get("range");

    /* Use cached video if available and fresh */
    let buf: ArrayBuffer;
    if (videoCache && (Date.now() - videoCacheTime) < CACHE_TTL) {
      buf = videoCache;
    } else {
      /* Fetch the video from GitHub — follows redirect to Azure Blob Storage */
      const upstream = await fetch(VIDEO_URL, {
        method: "GET",
        redirect: "follow",
      });

      if (!upstream.ok) {
        return new NextResponse("Upstream error", { status: upstream.status, headers: CORS_HEADERS });
      }

      buf = await upstream.arrayBuffer();
      videoCache = buf;
      videoCacheTime = Date.now();
    }

    const totalSize = buf.byteLength;
    const contentType = "video/mp4";

    /* Handle HTTP Range requests for video seeking/streaming */
    if (rangeHeader) {
      const match = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : totalSize - 1;
        const clampedEnd = Math.min(end, totalSize - 1);
        const chunkSize = clampedEnd - start + 1;

        const sliced = buf.slice(start, clampedEnd + 1);

        return new NextResponse(sliced, {
          status: 206,
          headers: {
            ...CORS_HEADERS,
            ...CACHE_HEADERS,
            "Content-Type": contentType,
            "Content-Length": String(chunkSize),
            "Content-Range": `bytes ${start}-${clampedEnd}/${totalSize}`,
            "Accept-Ranges": "bytes",
          },
        });
      }
    }

    /* Full response */
    return new NextResponse(buf, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        ...CACHE_HEADERS,
        "Content-Type": contentType,
        "Content-Length": String(totalSize),
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    return new NextResponse("Upstream error", { status: 502, headers: CORS_HEADERS });
  }
}
