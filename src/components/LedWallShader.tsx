"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   LED WALL TUNNEL — WebGL Shader
   
   Tunnel animation that mimics the original 24MB video.
   Zero compression. Zero pixelation. True infinite loop.
   GPU-rendered at native resolution.
   
   Dark mode (night): Neon Purple, Neon Pink, Electric Blue cycling
   Light mode (day): Golden core, Iridescent/Rainbow pastels outward
   
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
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  
  float dist  = length(uv);
  float angle = atan(uv.y, uv.x);
  float t = u_time;
  
  /* ═══════════════════════════════════════════
     TUNNEL WARP — the core depth illusion
     Like looking into an infinite tunnel
     ═══════════════════════════════════════════ */
  
  // Tunnel coordinates — polar to tunnel space
  float tunnelZ = 1.0 / max(dist, 0.01);  // depth = 1/distance
  float tunnelAngle = angle / TAU;          // wrap angle to 0-1
  
  // Scroll through the tunnel over time
  float zScroll = t * 1.2;
  float zPos = tunnelZ + zScroll;
  
  /* ═══════════════════════════════════════════
     TUNNEL RING PATTERN — expanding rings
     ═══════════════════════════════════════════ */
  
  // Primary rings — the main expanding tunnel rings
  float ring1 = sin(zPos * 6.0) * 0.5 + 0.5;
  // Secondary rings — finer detail
  float ring2 = sin(zPos * 12.0 + 0.5) * 0.5 + 0.5;
  // Tertiary — very fine texture
  float ring3 = sin(zPos * 24.0 + 1.0) * 0.5 + 0.5;
  // Slow pulse — breathing
  float pulse = sin(t * 0.8) * 0.15 + 0.85;
  
  // Combine rings with decreasing weight
  float ringPattern = ring1 * 0.50 + ring2 * 0.30 + ring3 * 0.20;
  ringPattern *= pulse;
  
  /* ═══════════════════════════════════════════
     SPIRAL ARMS — rotational depth lines
     ═══════════════════════════════════════════ */
  
  // Multiple spiral arms that rotate
  float spiral1 = pow(abs(sin(angle * 3.0 + zPos * 2.0 - t * 1.5)), 12.0);
  float spiral2 = pow(abs(sin(angle * 5.0 - zPos * 1.5 + t * 2.0)), 16.0);
  float spiral3 = pow(abs(sin(angle * 2.0 + zPos * 3.0 - t * 0.7)), 8.0);
  float spiralPattern = (spiral1 + spiral2 * 0.5 + spiral3 * 0.3) * 0.4;
  
  /* ═══════════════════════════════════════════
     NEON ACCENT LINES — bright thin rings
     ═══════════════════════════════════════════ */
  
  float neon1 = pow(abs(sin(zPos * 8.0 - t * 2.0)), 30.0);
  float neon2 = pow(abs(sin(zPos * 14.0 - t * 3.5 + 0.7)), 40.0);
  float neon3 = pow(abs(sin(zPos * 20.0 - t * 5.0 + 1.3)), 50.0);
  float neonPattern = neon1 * 0.5 + neon2 * 0.35 + neon3 * 0.15;
  
  /* ═══════════════════════════════════════════
     DARK MODE COLORS — Neon Purple / Pink / Blue cycling
     ═══════════════════════════════════════════ */
  
  // Neon Purple: #AA28FF → rgb(170,40,255)
  vec3 purple = vec3(0.667, 0.157, 1.0);
  // Neon Pink: #FF2D78 → rgb(255,45,120)
  vec3 pink   = vec3(1.0, 0.176, 0.471);
  // Electric Blue: #4F8CFF → rgb(79,140,255)
  vec3 blue   = vec3(0.31, 0.55, 1.0);
  
  // 3-way neon color cycle
  float darkPhase = fract(t * 0.08);
  vec3 darkCol;
  if (darkPhase < 0.333) {
    darkCol = mix(purple, pink, smoothstep(0.0, 0.333, darkPhase));
  } else if (darkPhase < 0.667) {
    darkCol = mix(pink, blue, smoothstep(0.333, 0.667, darkPhase));
  } else {
    darkCol = mix(blue, purple, smoothstep(0.667, 1.0, darkPhase));
  }
  
  // Distance-based variation: center brighter, edges shift
  darkCol = mix(darkCol, purple * 0.8, dist * 0.25);
  
  /* ═══════════════════════════════════════════
     LIGHT MODE COLORS — Golden / Iridescent / Rainbow
     ═══════════════════════════════════════════ */
  
  // Golden Light: #F59E0B → rgb(245,158,11)
  vec3 gold  = vec3(0.96, 0.62, 0.04);
  vec3 cream = vec3(0.996, 0.953, 0.78);
  
  // Iridescent rainbow cycling
  float hue = fract(t * 0.06 + dist * 0.35);
  vec3 rainbow = hsv2rgb(vec3(hue, 0.45, 1.0));
  
  // Center golden → iridescent outward
  vec3 lightCol = mix(gold, rainbow, smoothstep(0.0, 0.45, dist));
  lightCol = mix(cream, lightCol, smoothstep(0.03, 0.2, dist));
  
  // Pastel highlights
  vec3 pastelPink  = vec3(0.976, 0.659, 0.831);
  vec3 pastelBlue  = vec3(0.576, 0.773, 0.992);
  vec3 pastelMint  = vec3(0.431, 0.906, 0.718);
  float pinkPhase  = sin(t * 0.4 + dist * 2.0) * 0.5 + 0.5;
  float bluePhase  = sin(t * 0.3 + dist * 1.5 + 1.0) * 0.5 + 0.5;
  float mintPhase  = sin(t * 0.35 + dist * 1.8 + 2.0) * 0.5 + 0.5;
  lightCol = mix(lightCol, pastelPink, pinkPhase * 0.18 * smoothstep(0.2, 0.6, dist));
  lightCol = mix(lightCol, pastelBlue, bluePhase * 0.15 * smoothstep(0.3, 0.7, dist));
  lightCol = mix(lightCol, pastelMint, mintPhase * 0.12 * smoothstep(0.4, 0.8, dist));
  
  /* ═══════════════════════════════════════════
     BLEND DARK/LIGHT based on mode
     ═══════════════════════════════════════════ */
  
  vec3 color = mix(lightCol, darkCol, u_darkMode);
  
  // Boost saturation for dark mode — make neons POP
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(lum), color, mix(1.0, 1.6, u_darkMode));
  
  /* ═══════════════════════════════════════════
     BRIGHTNESS COMPOSITE
     ═══════════════════════════════════════════ */
  
  float brightness = ringPattern * 0.55 + neonPattern * 0.30 + spiralPattern * 0.15;
  
  /* ═══════════════════════════════════════════
     CENTER GLOW — bright core at tunnel end
     ═══════════════════════════════════════════ */
  
  // White-purple in dark, white-gold in light
  vec3 centerDark  = vec3(0.95, 0.85, 1.0);
  vec3 centerLight = vec3(1.0, 0.97, 0.85);
  vec3 centerColor = mix(centerLight, centerDark, u_darkMode);
  
  // Multi-layer glow
  float glow1 = exp(-dist * 3.5);
  float glow2 = exp(-dist * 10.0) * 0.6;
  float centerTotal = glow1 + glow2;
  
  /* ═══════════════════════════════════════════
     VIGNETTE — fade edges to darkness
     ═══════════════════════════════════════════ */
  
  float vignette = smoothstep(1.5, 0.1, dist);
  
  /* ═══════════════════════════════════════════
     FINAL COMPOSITE
     ═══════════════════════════════════════════ */
  
  vec3 finalColor = vec3(0.0);
  
  // Tunnel rings with color
  finalColor += color * brightness * vignette;
  
  // Center glow
  finalColor += centerColor * centerTotal * vignette * 1.4;
  
  // Spiral arms add their own colored glow
  finalColor += color * spiralPattern * vignette * 0.5;
  
  // Depth shimmer — subtle angular variation
  float depthShimmer = sin(angle * 6.0 + t * 0.5 + dist * 4.0) * 0.05 + 1.0;
  finalColor *= depthShimmer;
  
  // Dark mode: deeper blacks at edges
  finalColor *= mix(1.0, smoothstep(1.6, 0.3, dist), u_darkMode * 0.3);
  
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
      }, 1500); // matches power-on flash timing
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

    // Check immediately
    checkTheme();

    // Observe class changes on <html> for theme switching
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
