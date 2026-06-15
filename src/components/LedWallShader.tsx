"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   LED WALL — Honmoon Mandala Shader (Performance-Optimized)
   
   Adaptive quality based on device capability:
   - High: 2x DPR, full FBM (5 octaves), 3 nebula layers, 60fps
   - Mid:  1.5x DPR, reduced FBM (3 octaves), 2 nebula layers, 30fps
   - Low:  1x DPR, minimal FBM (2 octaves), 1 nebula layer, 24fps
   
   IntersectionObserver pauses rendering when off-screen.
   Tab-hidden detection stops all GPU work.
   ═══════════════════════════════════════════════════════════════════ */

/* ── Device Tier Detection ── */
type Tier = "high" | "mid" | "low";

function detectTier(): Tier {
  if (typeof window === "undefined") return "mid";
  try {
    const ua = navigator.userAgent || "";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
    // Old mobile OS — alternation patterns (no character-class ranges) for max compat
    const isOldMobile =
      /Android [4]|Android [5]|Android [6]|Android [7]/i.test(ua) ||
      /iPhone OS 8|iPhone OS 9|iPhone OS 10|iPhone OS 11|iPhone OS 12/i.test(ua) ||
      /iPad.*CPU OS 8|iPad.*CPU OS 9|iPad.*CPU OS 10|iPad.*CPU OS 11|iPad.*CPU OS 12/i.test(ua);
    if (isOldMobile) return "low";

    // Check GPU via WebGL debug info
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl");
    if (!gl) return "low";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const renderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)).toLowerCase();
      // Known weak GPUs — alternation only, no char-class ranges
      if (
        /mali-g|mali-t|mali-4/i.test(renderer) ||
        /adreno 3\d\d|adreno 4\d\d|adreno 5\d\d/i.test(renderer) ||
        /powervr sgx/i.test(renderer) ||
        /hd graphics 2\d\d\d|hd graphics 3\d\d\d|hd graphics 4\d\d\d/i.test(renderer)
      ) {
        return isMobile ? "low" : "mid";
      }
    }
    // Max texture size as rough proxy for GPU capability
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (maxTex < 4096) return "low";

    // Memory heuristic
    const nav = navigator as any;
    if (nav.deviceMemory && nav.deviceMemory <= 2) return "low";
    if (nav.deviceMemory && nav.deviceMemory <= 4 && isMobile) return "mid";

    // Hardware concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return "low";
    if (isMobile) return "mid";

    return "high";
  } catch {
    return "mid";
  }
}

/* ── Tier Configuration ── */
const TIER_CONFIG = {
  high: { maxDpr: 2, fbmOctaves: 5, nebulaLayers: 3, targetFps: 60 },
  mid:  { maxDpr: 1.5, fbmOctaves: 3, nebulaLayers: 2, targetFps: 30 },
  low:  { maxDpr: 1, fbmOctaves: 2, nebulaLayers: 1, targetFps: 24 },
};

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/* ── Fragment shader with quality uniform ── */
const FRAG = `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_darkMode;
uniform float u_fbmOctaves;
uniform float u_nebulaLayers;

#define PI 3.14159265359
#define TAU 6.28318530718

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    if (float(i) >= u_fbmOctaves) break;
    val += amp * vnoise(p);
    p *= 2.07;
    amp *= 0.52;
  }
  return val;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution;
  float t = u_time;
  
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uvC = uv * vec2(1.0 / aspect, 1.0);
  float dist  = length(uvC);
  float angle = atan(uvC.y, uvC.x);

  float tunnelZ = 1.0 / max(dist, 0.01);
  float zScroll = t * 1.2;
  float zPos = tunnelZ + zScroll;

  float centerFade = smoothstep(0.0, 0.45, dist);

  float ring1 = sin(zPos * 6.0) * 0.5 + 0.5;
  float ring2 = sin(zPos * 12.0 + 0.5) * 0.5 + 0.5;
  float ring3 = sin(zPos * 24.0 + 1.0) * 0.5 + 0.5;
  float pulse = sin(t * 0.8) * 0.15 + 0.85;
  float ringPattern = (ring1 * 0.50 + ring2 * 0.30 + ring3 * 0.20) * pulse * centerFade;

  float mRing1 = sin(dist * 12.0 - t * 2.5) * 0.5 + 0.5;
  float mRing2 = sin(dist * 20.0 - t * 3.8 + 0.7) * 0.5 + 0.5;
  float mRing3 = sin(dist * 30.0 - t * 5.0 + 1.3) * 0.5 + 0.5;
  float mRing4 = sin(dist * 7.0 - t * 1.5 + 2.0) * 0.5 + 0.5;
  float edgeBoost = smoothstep(0.15, 0.85, dist);
  float mandalaRings = (mRing1 * 0.35 + mRing2 * 0.30 + mRing3 * 0.20 + mRing4 * 0.15) * (0.5 + edgeBoost * 0.5);

  float spiral1 = pow(abs(sin(angle * 3.0 + zPos * 2.0 - t * 1.5)), 12.0);
  float spiral2 = pow(abs(sin(angle * 5.0 - zPos * 1.5 + t * 2.0)), 16.0);
  float spiral3 = pow(abs(sin(angle * 2.0 + zPos * 3.0 - t * 0.7)), 8.0);
  float spiral4 = pow(abs(sin(angle * 7.0 + zPos * 1.8 + t * 1.0)), 20.0);
  float spiralPattern = (spiral1 * 0.35 + spiral2 * 0.25 + spiral3 * 0.15 + spiral4 * 0.25) * 0.4;
  spiralPattern *= (0.5 + edgeBoost * 0.5);

  float neon1 = pow(abs(sin(zPos * 8.0 - t * 2.0)), 30.0);
  float neon2 = pow(abs(sin(zPos * 14.0 - t * 3.5 + 0.7)), 40.0);
  float neon3 = pow(abs(sin(zPos * 20.0 - t * 5.0 + 1.3)), 50.0);
  float neon4 = pow(abs(sin(dist * 16.0 - t * 4.0 + 0.3)), 35.0);
  float neonPattern = (neon1 * 0.35 + neon2 * 0.25 + neon3 * 0.15 + neon4 * 0.25) * (0.6 + edgeBoost * 0.4);

  float cLine1 = pow(abs(sin(angle * 2.0 + dist * 10.0 - t * 1.8)), 8.0);
  float cLine2 = pow(abs(sin(angle * 3.0 - dist * 8.0 + t * 2.2)), 10.0);
  float cLine3 = pow(abs(sin(angle * 5.0 + dist * 16.0 - t * 2.5 + 0.5)), 14.0);
  float contourLines = (cLine1 * 0.40 + cLine2 * 0.35 + cLine3 * 0.25) * (0.4 + edgeBoost * 0.6);

  float petal6 = pow(abs(sin(angle * 3.0 + t * 0.3)), 6.0);
  float petal8 = pow(abs(sin(angle * 4.0 - t * 0.4 + 0.5)), 8.0);
  float petal12 = pow(abs(sin(angle * 6.0 + t * 0.5 + 1.0)), 12.0);
  float p6 = petal6 * smoothstep(0.05, 0.35, dist) * (1.0 - smoothstep(0.5, 0.9, dist));
  float p8 = petal8 * smoothstep(0.1, 0.45, dist) * (1.0 - smoothstep(0.6, 1.0, dist));
  float p12 = petal12 * smoothstep(0.15, 0.55, dist) * (1.0 - smoothstep(0.7, 1.1, dist));
  float petalPattern = (p6 * 0.45 + p8 * 0.35 + p12 * 0.20) * (sin(t * 0.6) * 0.1 + 0.9);

  /* ═══ GASEOUS NEBULA — quality-scaled ═══ */
  float nebulaMask = 1.0 - smoothstep(0.0, 0.55, dist);
  float nebula = 0.0;

  // Layer 1 — always present
  vec2 nebUV = vec2(angle * 1.5 / TAU + t * 0.04, tunnelZ * 0.15 - t * 0.25);
  vec2 warpA = vec2(
    fbm(nebUV * 1.2 + vec2(1.7, 9.2) + t * 0.06),
    fbm(nebUV * 1.2 + vec2(8.3, 2.8) + t * 0.05)
  );
  float neb1 = fbm(nebUV + warpA * 1.8);
  nebula = neb1 * 0.6;

  // Layer 2 — mid+ quality
  if (u_nebulaLayers >= 2.0) {
    vec2 nebUV2 = vec2(angle * 2.5 / TAU - t * 0.03, tunnelZ * 0.2 - t * 0.35 + 5.0);
    vec2 warpB = vec2(
      fbm(nebUV2 * 1.4 + vec2(3.1, 7.4) + t * 0.04),
      fbm(nebUV2 * 1.4 + vec2(6.2, 1.3) + t * 0.06)
    );
    float neb2 = fbm(nebUV2 + warpB * 1.5);
    nebula = neb1 * 0.45 + neb2 * 0.35;
  }

  // Layer 3 — high quality only
  if (u_nebulaLayers >= 3.0) {
    vec2 nebUV3 = vec2(angle * 4.0 / TAU + t * 0.055, tunnelZ * 0.25 - t * 0.45 + 10.0);
    float neb3 = fbm(nebUV3 + vec2(fbm(nebUV3 * 1.6 + t * 0.03), 0.0));
    nebula = neb1 * 0.45 + neb2 * 0.35 + neb3 * 0.20;
  }

  nebula *= nebulaMask;
  nebula = smoothstep(0.1, 0.7, nebula);

  /* ═══ COLORS ═══ */
  vec3 purple = vec3(0.667, 0.157, 1.0);
  vec3 pink   = vec3(1.0, 0.176, 0.471);
  vec3 blue   = vec3(0.31, 0.55, 1.0);
  
  float darkPhase = fract(t * 0.08);
  vec3 darkCol;
  if (darkPhase < 0.333) {
    darkCol = mix(purple, pink, smoothstep(0.0, 0.333, darkPhase));
  } else if (darkPhase < 0.667) {
    darkCol = mix(pink, blue, smoothstep(0.333, 0.667, darkPhase));
  } else {
    darkCol = mix(blue, purple, smoothstep(0.667, 1.0, darkPhase));
  }
  darkCol = mix(darkCol, purple * 0.8, dist * 0.2);

  vec3 gold  = vec3(0.96, 0.62, 0.04);
  vec3 cream = vec3(0.996, 0.953, 0.78);
  
  float hue = fract(t * 0.06 + dist * 0.35);
  vec3 rainbow = hsv2rgb(vec3(hue, 0.45, 1.0));
  
  vec3 lightCol = mix(gold, rainbow, smoothstep(0.0, 0.45, dist));
  lightCol = mix(cream, lightCol, smoothstep(0.03, 0.2, dist));
  
  vec3 pastelPink  = vec3(0.976, 0.659, 0.831);
  vec3 pastelBlue  = vec3(0.576, 0.773, 0.992);
  vec3 pastelMint  = vec3(0.431, 0.906, 0.718);
  lightCol = mix(lightCol, pastelPink, (sin(t * 0.4 + dist * 2.0) * 0.5 + 0.5) * 0.18 * smoothstep(0.2, 0.6, dist));
  lightCol = mix(lightCol, pastelBlue, (sin(t * 0.3 + dist * 1.5 + 1.0) * 0.5 + 0.5) * 0.15 * smoothstep(0.3, 0.7, dist));
  lightCol = mix(lightCol, pastelMint, (sin(t * 0.35 + dist * 1.8 + 2.0) * 0.5 + 0.5) * 0.12 * smoothstep(0.4, 0.8, dist));

  vec3 color = mix(lightCol, darkCol, u_darkMode);
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(lum), color, mix(1.0, 1.6, u_darkMode));

  vec3 nebDark = mix(purple * 0.55, pink * 0.45, sin(angle + t * 0.2) * 0.5 + 0.5);
  nebDark = mix(nebDark, blue * 0.5, sin(dist * 3.0 - t * 0.5) * 0.5 + 0.5);
  nebDark = mix(nebDark, purple * 0.7, sin(t * 0.15 + angle * 2.0) * 0.5 + 0.5);
  vec3 nebLight = mix(gold * 0.45, rainbow * 0.4, smoothstep(0.0, 0.5, dist));
  nebLight = mix(nebLight, cream * 0.6, 1.0 - nebulaMask);
  vec3 nebColor = mix(nebLight, nebDark, u_darkMode);

  /* ═══ COMPOSITE ═══ */
  float brightness = ringPattern * 0.25
    + mandalaRings * 0.20
    + contourLines * 0.15
    + neonPattern * 0.15
    + petalPattern * 0.10
    + spiralPattern * 0.10
    + spiralPattern * 0.05;

  vec3 centerColor = mix(vec3(0.85, 0.8, 0.65), vec3(0.7, 0.6, 0.85), u_darkMode);
  float centerTotal = exp(-dist * 5.5) + exp(-dist * 14.0) * 0.3;

  float vignette = 1.0 - smoothstep(0.3, 1.6, length(uv * 0.65));

  vec3 finalColor = vec3(0.0);
  finalColor += color * brightness * vignette;
  finalColor += centerColor * centerTotal * vignette * 0.6;
  finalColor += color * spiralPattern * vignette * 0.5;
  finalColor += color * petalPattern * vignette * 0.3;

  finalColor += nebColor * nebula * vignette * 1.2;

  float depthGlow = exp(-dist * 3.0) * 0.15;
  vec3 depthGlowCol = mix(vec3(0.7, 0.6, 0.4), vec3(0.5, 0.4, 0.7), u_darkMode);
  finalColor += depthGlowCol * depthGlow * vignette;

  finalColor *= sin(angle * 6.0 + t * 0.5 + dist * 4.0) * 0.05 + 1.0;

  finalColor *= mix(1.0, smoothstep(1.8, 0.3, dist), u_darkMode * 0.3);

  float lightBloom = smoothstep(0.5, 1.2, dist) * (1.0 - u_darkMode) * 0.08;
  finalColor += vec3(1.0, 0.95, 0.85) * lightBloom * vignette;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default function LedWallShader({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const startedRef = useRef(false);
  const activeRef = useRef(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const darkModeRef = useRef(1.0);
  const darkModeSmoothRef = useRef(1.0);
  const [on, setOn] = useState(false);
  const visibleRef = useRef(true);  // IntersectionObserver
  const tierRef = useRef<Tier>("mid");
  const lastFrameRef = useRef(0);   // Frame rate limiter
  const locCacheRef = useRef<Record<string, WebGLUniformLocation | null>>({});

  /* ── Cache uniform locations (avoids per-frame getUniformLocation calls) ── */
  const getLoc = useCallback((gl: WebGLRenderingContext, program: WebGLProgram, name: string) => {
    if (!(name in locCacheRef.current)) {
      locCacheRef.current[name] = gl.getUniformLocation(program, name);
    }
    return locCacheRef.current[name];
  }, []);

  /* ── Initialize WebGL ── */
  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    // Detect device tier once
    tierRef.current = detectTier();

    const gl = canvas.getContext("webgl", {
      antialias: tierRef.current === "high",  // Only AA on high tier
      alpha: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) return false;

    glRef.current = gl;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("VS:", gl.getShaderInfoLog(vs));
      return false;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("FS:", gl.getShaderInfoLog(fs));
      return false;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Link:", gl.getProgramInfoLog(program));
      return false;
    }

    programRef.current = program;
    gl.useProgram(program);

    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Clear uniform location cache for new program
    locCacheRef.current = {};

    return true;
  }, []);

  /* ── Resize canvas — adaptive DPR ── */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const config = TIER_CONFIG[tierRef.current];
    const dpr = Math.min(window.devicePixelRatio || 1, config.maxDpr);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }, []);

  /* ── Render loop — frame-rate limited ── */
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program) return;

    // Pause when tab hidden OR section not visible
    if (document.hidden || !visibleRef.current) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    // Frame rate limiter
    const config = TIER_CONFIG[tierRef.current];
    const frameInterval = 1000 / config.targetFps;
    const now = performance.now();
    if (now - lastFrameRef.current < frameInterval) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }
    lastFrameRef.current = now;

    resize();

    const elapsed = (now - startTimeRef.current) / 1000.0;

    const target = darkModeRef.current;
    darkModeSmoothRef.current += (target - darkModeSmoothRef.current) * 0.04;

    // Use cached uniform locations
    gl.uniform1f(getLoc(gl, program, "u_time"), elapsed);
    gl.uniform2f(
      getLoc(gl, program, "u_resolution"),
      canvasRef.current!.width,
      canvasRef.current!.height
    );
    gl.uniform1f(getLoc(gl, program, "u_darkMode"), darkModeSmoothRef.current);
    gl.uniform1f(getLoc(gl, program, "u_fbmOctaves"), config.fbmOctaves);
    gl.uniform1f(getLoc(gl, program, "u_nebulaLayers"), config.nebulaLayers);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    rafRef.current = requestAnimationFrame(render);
  }, [resize, getLoc]);

  /* ── Start with power-on delay ── */
  useEffect(() => {
    activeRef.current = active;
    if (active && !startedRef.current) {
      const t = setTimeout(() => {
        startedRef.current = true;
        setOn(true);

        if (initGL()) {
          startTimeRef.current = performance.now();
          lastFrameRef.current = performance.now();
          rafRef.current = requestAnimationFrame(render);
        }
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [active, initGL, render]);

  /* ── IntersectionObserver — pause when off-screen ── */
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [active]);

  /* ── Detect dark/light mode from <html> class ── */
  useEffect(() => {
    if (!active) return;

    const root = document.documentElement;

    const checkTheme = () => {
      const isLight = root.classList.contains("light-mode");
      darkModeRef.current = isLight ? 0.0 : 1.0;
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [active]);

  /* ── Color sync via setInterval — for CSS vars ── */
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (canvas && !sectionRef.current) {
      sectionRef.current = canvas.closest(".manifesto-section") as HTMLElement;
    }

    intervalRef.current = setInterval(() => {
      if (document.hidden || !visibleRef.current) return;
      const el = sectionRef.current;
      if (!el) return;

      const isLight = document.documentElement.classList.contains("light-mode");
      const idx = Math.floor(Date.now() / 3000) % 8;

      const darkColors: Array<[number, number, number]> = [
        [170, 40, 255],   [255, 45, 120],   [79, 140, 255],   [200, 80, 255],
        [255, 45, 120],   [100, 60, 255],   [255, 70, 150],   [120, 100, 255],
      ];

      const lightColors: Array<[number, number, number]> = [
        [245, 158, 11],   [249, 168, 212],  [147, 197, 253],  [253, 230, 138],
        [196, 181, 253],  [110, 231, 183],  [252, 165, 165],  [254, 243, 199],
      ];

      const colors = isLight ? lightColors : darkColors;
      const [r, g, b] = colors[idx];
      el.style.setProperty("--led-r", `${r}`);
      el.style.setProperty("--led-g", `${g}`);
      el.style.setProperty("--led-b", `${b}`);
    }, 300);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="led-video-container">
      <canvas
        ref={canvasRef}
        className="led-video-layer"
        style={{ opacity: on ? 1 : 0 }}
      />
    </div>
  );
}
