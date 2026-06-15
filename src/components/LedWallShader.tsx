"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   LED WALL — WebGL Tunnel Shader
   Renders a procedural neon tunnel animation at native GPU resolution.
   Zero compression, zero pixelation, true infinite loop.
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
uniform float u_colorPhase; // 0.0 – 1.0 synced with CSS glow

/* ── Color palette ── */
vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.263, 0.416, 0.557);
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);

  float dist  = length(uv);
  float angle = atan(uv.y, uv.x);

  /* ── Tunnel rings — multiple frequencies for richness ── */
  float t = u_time;

  // Primary rings — the main tunnel pulse
  float rings  = sin(dist * 28.0 - t * 4.5) * 0.5 + 0.5;
  // Secondary rings — adds density and variety
  float rings2 = sin(dist * 45.0 - t * 7.0 + 0.8) * 0.5 + 0.5;
  // Slow deep pulse — breathing effect
  float rings3 = sin(dist * 12.0 - t * 2.0 + 2.0) * 0.5 + 0.5;

  // Combined ring pattern
  float pattern = rings * 0.50 + rings2 * 0.30 + rings3 * 0.20;

  /* ── Thin neon accent lines ── */
  float line1 = pow(abs(sin(dist * 55.0 - t * 9.0)), 40.0);
  float line2 = pow(abs(sin(dist * 38.0 - t * 6.0 + 1.5)), 30.0);
  float lines = line1 + line2 * 0.7;

  /* ── Color ── */
  // Distance-based color cycling — matches the original purple→pink→cyan
  float colorT = fract(dist * 1.8 - t * 0.25 + u_colorPhase * 0.3);
  vec3 color = palette(colorT + 0.15);

  // Push colors toward neon: saturate + boost
  color = pow(color, vec3(0.75)); // brighten shadows
  color = mix(color, vec3(dot(color, vec3(0.299, 0.587, 0.114))), -0.3); // oversaturate

  /* ── Brightness ── */
  float brightness = pattern * 0.65 + lines * 0.6;

  // Center glow — bright white core
  float centerGlow = exp(-dist * 3.5);
  vec3 centerColor = vec3(0.95, 0.85, 1.0) * centerGlow * 1.2;

  // Edge vignette — fade to black
  float vignette = smoothstep(1.3, 0.2, dist);

  /* ── Final composite ── */
  vec3 finalColor = color * brightness * vignette + centerColor;

  // Subtle angle-based shimmer — gives depth without clock effect
  float shimmer = sin(angle * 3.0 + t * 0.8) * 0.03 + 1.0;
  finalColor *= shimmer;

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
  const colorPhaseRef = useRef(0);
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

    // Compile shaders
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf
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

    gl.uniform1f(gl.getUniformLocation(program, "u_time"), elapsed);
    gl.uniform2f(
      gl.getUniformLocation(program, "u_resolution"),
      canvasRef.current!.width,
      canvasRef.current!.height
    );
    gl.uniform1f(
      gl.getUniformLocation(program, "u_colorPhase"),
      colorPhaseRef.current
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

  /* ── Color sync via setInterval — same as before ── */
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
      const idx = Math.floor(Date.now() / 3000) % 8;
      const colors: Array<[number, number, number]> = [
        [170, 40, 255],
        [195, 55, 235],
        [245, 70, 210],
        [165, 120, 248],
        [80, 160, 230],
        [75, 195, 210],
        [165, 120, 248],
        [245, 70, 210],
      ];
      const [r, g, b] = colors[idx];
      el.style.setProperty("--led-r", `${r}`);
      el.style.setProperty("--led-g", `${g}`);
      el.style.setProperty("--led-b", `${b}`);

      // Sync shader color phase
      colorPhaseRef.current = idx / colors.length;
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
