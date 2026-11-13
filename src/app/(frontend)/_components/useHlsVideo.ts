import { RefObject, useEffect, useMemo, useState } from "react";

export const HLS_SRC = "/videos/hls/master.m3u8";
export const HLS_TYPE = "application/vnd.apple.mpegurl";

export type Playback = "native" | "hlsjs" | "file";

function detectPlayback(): Playback {
  if (document.createElement("video").canPlayType(HLS_TYPE)) return "native";
  return "MediaSource" in window ? "hlsjs" : "file";
}

/**
 * Picks how the video plays: native HLS (Safari, iOS), hls.js (loaded only
 * when native HLS is missing) or the plain MP4 files if HLS is unavailable.
 * Call with `enabled` once the video element can be rendered on the client.
 */
export default function useHlsVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean
): Playback {
  const [failed, setFailed] = useState(false);
  const playback = useMemo<Playback>(
    () => (enabled && !failed ? detectPlayback() : "file"),
    [enabled, failed]
  );

  useEffect(() => {
    if (playback !== "hlsjs") return;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    import("hls.js").then(({ default: Hls }) => {
      const video = videoRef.current;
      if (cancelled || !video) return;
      if (!Hls.isSupported()) {
        setFailed(true);
        return;
      }
      const hls = new Hls({ enableWorker: false });
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setFailed(true);
      });
      hls.loadSource(HLS_SRC);
      hls.attachMedia(video);
      destroy = () => hls.destroy();
    });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [playback, videoRef]);

  return playback;
}
