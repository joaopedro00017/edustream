interface ParsedVideo {
  kind: "youtube" | "direct";
  embedUrl: string;
}

const YOUTUBE_PATTERN =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/;

export function parseVideoUrl(videoUrl: string): ParsedVideo {
  const match = videoUrl.match(YOUTUBE_PATTERN);

  if (match) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${match[1]}`,
    };
  }

  return { kind: "direct", embedUrl: videoUrl };
}
