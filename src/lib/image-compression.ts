export async function compressImage(
  file: File,
  options = { maxWidth: 1200, maxHeight: 1200, quality: 0.8 }
): Promise<File> {
  // Only compress images, excluding gifs
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file;
  }

  // Already small enough to just pass through
  if (file.size < 500 * 1024) return file; // < 500KB

  return new Promise((resolve, _reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const { maxWidth, maxHeight } = options;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(file); // fallback to original if canvas fails
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          blob => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // fallback
            }
          },
          'image/jpeg',
          options.quality
        );
      };
      img.onerror = () => resolve(file); // fallback
      img.src = event.target?.result as string;
    };
    reader.onerror = () => resolve(file); // fallback
    reader.readAsDataURL(file);
  });
}
