"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   LED WALL — Honmoon Mandala Shader
   
   Radial mandala with organic contour lines, petals, energy nodes,
   sacred geometry, flowing streams — inspired by the Honmoon aesthetic.
   Fills the ENTIRE LED wall screen edge to edge.
   
   Dark mode (night): Neon Purple, Neon Pink, Electric Blue cycling
   Light mode (day): Golden core, Iridescent/Rainbow pastels outward
   
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

/* ── HSV to RGB ── */
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  /* ═══ UV — cover the ENTIRE LED wall like object-fit: cover ═══ */
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / u_resolution;
  float t = u_time;
  
  /* Elliptical correction for widescreen LED wall */
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uvC = uv * vec2(1.0 / aspect, 1.0);
  float dist  = length(uvC);
  float angle = atan(uvC.y, uvC.x);
  float normAngle = angle / TAU + 0.5; // 0..1

  /* ═══════════════════════════════════════════
     LAYER 1: HONMOON MANDALA RINGS — expanding sacred circles
     ═══════════════════════════════════════════ */
  
  float tunnelZ = 1.0 / max(dist, 0.01);
  float zScroll = t * 1.2;
  float zPos = tunnelZ + zScroll;
  
  /* Original tunnel rings — kept and enhanced */
  float ring1 = sin(zPos * 6.0) * 0.5 + 0.5;
  float ring2 = sin(zPos * 12.0 + 0.5) * 0.5 + 0.5;
  float ring3 = sin(zPos * 24.0 + 1.0) * 0.5 + 0.5;
  float pulse = sin(t * 0.8) * 0.15 + 0.85;
  float ringPattern = ring1 * 0.50 + ring2 * 0.30 + ring3 * 0.20;
  ringPattern *= pulse;
  
  /* WIDER mandala rings — fill edges of the LED wall */
  float mRing1 = sin(dist * 14.0 - t * 2.5) * 0.5 + 0.5;
  float mRing2 = sin(dist * 22.0 - t * 3.8 + 0.7) * 0.5 + 0.5;
  float mRing3 = sin(dist * 34.0 - t * 5.2 + 1.3) * 0.5 + 0.5;
  float mRing4 = sin(dist * 8.0 - t * 1.5 + 2.0) * 0.5 + 0.5;
  float mandalaRings = mRing1 * 0.35 + mRing2 * 0.30 + mRing3 * 0.20 + mRing4 * 0.15;
  /* Edge emphasis — rings brighter at edges to fill the whole screen */
  float edgeBoost = smoothstep(0.15, 0.9, dist);
  mandalaRings *= (0.5 + edgeBoost * 0.5);

  /* ═══════════════════════════════════════════
     LAYER 2: ORGANIC CONTOUR LINES — topographic Honmoon pattern
     ═══════════════════════════════════════════ */
  
  /* Flowing contour lines that undulate like terrain */
  float contour1 = sin(angle * 2.0 + dist * 10.0 - t * 1.8) * 0.5 + 0.5;
  float contour2 = sin(angle * 3.0 - dist * 8.0 + t * 2.2 + 1.0) * 0.5 + 0.5;
  float contour3 = sin(angle * 1.5 + dist * 14.0 - t * 1.2 + 2.5) * 0.5 + 0.5;
  /* Sharpen into thin contour lines */
  float cLine1 = pow(abs(sin(angle * 2.0 + dist * 10.0 - t * 1.8)), 8.0);
  float cLine2 = pow(abs(sin(angle * 3.0 - dist * 8.0 + t * 2.2)), 10.0);
  float cLine3 = pow(abs(sin(angle * 5.0 + dist * 16.0 - t * 2.5 + 0.5)), 14.0);
  float cLine4 = pow(abs(sin(angle * 1.0 + dist * 6.0 - t * 0.8 + 1.2)), 6.0);
  float contourLines = cLine1 * 0.35 + cLine2 * 0.30 + cLine3 * 0.20 + cLine4 * 0.15;
  contourLines *= (0.4 + edgeBoost * 0.6);

  /* ═══════════════════════════════════════════
     LAYER 3: PETAL PATTERNS — sacred geometry layers
     ═══════════════════════════════════════════ */
  
  /* 6-petal lotus — primary Honmoon shape */
  float petal6 = pow(abs(sin(angle * 3.0 + t * 0.3)), 6.0);
  /* 8-petal secondary */
  float petal8 = pow(abs(sin(angle * 4.0 - t * 0.4 + 0.5)), 8.0);
  /* 12-petal fine detail */
  float petal12 = pow(abs(sin(angle * 6.0 + t * 0.5 + 1.0)), 12.0);
  /* 16-petal outermost */
  float petal16 = pow(abs(sin(angle * 8.0 - t * 0.6 + 1.5)), 16.0);
  /* 5-petal star — pentagram accent */
  float petal5 = pow(abs(sin(angle * 2.5 + t * 0.2 - 0.3)), 5.0);
  
  /* Each petal layer modulated by distance for depth */
  float p6 = petal6 * smoothstep(0.05, 0.35, dist) * (1.0 - smoothstep(0.5, 0.9, dist));
  float p8 = petal8 * smoothstep(0.1, 0.45, dist) * (1.0 - smoothstep(0.6, 1.0, dist));
  float p12 = petal12 * smoothstep(0.15, 0.55, dist) * (1.0 - smoothstep(0.7, 1.1, dist));
  float p16 = petal16 * smoothstep(0.2, 0.65, dist) * (1.0 - smoothstep(0.8, 1.3, dist)) * edgeBoost;
  float p5 = petal5 * smoothstep(0.08, 0.4, dist) * (1.0 - smoothstep(0.55, 0.95, dist));
  
  float petalPattern = p6 * 0.30 + p8 * 0.25 + p12 * 0.20 + p16 * 0.15 + p5 * 0.10;
  /* Subtle pulsing */
  petalPattern *= (sin(t * 0.6) * 0.1 + 0.9);

  /* ═══════════════════════════════════════════
     LAYER 4: SPIRAL ARMS — rotational depth lines (kept from original)
     ═══════════════════════════════════════════ */
  
  float spiral1 = pow(abs(sin(angle * 3.0 + zPos * 2.0 - t * 1.5)), 12.0);
  float spiral2 = pow(abs(sin(angle * 5.0 - zPos * 1.5 + t * 2.0)), 16.0);
  float spiral3 = pow(abs(sin(angle * 2.0 + zPos * 3.0 - t * 0.7)), 8.0);
  /* Extra wider spirals for edge fill */
  float spiral4 = pow(abs(sin(angle * 7.0 + zPos * 1.8 + t * 1.0)), 20.0);
  float spiral5 = pow(abs(sin(angle * 1.5 - zPos * 2.5 - t * 0.9)), 6.0);
  float spiralPattern = (spiral1 * 0.30 + spiral2 * 0.25 + spiral3 * 0.15 + spiral4 * 0.15 + spiral5 * 0.15) * 0.5;
  spiralPattern *= (0.5 + edgeBoost * 0.5);

  /* ═══════════════════════════════════════════
     LAYER 5: NEON ACCENT LINES — bright thin rings (kept + expanded)
     ═══════════════════════════════════════════ */
  
  float neon1 = pow(abs(sin(zPos * 8.0 - t * 2.0)), 30.0);
  float neon2 = pow(abs(sin(zPos * 14.0 - t * 3.5 + 0.7)), 40.0);
  float neon3 = pow(abs(sin(zPos * 20.0 - t * 5.0 + 1.3)), 50.0);
  /* Extra neon rings at wider radii */
  float neon4 = pow(abs(sin(dist * 18.0 - t * 4.0 + 0.3)), 35.0);
  float neon5 = pow(abs(sin(dist * 28.0 - t * 6.0 + 1.0)), 45.0);
  float neonPattern = neon1 * 0.35 + neon2 * 0.25 + neon3 * 0.15 + neon4 * 0.15 + neon5 * 0.10;
  neonPattern *= (0.6 + edgeBoost * 0.4);

  /* ═══════════════════════════════════════════
     LAYER 6: ENERGY NODES — bright dots at petal intersections
     ═══════════════════════════════════════════ */
  
  /* Nodes at petal tips — 6 nodes */
  float node6Angle = abs(sin(angle * 3.0 + t * 0.3));
  float node6Dist = abs(sin(dist * 8.0 - t * 1.5));
  float node6 = pow(node6Angle, 20.0) * pow(node6Dist, 20.0) * 200.0;
  
  /* 8 secondary nodes */
  float node8Angle = abs(sin(angle * 4.0 - t * 0.4 + 0.5));
  float node8Dist = abs(sin(dist * 12.0 - t * 2.0 + 0.8));
  float node8 = pow(node8Angle, 24.0) * pow(node8Dist, 24.0) * 150.0;
  
  /* 12 fine detail nodes */
  float node12Angle = abs(sin(angle * 6.0 + t * 0.5 + 1.0));
  float node12Dist = abs(sin(dist * 16.0 - t * 2.5 + 1.5));
  float node12 = pow(node12Angle, 28.0) * pow(node12Dist, 28.0) * 100.0;
  
  float nodePattern = min(node6 + node8 + node12, 1.0);
  nodePattern *= smoothstep(0.1, 0.4, dist) * (1.0 - smoothstep(0.7, 1.2, dist) * 0.5);

  /* ═══════════════════════════════════════════
     LAYER 7: SACRED GEOMETRY — inner triangles and hexagrams
     ═══════════════════════════════════════════ */
  
  /* Rotating triangle 1 */
  float tri1Angle = mod(angle + t * 0.15, TAU / 3.0);
  float tri1 = pow(smoothstep(0.3, 0.0, abs(tri1Angle - TAU / 6.0)), 3.0);
  tri1 *= smoothstep(0.1, 0.3, dist) * (1.0 - smoothstep(0.35, 0.55, dist));
  
  /* Rotating triangle 2 (inverted) */
  float tri2Angle = mod(angle - t * 0.15 + PI, TAU / 3.0);
  float tri2 = pow(smoothstep(0.3, 0.0, abs(tri2Angle - TAU / 6.0)), 3.0);
  tri2 *= smoothstep(0.15, 0.35, dist) * (1.0 - smoothstep(0.4, 0.6, dist));
  
  /* Hexagram = two overlapping triangles */
  float hexagram = tri1 * 0.6 + tri2 * 0.4;
  hexagram *= (sin(t * 0.5) * 0.15 + 0.85);

  /* ═══════════════════════════════════════════
     LAYER 8: FLOWING ENERGY STREAMS — like the contour image
     ═══════════════════════════════════════════ */
  
  /* Organic flowing streams that curve around center */
  float stream1 = pow(abs(sin(angle * 2.0 + sin(dist * 5.0 + t) * 1.5 - t * 0.6)), 4.0);
  float stream2 = pow(abs(sin(angle * 3.0 + cos(dist * 4.0 - t * 0.8) * 2.0 + t * 0.4)), 6.0);
  float stream3 = pow(abs(sin(angle * 1.5 + sin(dist * 7.0 + t * 1.2) * 1.8 - t * 0.3)), 3.0);
  float stream4 = pow(abs(sin(angle * 4.0 + cos(dist * 3.0 + t * 0.5) * 2.5 + t * 0.7)), 8.0);
  
  float streamPattern = stream1 * 0.30 + stream2 * 0.30 + stream3 * 0.25 + stream4 * 0.15;
  streamPattern *= smoothstep(0.1, 0.5, dist) * (0.5 + edgeBoost * 0.5);

  /* ═══════════════════════════════════════════
     DARK MODE COLORS — Neon Purple / Pink / Blue cycling
     ═══════════════════════════════════════════ */
  
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
  
  /* Dark mode node color — brighter, whiter */
  vec3 darkNodeCol = mix(vec3(0.95, 0.85, 1.0), darkCol * 1.5, 0.4);

  /* ═══════════════════════════════════════════
     LIGHT MODE COLORS — Golden / Iridescent / Rainbow pastels
     ═══════════════════════════════════════════ */
  
  vec3 gold  = vec3(0.96, 0.62, 0.04);
  vec3 cream = vec3(0.996, 0.953, 0.78);
  
  float hue = fract(t * 0.06 + dist * 0.35);
  vec3 rainbow = hsv2rgb(vec3(hue, 0.45, 1.0));
  
  vec3 lightCol = mix(gold, rainbow, smoothstep(0.0, 0.45, dist));
  lightCol = mix(cream, lightCol, smoothstep(0.03, 0.2, dist));
  
  vec3 pastelPink  = vec3(0.976, 0.659, 0.831);
  vec3 pastelBlue  = vec3(0.576, 0.773, 0.992);
  vec3 pastelMint  = vec3(0.431, 0.906, 0.718);
  float pinkPhase  = sin(t * 0.4 + dist * 2.0) * 0.5 + 0.5;
  float bluePhase  = sin(t * 0.3 + dist * 1.5 + 1.0) * 0.5 + 0.5;
  float mintPhase  = sin(t * 0.35 + dist * 1.8 + 2.0) * 0.5 + 0.5;
  lightCol = mix(lightCol, pastelPink, pinkPhase * 0.18 * smoothstep(0.2, 0.6, dist));
  lightCol = mix(lightCol, pastelBlue, bluePhase * 0.15 * smoothstep(0.3, 0.7, dist));
  lightCol = mix(lightCol, pastelMint, mintPhase * 0.12 * smoothstep(0.4, 0.8, dist));
  
  /* Light mode node color — golden white */
  vec3 lightNodeCol = mix(vec3(1.0, 0.97, 0.85), gold * 1.3, 0.3);

  /* ═══════════════════════════════════════════
     BLEND DARK/LIGHT based on mode
     ═══════════════════════════════════════════ */
  
  vec3 color = mix(lightCol, darkCol, u_darkMode);
  vec3 nodeColor = mix(lightNodeCol, darkNodeCol, u_darkMode);
  
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(lum), color, mix(1.0, 1.6, u_darkMode));

  /* ═══════════════════════════════════════════
     BRIGHTNESS COMPOSITE — all layers blended
     ═══════════════════════════════════════════ */
  
  float brightness = ringPattern * 0.25
    + mandalaRings * 0.20
    + contourLines * 0.15
    + neonPattern * 0.15
    + petalPattern * 0.10
    + spiralPattern * 0.08
    + streamPattern * 0.07;

  /* ═══════════════════════════════════════════
     CENTER GLOW — bright core at mandala center
     ═══════════════════════════════════════════ */
  
  vec3 centerDark  = vec3(0.95, 0.85, 1.0);
  vec3 centerLight = vec3(1.0, 0.97, 0.85);
  vec3 centerColor = mix(centerLight, centerDark, u_darkMode);
  
  float glow1 = exp(-dist * 3.5);
  float glow2 = exp(-dist * 10.0) * 0.6;
  float centerTotal = glow1 + glow2;

  /* ═══════════════════════════════════════════
     VIGNETTE — elliptical to match LED wall widescreen
     ═══════════════════════════════════════════ */
  
  float vignette = 1.0 - smoothstep(0.3, 1.6, length(uv * 0.65));

  /* ═══════════════════════════════════════════
     FINAL COMPOSITE
     ═══════════════════════════════════════════ */
  
  vec3 finalColor = vec3(0.0);
  
  /* Main pattern layers */
  finalColor += color * brightness * vignette;
  
  /* Center glow */
  finalColor += centerColor * centerTotal * vignette * 1.4;
  
  /* Spiral arms */
  finalColor += color * spiralPattern * vignette * 0.5;
  
  /* Sacred geometry (hexagram) — subtle inner glow */
  finalColor += color * hexagram * vignette * 0.3;
  
  /* Energy nodes — bright pinpoint dots */
  finalColor += nodeColor * nodePattern * vignette * 1.8;
  
  /* Flowing streams — extra warmth in contours */
  finalColor += color * streamPattern * vignette * 0.25;
  
  /* Depth shimmer */
  float depthShimmer = sin(angle * 6.0 + t * 0.5 + dist * 4.0) * 0.05 + 1.0;
  finalColor *= depthShimmer;
  
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
