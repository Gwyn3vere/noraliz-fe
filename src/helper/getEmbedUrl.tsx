export function getEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.slice(1);

      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.split("/").pop();

      return `https://player.vimeo.com/video/${videoId}`;
    }

    return url;
  } catch {
    return url;
  }
}
