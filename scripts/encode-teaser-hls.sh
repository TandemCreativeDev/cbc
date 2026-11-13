#!/usr/bin/env bash
# Encodes the teaser master into an HLS ladder (480p, 720p, 1080p) in public/videos/hls.
# The 34 MB master is no longer in the tree: #45 (b7ba479) replaced public/videos/teaser.mp4
# with the H.264 fallback, so the master is read from the commit before it to avoid a second
# generation of compression.
set -euo pipefail

cd "$(dirname "$0")/.."
src=$(mktemp)
trap 'rm -f "$src"' EXIT
git show b7ba479^:public/videos/teaser.mp4 >"$src"
out=public/videos/hls

rm -rf "$out"
mkdir -p "$out"

# 24 fps with a keyframe every 2 s, so every rung switches on segment boundaries.
ffmpeg -hide_banner -y -i "$src" \
  -filter_complex "[0:v]setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709,split=3[v1][v2][v3];[v1]scale=-2:480[o1];[v2]scale=-2:720[o2];[v3]copy[o3]" \
  -map "[o1]" -map 0:a -map "[o2]" -map 0:a -map "[o3]" -map 0:a \
  -c:v libx264 -preset slow -profile:v high -pix_fmt yuv420p \
  -r 24 -g 48 -keyint_min 48 -sc_threshold 0 \
  -b:v:0 900k -maxrate:v:0 1000k -bufsize:v:0 2000k \
  -b:v:1 1800k -maxrate:v:1 2000k -bufsize:v:1 4000k \
  -b:v:2 3000k -maxrate:v:2 3300k -bufsize:v:2 6600k \
  -c:a aac -b:a 96k -ac 2 \
  -f hls -hls_time 2 -hls_playlist_type vod \
  -hls_segment_type fmp4 -hls_flags independent_segments \
  -hls_fmp4_init_filename init.mp4 \
  -hls_segment_filename "$out/%v/segment-%03d.m4s" \
  -master_pl_name master.m3u8 \
  -var_stream_map "v:0,a:0,name:480p v:1,a:1,name:720p v:2,a:2,name:1080p" \
  "$out/%v/playlist.m3u8"
