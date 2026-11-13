import { jpegQuality, maxImageSide } from "./imageLimits";

const compressible = ["image/jpeg", "image/png", "image/webp"];

/** Resizes to at most maxImageSide on the long side (never enlarged) and re-encodes as JPEG with jSquash. */
export async function compressImage(file: File): Promise<File> {
  if (!compressible.includes(file.type)) return file;
  const [{ default: encode }, { default: resize }] = await Promise.all([
    import("@jsquash/jpeg/encode"),
    import("@jsquash/resize"),
  ]);

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxImageSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, bitmap.width, bitmap.height);
  context.drawImage(bitmap, 0, 0);
  bitmap.close();

  let pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  if (scale < 1) pixels = await resize(pixels, { width, height });

  const jpeg = await encode(pixels, {
    quality: jpegQuality,
    progressive: true,
  });
  if (jpeg.byteLength >= file.size && file.type === "image/jpeg") return file;

  return new File([jpeg], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
    type: "image/jpeg",
    lastModified: file.lastModified,
  });
}
