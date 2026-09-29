/**
 * Compresses an uploaded image file on the client side using HTML5 Canvas.
 * Produces an optimized JPEG Base64 string suitable for ID cards (<100KB),
 * avoiding bloated payloads while preserving crisp facial features.
 */
export async function compressStudentPhoto(
  file: File,
  maxWidth = 400,
  maxHeight = 500,
  quality = 0.85
): Promise<string> {
  // Allow all standard image types
  const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|bmp|gif)$/i.test(file.name);
  if (!isImage) {
    throw new Error('Please upload an image file (JPEG, PNG, or WebP).');
  }

  // Max raw input size: 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size exceeds 10MB. Please choose a smaller photo.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file. Please try another photo.'));
    };

    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();

      img.onerror = () => {
        // Fallback directly to raw data URL if image decoding fails in canvas
        if (rawDataUrl && rawDataUrl.startsWith('data:image/')) {
          resolve(rawDataUrl);
        } else {
          reject(new Error('Could not decode photo. Please choose another image.'));
        }
      };

      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          // Calculate aspect-ratio constrained dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          // Fill white background for transparent PNGs
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);

          // Draw image smoothly
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to optimized JPEG data URL
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (_) {
          // If canvas operations fail (e.g. security/taint restrictions), fallback to raw
          resolve(rawDataUrl);
        }
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
