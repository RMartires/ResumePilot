"use client";

import { useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_VIDEO_URL } from "@/components/landing/landing-data";

type ProductDemoProps = {
  className?: string;
  size?: "large" | "default";
};

export function ProductDemo({ className, size = "large" }: ProductDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className={cn("w-full min-w-0 max-w-full", className)}>
      <div
        className={cn(
          "relative w-full max-w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-emerald-950/30",
          size === "large" && "rounded-3xl",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <span className="text-sm text-zinc-400">Product demo</span>
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
            ResumePilot preview
          </span>
        </div>
        <div className="relative aspect-[16/10] w-full max-w-full bg-[#0a100e]">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={DEMO_VIDEO_URL} type="video/mp4" />
            Your browser does not support video playback.
          </video>
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
              aria-label={muted ? "Unmute demo" : "Mute demo"}
            >
              {muted ? (
                <VolumeX className="h-4 w-4" aria-hidden />
              ) : (
                <Volume2 className="h-4 w-4" aria-hidden />
              )}
            </button>
            <button
              type="button"
              onClick={togglePlayback}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
              aria-label={playing ? "Pause demo" : "Play demo"}
            >
              {playing ? (
                <Pause className="h-4 w-4" aria-hidden />
              ) : (
                <Play className="h-4 w-4" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
