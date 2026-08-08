"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface MediaGalleryProps {
  screenshots: string[];
}

export function MediaGallery({ screenshots }: MediaGalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (!screenshots?.length) return null;

  function openLightbox(url: string) {
    setActiveImage(url);
    dialogRef.current?.showModal();
  }

  function closeLightbox() {
    dialogRef.current?.close();
    setActiveImage(null);
  }

  return (
    <div className="space-y-4">
      <dialog
        ref={dialogRef}
        className="backdrop:bg-black/80 bg-transparent p-0 m-auto max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl backdrop:backdrop-blur-sm open:animate-in open:fade-in-0 open:zoom-in-95"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox();
        }}
      >
        {activeImage && (
          <div className="relative">
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              aria-label="Close"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <Image
              src={activeImage}
              alt="Screenshot full size"
              width={1920}
              height={1080}
              sizes="(max-width: 768px) 90vw, 70vw"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            />
          </div>
        )}
      </dialog>

      <h2 className="text-2xl font-bold">Showcase Gallery</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:snap-none">
        {screenshots.map((url, i) => (
          <button
            key={url}
            onClick={() => openLightbox(url)}
            className="relative aspect-video w-[75%] sm:w-[45%] shrink-0 snap-start bg-muted rounded-xl overflow-hidden border shadow-sm transition-transform hover:scale-[1.02] cursor-zoom-in md:w-auto md:shrink"
          >
            <Image
              src={url}
              alt={`Screenshot ${i + 1}`}
              fill
              sizes="(max-width: 768px) 75vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
