"use client";

import React, { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   Neon Lightbox — K-Pop themed photo popup
   
   Dark mode: neon purple/pink border glow
   Light mode: golden/iridescent soft glow
   Navigate with arrows, close with X or click outside.
   ═══════════════════════════════════════════════════════════════════ */

interface NeonLightboxProps {
  images: { src: string; caption: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function NeonLightbox({ images, index, onClose, onPrev, onNext }: NeonLightboxProps) {
  const img = images[index];

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

  return (
    <div className="neon-lightbox-overlay" onClick={onClose}>
      <div className="neon-lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="neon-lightbox-close" onClick={onClose} aria-label="Fechar">
          <X className="w-5 h-5" />
        </button>

        {/* Image with neon frame */}
        <div className="neon-lightbox-frame">
          <img
            src={img.src}
            alt={img.caption}
            className="neon-lightbox-image"
          />
        </div>

        {/* Caption */}
        <div className="neon-lightbox-caption">
          <span className="neon-lightbox-caption-text">{img.caption}</span>
          <span className="neon-lightbox-counter">{index + 1} / {images.length}</span>
        </div>

        {/* Navigation arrows */}
        {index > 0 && (
          <button className="neon-lightbox-nav neon-lightbox-prev" onClick={onPrev} aria-label="Anterior">
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {index < images.length - 1 && (
          <button className="neon-lightbox-nav neon-lightbox-next" onClick={onNext} aria-label="Próxima">
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
