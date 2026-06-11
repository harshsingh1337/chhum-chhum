export function vercelImageUrl(src, { w = 800, q = 75 } = {}) {
  if (!src) return src;
  // Ensure we encode the original URL so the platform proxy can fetch it
  return `/_vercel/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;
}
