"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   Neon Lightbox — K-Pop themed photo popup

   Dark mode: neon purple/pink border glow
   Light mode: golden/iridescent soft glow
   Navigate with:
     • Arrow buttons (click)
     • Keyboard (← → Esc)
     • Touch swipe left/right (mobile/tablet) — swipe mudas em tempo real
     • Mouse drag left/right (desktop)
   Close with X, click outside, or Esc.
   ═══════════════════════════════════════════════════════════════════ */

interface NeonLightboxProps {
  images: { src: string; caption: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

/* Minimum horizontal distance (px) for a swipe to count as navigation */
const SWIPE_THRESHOLD = 50;

export default function NeonLightbox({ images, index, onClose, onPrev, onNext }: NeonLightboxProps) {
  const img = images[index];

  /* Live drag offset — drives the inline transform during swipe.
     Using a ref + state combo: ref for synchronous reads on touchend,
     state to trigger re-renders for the visual transform. */
  const startRef = useRef<{ x: number; y: number; axis: "none" | "x" | "y" }>({ x: 0, y: 0, axis: "none" });
  const dragXRef = useRef(0);
  const [dragX, setDragX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  /* Keyboard navigation */
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  /* Reset everything when image index changes */
  useEffect(() => {
    setDragX(0);
    dragXRef.current = 0;
    setIsSwiping(false);
    startRef.current = { x: 0, y: 0, axis: "none" };
  }, [index]);

  /* ─── Pointer start (shared by touch + mouse) ─── */
  const beginDrag = useCallback((clientX: number, clientY: number) => {
    startRef.current = { x: clientX, y: clientY, axis: "none" };
    dragXRef.current = 0;
    setDragX(0);
    setIsSwiping(true);
  }, []);

  /* ─── Pointer move (shared by touch + mouse) ─── */
  const moveDrag = useCallback((clientX: number, clientY: number) => {
    const start = startRef.current;
    if (start.axis === "none") {
      const dx = clientX - start.x;
      const dy = clientY - start.y;
      // Lock the axis once the user moves more than ~8px in any direction
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
    }
    if (start.axis === "x") {
      const dx = clientX - start.x;
      dragXRef.current = dx;
      setDragX(dx);
    }
  }, []);

  /* ─── Pointer end (shared by touch + mouse) ─── */
  const endDrag = useCallback(() => {
    const dx = dragXRef.current;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      if (dx < 0 && index < images.length - 1) onNext();
      else if (dx > 0 && index > 0) onPrev();
    }
    dragXRef.current = 0;
    setDragX(0);
    setIsSwiping(false);
    startRef.current = { x: 0, y: 0, axis: "none" };
  }, [index, images.length, onNext, onPrev]);

  /* Touch handlers — must use passive: false on move to preventDefault */
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    beginDrag(t.clientX, t.clientY);
  }, [beginDrag]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const start = startRef.current;
    if (start.axis === "none") {
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
      return;
    }
    if (start.axis === "x") {
      // We're committed to a horizontal swipe — prevent vertical scroll
      if (e.cancelable) e.preventDefault();
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    }
    // If axis === "y", do nothing (let the browser scroll/handle it)
  }, [moveDrag]);

  const onTouchEnd = useCallback(() => {
    if (startRef.current.axis === "x") {
      endDrag();
    } else {
      // Wasn't a horizontal swipe — just reset
      dragXRef.current = 0;
      setDragX(0);
      setIsSwiping(false);
      startRef.current = { x: 0, y: 0, axis: "none" };
    }
  }, [endDrag]);

  /* Mouse handlers (desktop drag) */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    beginDrag(e.clientX, e.clientY);
  }, [beginDrag]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isSwiping) return;
    moveDrag(e.clientX, e.clientY);
  }, [isSwiping, moveDrag]);

  const onMouseUp = useCallback(() => {
    if (isSwiping) endDrag();
  }, [isSwiping, endDrag]);

  /* Rubber-band resistance at the edges (can't swipe past first/last) */
  const resistance = (x: number) => {
    if (x < 0 && index === images.length - 1) return x * 0.3;
    if (x > 0 && index === 0) return x * 0.3;
    return x;
  };

  return (
    <div className="neon-lightbox-overlay" onClick={onClose}>
      <div
        className="neon-lightbox-container"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          // Allow vertical panning, lock horizontal for image swiping
          touchAction: "pan-y",
          userSelect: isSwiping ? "none" : undefined,
          cursor: isSwiping ? "grabbing" : "grab",
        }}
      >
        {/* Close button */}
        <button className="neon-lightbox-close" onClick={onClose} aria-label="Fechar" type="button">
          <X className="w-5 h-5" />
        </button>

        {/* Image with neon frame */}
        <div
          className="neon-lightbox-frame"
          style={{
            transform: `translateX(${resistance(dragX)}px)`,
            transition: isSwiping ? "none" : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            willChange: "transform",
          }}
        >
          <img
            src={img.src}
            alt={img.caption}
            className="neon-lightbox-image"
            draggable={false}
          />
        </div>

        {/* Caption */}
        <div className="neon-lightbox-caption">
          <span className="neon-lightbox-caption-text">{img.caption}</span>
          <span className="neon-lightbox-counter">{index + 1} / {images.length}</span>
        </div>

        {/* Navigation arrows */}
        {index > 0 && (
          <button
            className="neon-lightbox-nav neon-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Anterior"
            type="button"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {index < images.length - 1 && (
          <button
            className="neon-lightbox-nav neon-lightbox-next"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Próxima"
            type="button"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Swipe hint — only on touch devices, only on first image */}
        {index === 0 && (
          <div className="neon-lightbox-swipe-hint" aria-hidden="true">
            <ChevronRight className="w-4 h-4" /> Arrasta para mudar
          </div>
        )}
      </div>
    </div>
  );
}
