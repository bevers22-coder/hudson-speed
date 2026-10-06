import React, { useState } from "react";
import { Image } from "@/components/ui/image";

const INITIALS = "JC";
const MAX_WIDTH = 420;

// Jimmy's portrait.
//
// Rendered through the platform Image component, which serves the file resized
// to the rendered box and re-encoded per device pixel ratio. The stored photo
// is high resolution, so a retina phone or a large desktop screen both get a
// genuinely sharp image instead of a soft upscale. No blur, opacity or sepia
// filters are applied anywhere.
//
// The frame is a fixed 2:3 portrait with the crop anchored toward the top of
// the frame, so his face stays in view whatever the source aspect ratio is.
export default function CoachPhoto({ src, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`rounded-[12px] border border-[hsl(var(--navy))] bg-[hsl(var(--navy))] flex items-center justify-center shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)] ${className}`}
        style={{ aspectRatio: "2 / 3", maxWidth: `${MAX_WIDTH}px` }}
      >
        <span className="font-orbitron font-bold text-white text-5xl sm:text-6xl tracking-widest">
          {INITIALS}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-[12px] overflow-hidden border-2 border-[hsl(var(--navy))] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] ${className}`}
      style={{ maxWidth: `${MAX_WIDTH}px`, aspectRatio: "2 / 3" }}
    >
      <Image
        src={src}
        alt="Coach Jimmy Carter"
        fittingType="fill"
        focalPointX={0.5}
        focalPointY={0.12}
        quality={92}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="block w-full h-full"
      />
      <span className="absolute inset-x-0 bottom-0 h-1.5 bg-[hsl(var(--energy))]" aria-hidden="true" />
    </div>
  );
}
