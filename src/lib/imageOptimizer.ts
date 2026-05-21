/**
 * Utility to compress and resize base64 images client-side.
 * This ensures portfolios load extremely quickly and consume very little database space.
 */

export function compressAndResizeImage(
  base64OrFile: string | File,
  maxDimension = 1080,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Get image source as base64 string
    const getBase64 = (): Promise<string> => {
      if (base64OrFile instanceof File) {
        return new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as string);
          reader.onerror = (err) => rej(err);
          reader.readAsDataURL(base64OrFile);
        });
      }
      return Promise.resolve(base64OrFile);
    };

    getBase64()
      .then((base64) => {
        // If it's not a valid data URL or is an SVG, don't try to compress with canvas
        if (!base64.startsWith('data:image/') || base64.includes('image/svg+xml')) {
          resolve(base64);
          return;
        }

        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions preserving aspect ratio
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(base64); // Fallback to original on context error
            return;
          }

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Output compressed format (JPEG is highly compressed compared to PNG)
          const resultBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(resultBase64);
        };

        img.onerror = (err) => {
          console.error('Image loading error during compression:', err);
          resolve(base64); // Fallback to original
        };

        img.src = base64;
      })
      .catch((err) => {
        console.error('Compression helper error:', err);
        reject(err);
      });
  });
}
