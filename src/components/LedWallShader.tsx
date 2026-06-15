"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   HONMOON LED WALL — WebGL Shader
   
   A procedural Honmoon soul barrier animation.
   Dark mode: Neon purple / Pink-Red / Electric Blue
   Light mode: Golden light / Iridescent / Pastel rainbow
   
   Zero compression. Zero pixelation. True infinite loop.
   GPU-rendered at native resolution.
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
uniform float u_darkMode;   // 1.0 = dark, 0.0 = light

#define PI 3.14159265359
#define TAU 6.28318530718

/* ── HSV to RGB ── */
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

/* ── Dark Mode Palettes ── */
// Neon Purple: #AA28FF → rgb(170,40,255)
// Neon Pink:   #FF2D78 → rgb(255,45,120)
// Electric Blue:#4F8CFF → rgb(79,140,255)

vec3 darkColor(float t, float dist) {
  // Cycle through the 3 mandatory neon colors
  vec3 purple = vec3(0.667, 0.157, 1.0);
  vec3 pink   = vec3(1.0, 0.176, 0.471);
  vec3 blue   = vec3(0.31, 0.55, 1.0);
  
  // Smooth 3-way blend cycling over time
  float phase = fract(t * 0.08);
  
  vec3 color;
  if (phase < 0.333) {
    color = mix(purple, pink, smoothstep(0.0, 0.333, phase));
  } else if (phase < 0.667) {
    color = mix(pink, blue, smoothstep(0.333, 0.667, phase));
  } else {
    color = mix(blue, purple, smoothstep(0.667, 1.0, phase));
  }
  
  // Distance-based shift: center is brighter, edges shift hue
  color = mix(color, purple, dist * 0.3);
  
  return color;
}

/* ── Light Mode Palettes ── */
// Golden Light: #F59E0B → rgb(245,158,11)
// Iridescent Pink: #F9A8D4 → rgb(249,168,212)
// Iridescent Blue: #93C5FD → rgb(147,197,253)
// Warm Cream: #FEF3C7 → rgb(254,243,199)

vec3 lightColor(float t, float dist) {
  // Iridescent rainbow cycling — the final Honmoon state
  float hue = fract(t * 0.06 + dist * 0.3);
  
  // Pastel rainbow: shift hue but keep saturation soft
  vec3 rainbow = hsv2rgb(vec3(hue, 0.45, 1.0));
  
  // Golden core
  vec3 gold = vec3(0.96, 0.62, 0.04);
  vec3 cream = vec3(0.996, 0.953, 0.78);
  
  // Center is golden-cream, transitions to iridescent rainbow outward
  vec3 color = mix(gold, rainbow, smoothstep(0.0, 0.5, dist));
  color = mix(cream, color, smoothstep(0.05, 0.25, dist));
  
  // Add pink and blue highlights
  vec3 pastelPink = vec3(0.976, 0.659, 0.831);
  vec3 pastelBlue = vec3(0.576, 0.773, 0.992);
  float pinkPhase = sin(t * 0.4 + dist * 2.0) * 0.5 + 0.5;
  float bluePhase = sin(t * 0.3 + dist * 1.5 + 1.0) * 0.5 + 0.5;
  color = mix(color, pastelPink, pinkPhase * 0.15 * smoothstep(0.2, 0.6, dist));
  color = mix(color, pastelBlue, bluePhase * 0.12 * smoothstep(0.3, 0.7, dist));
  
  return color;
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  
  float dist  = length(uv);
  float angle = atan(uv.y, uv.x);
  float t = u_time;
  
  /* ═══════════════════════════════════════════
     RING PATTERNS — Honmoon barrier energy rings
     ═══════════════════════════════════════════ */
  
  // Primary barrier rings — expanding outward like Honmoon pulses
  float ring1 = sin(dist * 22.0 - t * 3.5) * 0.5 + 0.5;
  // Secondary rings — counter-rotating energy layer
  float ring2 = sin(dist * 38.0 - t * 6.0 + 1.2) * 0.5 + 0.5;
  // Deep pulse — the breathing heartbeat of the barrier
  float ring3 = sin(dist * 10.0 - t * 1.8 + 2.5) * 0.5 + 0.5;
  // Micro rings — fine detail texture
  float ring4 = sin(dist * 60.0 - t * 10.0 + 0.5) * 0.5 + 0.5;
  
  float pattern = ring1 * 0.40 + ring2 * 0.28 + ring3 * 0.18 + ring4 * 0.14;
  
  /* ═══════════════════════════════════════════
     ENERGY STRANDS — thin lines connecting rings (like in the anime)
     ═══════════════════════════════════════════ */
  
  // Spiral strands that rotate slowly
  float strand1 = pow(abs(sin(angle * 3.0 + dist * 8.0 - t * 1.5)), 20.0);
  float strand2 = pow(abs(sin(angle * 5.0 - dist * 12.0 + t * 2.0)), 25.0);
  float strand3 = pow(abs(sin(angle * 2.0 + dist * 6.0 - t * 0.8 + PI)), 15.0);
  float strands = (strand1 + strand2 * 0.6 + strand3 * 0.4) * smoothstep(0.15, 0.05, dist);
  
  /* ═══════════════════════════════════════════
     NEON ACCENT LINES — bright thin rings
     ═══════════════════════════════════════════ */
  
  float neon1 = pow(abs(sin(dist * 50.0 - t * 8.0)), 50.0);
  float neon2 = pow(abs(sin(dist * 35.0 - t * 5.5 + 0.7)), 35.0);
  float neon3 = pow(abs(sin(dist * 70.0 - t * 12.0 + 1.3)), 60.0);
  float neonLines = neon1 + neon2 * 0.6 + neon3 * 0.3;
  
  /* ═══════════════════════════════════════════
     ORBITING SOUL PARTICLES — 6 nodes like the Honmoon shield
     ═══════════════════════════════════════════ */
  
  float particles = 0.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float orbitR = 0.35 + fi * 0.12;
    float orbitSpeed = 0.6 + fi * 0.15;
    float orbitAngle = t * orbitSpeed + fi * TAU / 6.0;
    vec2 particlePos = vec2(cos(orbitAngle), sin(orbitAngle)) * orbitR;
    float d = length(uv - particlePos);
    particles += exp(-d * 40.0) * 0.4;
  }
  
  /* ═══════════════════════════════════════════
     COLOR — blend between dark and light palettes
     ═══════════════════════════════════════════ */
  
  vec3 darkCol = darkColor(t, dist);
  vec3 lightCol = lightColor(t, dist);
  vec3 color = mix(lightCol, darkCol, u_darkMode);
  
  // Boost saturation for dark mode — make neons POP
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(lum), color, mix(1.0, 1.6, u_darkMode));
  
  /* ═══════════════════════════════════════════
     BRIGHTNESS COMPOSITE
     ═══════════════════════════════════════════ */
  
  float brightness = pattern * 0.55 + neonLines * 0.45 + strands * 0.3;
  
  /* ═══════════════════════════════════════════
     CENTER GLOW — the soul core
     ═══════════════════════════════════════════ */
  
  // Bright white-gold center in light, white-purple in dark
  vec3 centerDark = vec3(0.95, 0.85, 1.0);
  vec3 centerLight = vec3(1.0, 0.97, 0.85);
  vec3 centerColor = mix(centerLight, centerDark, u_darkMode);
  
  // Multi-layered center glow for richness
  float glow1 = exp(-dist * 4.0);
  float glow2 = exp(-dist * 12.0) * 0.5;
  float centerTotal = glow1 + glow2;
  
  /* ═══════════════════════════════════════════
     SOUL PARTICLE GLOW — orbiting lights have their own color
     ═══════════════════════════════════════════ */
  
  vec3 particleColor = mix(
    vec3(1.0, 0.92, 0.75),  // light: warm gold
    mix(vec3(0.667, 0.157, 1.0), vec3(1.0, 0.176, 0.471), sin(t * 0.5) * 0.5 + 0.5), // dark: purple↔pink
    u_darkMode
  );
  
  /* ═══════════════════════════════════════════
     VIGNETTE — fade edges to darkness
     ═══════════════════════════════════════════ */
  
  float vignette = smoothstep(1.35, 0.15, dist);
  
  /* ═══════════════════════════════════════════
     FINAL COMPOSITE
     ═══════════════════════════════════════════ */
  
  vec3 finalColor = vec3(0.0);
  
  // Barrier rings with color
  finalColor += color * brightness * vignette;
  
  // Center soul core glow
  finalColor += centerColor * centerTotal * vignette * 1.3;
  
  // Orbiting soul particles
  finalColor += particleColor * particles * vignette;
  
  // Energy strands glow
  finalColor += color * strands * 0.4 * vignette;
  
  // Subtle angular variation — depth without clock effect
  float depthShimmer = sin(angle * 4.0 + t * 0.6 + dist * 3.0) * 0.04 + 1.0;
  finalColor *= depthShimmer;
  
  // Dark mode: deeper blacks at edges
  finalColor *= mix(1.0, smoothstep(1.4, 0.3, dist), u_darkMode * 0.3);
  
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

    // Compile vertex shader
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error("VS:", gl.getShaderInfoLog(vs));
      return false;
    }

    // Compile fragment shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error("FS:", gl.getShaderInfoLog(fs));
      return false;
    }

    // Link program
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

    // Fullscreen quad
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

    // Smooth dark mode transition
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

  /* ── Start after power-on delay ── */
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
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [active, initGL, render]);

  /* ── Detect dark/light mode from parent section ── */
  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Find the root element to check theme mode
    const root = document.documentElement;

    const checkTheme = () => {
      const isLight = root.classList.contains("light-mode");
      darkModeRef.current = isLight ? 0.0 : 1.0;
    };

    // Check immediately
    checkTheme();

    // Observe class changes on <html> for theme switching
    const observer = new MutationObserver(checkTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [active]);

  /* ── Color sync via setInterval ── */
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

      // Dark mode colors: purple, pink, blue neon
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

      // Light mode colors: golden, pastel, iridescent
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
