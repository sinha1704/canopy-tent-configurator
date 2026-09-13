/**
 * Utility to capture a crisp snapshot from the 3D WebGL Canvas
 * Ensures a composite white background is drawn behind any alpha channel
 * so exported images are never transparent/black or blank.
 */
export function getThreeCanvasSnapshot(mimeType: 'image/png' | 'image/jpeg' = 'image/jpeg', quality = 0.95): string | null {
  // Find the WebGL canvas inside the 3D scene
  const canvases = Array.from(document.querySelectorAll('canvas'));
  const canvas = canvases.find((c) => {
    // Exclude small 2D preview canvases
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    return gl !== null;
  }) || (document.querySelector('#three-tent-canvas canvas') as HTMLCanvasElement | null) || canvases[0];

  if (!canvas || canvas.width === 0 || canvas.height === 0) {
    return null;
  }

  try {
    // If PNG is requested and transparency is desired, direct toDataURL
    if (mimeType === 'image/png') {
      return canvas.toDataURL('image/png');
    }

    // For JPEG, composite onto a crisp white background to prevent WebGL alpha turning black/blank
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) {
      return canvas.toDataURL(mimeType, quality);
    }

    // Draw white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    // Draw 3D WebGL content on top
    ctx.drawImage(canvas, 0, 0);

    return tempCanvas.toDataURL('image/jpeg', quality);
  } catch (err) {
    console.error('Failed to capture 3D canvas snapshot:', err);
    return null;
  }
}

/**
 * Triggers a direct file download in the browser using Blob URL
 * Compatible with all desktop & mobile browsers, avoiding pop-up blockers
 */
export function triggerFileDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  // Keep object URL alive for 60 seconds so browser download stream completes safely
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(url);
  }, 60000);
}
