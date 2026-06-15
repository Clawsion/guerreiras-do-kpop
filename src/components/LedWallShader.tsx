"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   LED WALL — Honmoon Mandala Shader
   
   Tunnel/mandala with organic contour lines, petals, spirals,
   neon accents — inspired by the Honmoon aesthetic.
   Fills the ENTIRE LED wall screen edge to edge.
   
   Dark mode (night): Neon Purple / Pink / Blue cycling
   Light mode (day): Golden / Iridescent Rainbow pastels
   Same animation, same timing — only colors change.
   Seamless infinite loop. GPU-rendered at native resolution.
   Auto-detects theme via MutationObserver on <html> class.
   ═══════════════════════════════════════════════════════════════════ */

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_darkMode;   // 1.0 = dark/night, 0.0 = light/day

#define PI 3.14159265359
#define TAU 6.28318530718

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

/* ── Hash-based value noise for gaseous effect ── */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f); // smoothstep
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

/* Fractal Brownian Motion — layered noise for clouds/gas */
float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    val += amp * noise(p);
    p *= 2.1;
    amp *= 0.5;
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

  /* ═══ TUNNEL DEPTH — core expanding rings ═══ */
  float tunnelZ = 1.0 / max(dist, 0.01);
  float zScroll = t * 1.2;
  float zPos = tunnelZ + zScroll;

  /* Main rings */
  float ring1 = sin(zPos * 6.0) * 0.5 + 0.5;
  float ring2 = sin(zPos * 12.0 + 0.5) * 0.5 + 0.5;
  float ring3 = sin(zPos * 24.0 + 1.0) * 0.5 + 0.5;
  float pulse = sin(t * 0.8) * 0.15 + 0.85;
  float ringPattern = (ring1 * 0.50 + ring2 * 0.30 + ring3 * 0.20) * pulse;

  /* Wider mandala rings — fill the whole LED wall */
  float mRing1 = sin(dist * 12.0 - t * 2.5) * 0.5 + 0.5;
  float mRing2 = sin(dist * 20.0 - t * 3.8 + 0.7) * 0.5 + 0.5;
  float mRing3 = sin(dist * 30.0 - t * 5.0 + 1.3) * 0.5 + 0.5;
  float mRing4 = sin(dist * 7.0 - t * 1.5 + 2.0) * 0.5 + 0.5;
  float edgeBoost = smoothstep(0.15, 0.85, dist);
  float mandalaRings = (mRing1 * 0.35 + mRing2 * 0.30 + mRing3 * 0.20 + mRing4 * 0.15) * (0.5 + edgeBoost * 0.5);

  /* ═══ SPIRAL ARMS — rotational depth ═══ */
  float spiral1 = pow(abs(sin(angle * 3.0 + zPos * 2.0 - t * 1.5)), 12.0);
  float spiral2 = pow(abs(sin(angle * 5.0 - zPos * 1.5 + t * 2.0)), 16.0);
  float spiral3 = pow(abs(sin(angle * 2.0 + zPos * 3.0 - t * 0.7)), 8.0);
  float spiral4 = pow(abs(sin(angle * 7.0 + zPos * 1.8 + t * 1.0)), 20.0);
  float spiralPattern = (spiral1 * 0.35 + spiral2 * 0.25 + spiral3 * 0.15 + spiral4 * 0.25) * 0.4;
  spiralPattern *= (0.5 + edgeBoost * 0.5);

  /* ═══ NEON ACCENT LINES ═══ */
  float neon1 = pow(abs(sin(zPos * 8.0 - t * 2.0)), 30.0);
  float neon2 = pow(abs(sin(zPos * 14.0 - t * 3.5 + 0.7)), 40.0);
  float neon3 = pow(abs(sin(zPos * 20.0 - t * 5.0 + 1.3)), 50.0);
  float neon4 = pow(abs(sin(dist * 16.0 - t * 4.0 + 0.3)), 35.0);
  float neonPattern = (neon1 * 0.35 + neon2 * 0.25 + neon3 * 0.15 + neon4 * 0.25) * (0.6 + edgeBoost * 0.4);

  /* ═══ CONTOUR LINES — organic flowing pattern ═══ */
  float cLine1 = pow(abs(sin(angle * 2.0 + dist * 10.0 - t * 1.8)), 8.0);
  float cLine2 = pow(abs(sin(angle * 3.0 - dist * 8.0 + t * 2.2)), 10.0);
  float cLine3 = pow(abs(sin(angle * 5.0 + dist * 16.0 - t * 2.5 + 0.5)), 14.0);
  float contourLines = (cLine1 * 0.40 + cLine2 * 0.35 + cLine3 * 0.25) * (0.4 + edgeBoost * 0.6);

  /* ═══ PETALS — Honmoon mandala ═══ */
  float petal6 = pow(abs(sin(angle * 3.0 + t * 0.3)), 6.0);
  float petal8 = pow(abs(sin(angle * 4.0 - t * 0.4 + 0.5)), 8.0);
  float petal12 = pow(abs(sin(angle * 6.0 + t * 0.5 + 1.0)), 12.0);
  float p6 = petal6 * smoothstep(0.05, 0.35, dist) * (1.0 - smoothstep(0.5, 0.9, dist));
  float p8 = petal8 * smoothstep(0.1, 0.45, dist) * (1.0 - smoothstep(0.6, 1.0, dist));
  float p12 = petal12 * smoothstep(0.15, 0.55, dist) * (1.0 - smoothstep(0.7, 1.1, dist));
  float petalPattern = (p6 * 0.45 + p8 * 0.35 + p12 * 0.20) * (sin(t * 0.6) * 0.1 + 0.9);

  /* ═══ GASEOUS NEBULA — organic clouds in the deep regions ═══ */
  /* Noise coordinates warped by angle and time for flowing gas */
  vec2 gasUV = vec2(angle * 2.0 / TAU + t * 0.05, dist * 3.0 - t * 0.3);
  
  /* Domain warping — noise of noise = organic fluid look */
  vec2 warp = vec2(
    fbm(gasUV + vec2(1.7, 9.2) + t * 0.08),
    fbm(gasUV + vec2(8.3, 2.8) + t * 0.06)
  );
  float gas1 = fbm(gasUV + warp * 1.5);
  
  /* Second layer — different speed/offset for depth */
  vec2 gasUV2 = vec2(angle * 3.0 / TAU - t * 0.03, dist * 4.0 - t * 0.5 + 5.0);
  vec2 warp2 = vec2(
    fbm(gasUV2 + vec2(3.1, 7.4) + t * 0.05),
    fbm(gasUV2 + vec2(6.2, 1.3) + t * 0.07)
  );
  float gas2 = fbm(gasUV2 + warp2 * 1.2);
  
  /* Third layer — fine detail wisps */
  vec2 gasUV3 = vec2(angle * 5.0 / TAU + t * 0.07, dist * 6.0 - t * 0.7 + 10.0);
  float gas3 = fbm(gasUV3 + vec2(fbm(gasUV3 * 1.5 + t * 0.04), 0.0));
  
  /* Combine gas layers — stronger at edges (deep regions) */
  float deepMask = smoothstep(0.25, 0.9, dist);
  float gasPattern = (gas1 * 0.45 + gas2 * 0.35 + gas3 * 0.20) * deepMask;
  /* Soften the gas — no hard edges */
  gasPattern = smoothstep(0.15, 0.75, gasPattern);

  /* ═══ DARK MODE COLORS — Neon Purple / Pink / Blue ═══ */
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

  /* ═══ LIGHT MODE COLORS — Golden / Iridescent / Rainbow ═══ */
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

  /* ═══ BLEND DARK/LIGHT ═══ */
  vec3 color = mix(lightCol, darkCol, u_darkMode);
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(lum), color, mix(1.0, 1.6, u_darkMode));

  /* ═══ COMPOSITE ═══ */
  float brightness = ringPattern * 0.20
    + mandalaRings * 0.15
    + contourLines * 0.12
    + neonPattern * 0.12
    + petalPattern * 0.08
    + spiralPattern * 0.08
    + gasPattern * 0.25;

  /* Center glow — toned down so contours/patterns are visible */
  vec3 centerColor = mix(vec3(0.85, 0.8, 0.65), vec3(0.7, 0.6, 0.85), u_darkMode);
  float centerTotal = exp(-dist * 5.5) + exp(-dist * 14.0) * 0.3;

  /* Vignette — elliptical for LED wall widescreen */
  float vignette = 1.0 - smoothstep(0.3, 1.6, length(uv * 0.65));

  vec3 finalColor = vec3(0.0);
  finalColor += color * brightness * vignette;
  finalColor += centerColor * centerTotal * vignette * 0.6;
  finalColor += color * spiralPattern * vignette * 0.5;
  finalColor += color * petalPattern * vignette * 0.3;

  /* ═══ Gaseous nebula color overlay — colored gas in deep regions ═══ */
  vec3 gasDarkCol = mix(purple * 0.6, pink * 0.5, sin(angle + t * 0.2) * 0.5 + 0.5);
  gasDarkCol = mix(gasDarkCol, blue * 0.5, sin(dist * 3.0 - t * 0.5) * 0.5 + 0.5);
  vec3 gasLightCol = mix(gold * 0.5, rainbow * 0.4, smoothstep(0.2, 0.7, dist));
  vec3 gasColor = mix(gasLightCol, gasDarkCol, u_darkMode);
  finalColor += gasColor * gasPattern * vignette * 0.8;

  /* Depth shimmer */
  finalColor *= sin(angle * 6.0 + t * 0.5 + dist * 4.0) * 0.05 + 1.0;

  /* Dark mode: deeper blacks at edges */
  finalColor *= mix(1.0, smoothstep(1.8, 0.3, dist), u_darkMode * 0.3);

  /* Light mode: subtle warm bloom at edges */
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

  /* ── Initialize WebGL ── */
  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext("webgl", {
      antialias: true,
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

    return true;
  }, []);

  /* ── Resize canvas to container ── */
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }, []);

  /* ── Render loop ── */
  const render = useCallback(() => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program) return;

    if (document.hidden) {
      rafRef.current = requestAnimationFrame(render);
      return;
    }

    resize();

    const elapsed = (performance.now() - startTimeRef.current) / 1000.0;

    const target = darkModeRef.current;
    darkModeSmoothRef.current += (target - darkModeSmoothRef.current) * 0.04;

    gl.uniform1f(gl.getUniformLocation(program, "u_time"), elapsed);
    gl.uniform2f(
      gl.getUniformLocation(program, "u_resolution"),
      canvasRef.current!.width,
      canvasRef.current!.height
    );
    gl.uniform1f(
      gl.getUniformLocation(program, "u_darkMode"),
      darkModeSmoothRef.current
    );

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    rafRef.current = requestAnimationFrame(render);
  }, [resize]);

  /* ── Start with power-on delay ── */
  useEffect(() => {
    activeRef.current = active;
    if (active && !startedRef.current) {
      const t = setTimeout(() => {
        startedRef.current = true;
        setOn(true);

        if (initGL()) {
          startTimeRef.current = performance.now();
          rafRef.current = requestAnimationFrame(render);
        }
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [active, initGL, render]);

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

  /* ── Color sync via setInterval — for CSS vars (monitor glow, etc.) ── */
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (canvas && !sectionRef.current) {
      sectionRef.current = canvas.closest(".manifesto-section") as HTMLElement;
    }

    intervalRef.current = setInterval(() => {
      if (document.hidden) return;
      const el = sectionRef.current;
      if (!el) return;

      const isLight = document.documentElement.classList.contains("light-mode");
      const idx = Math.floor(Date.now() / 3000) % 8;

      const darkColors: Array<[number, number, number]> = [
        [170, 40, 255],   // neon purple
        [255, 45, 120],   // neon pink
        [79, 140, 255],   // electric blue
        [200, 80, 255],   // violet
        [255, 45, 120],   // neon pink
        [100, 60, 255],   // deep blue-purple
        [255, 70, 150],   // hot pink
        [120, 100, 255],  // periwinkle
      ];

      const lightColors: Array<[number, number, number]> = [
        [245, 158, 11],   // golden
        [249, 168, 212],  // pastel pink
        [147, 197, 253],  // pastel blue
        [253, 230, 138],  // golden cream
        [196, 181, 253],  // pastel purple
        [110, 231, 183],  // pastel mint
        [252, 165, 165],  // pastel coral
        [254, 243, 199],  // warm cream
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
