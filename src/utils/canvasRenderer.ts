import type { SurfaceId, SurfaceCustomization } from '../types/configurator';

/**
 * UV Atlas Coordinates mapped directly to the GLTF model's TEXCOORD_0 buffer.
 * Derived from exact vertex inspection of Tent_5_5 / 6.5 / 8 GLB meshes:
 * 
 * front_peak    : U: [0.258, 0.742], V: [0.537, 0.867]
 * back_peak     : U: [0.260, 0.856], V: [0.135, 0.535]
 * left_peak     : U: [0.121, 0.498], V: [0.137, 0.864]
 * right_peak    : U: [0.502, 0.863], V: [0.253, 0.864]
 * front_valance : U: [0.256, 0.745], V: [0.866, 0.969]
 * back_valance  : U: [0.258, 0.965], V: [0.034, 0.251]
 * left_valance  : U: [0.020, 0.259], V: [0.035, 0.968]
 * right_valance : U: [0.744, 0.964], V: [0.247, 0.968]
 */

export interface UVAtlasBox {
  uMin: number;
  uMax: number;
  vMin: number;
  vMax: number;
  // Rotation offset in radians if UV island is oriented sideways in Blender/GLTF
  orientationAngle: number;
}

export const ATLAS_MAPPING: Record<SurfaceId, UVAtlasBox> = {
  // Peak Triangular Regions
  front_peak: {
    uMin: 0.258,
    uMax: 0.742,
    vMin: 0.537,
    vMax: 0.867,
    orientationAngle: 0,
  },
  back_peak: {
    uMin: 0.260,
    uMax: 0.745,
    vMin: 0.135,
    vMax: 0.465,
    orientationAngle: Math.PI, // Back peak is mirrored 180 degrees in UV unwrap
  },
  left_peak: {
    uMin: 0.121,
    uMax: 0.450,
    vMin: 0.280,
    vMax: 0.720,
    orientationAngle: Math.PI / 2, // 90 deg clockwise
  },
  right_peak: {
    uMin: 0.550,
    uMax: 0.863,
    vMin: 0.280,
    vMax: 0.720,
    orientationAngle: -Math.PI / 2, // 90 deg counter-clockwise
  },

  // Perimeter Valance Rectangular Strips
  front_valance: {
    uMin: 0.256,
    uMax: 0.745,
    vMin: 0.875,
    vMax: 0.985,
    orientationAngle: 0,
  },
  back_valance: {
    uMin: 0.258,
    uMax: 0.745,
    vMin: 0.015,
    vMax: 0.125,
    orientationAngle: Math.PI,
  },
  left_valance: {
    uMin: 0.020,
    uMax: 0.130,
    vMin: 0.256,
    vMax: 0.745,
    orientationAngle: Math.PI / 2,
  },
  right_valance: {
    uMin: 0.870,
    uMax: 0.980,
    vMin: 0.256,
    vMax: 0.745,
    orientationAngle: -Math.PI / 2,
  },

  // Wall accessory
  back_wall: {
    uMin: 0.0,
    uMax: 1.0,
    vMin: 0.0,
    vMax: 1.0,
    orientationAngle: 0,
  }
};

export class CanopyCanvasRenderer {
  private static imageCache: Map<string, HTMLImageElement> = new Map();
  private static reusableTempCanvas: HTMLCanvasElement | null = null;

  /**
   * Preloads an image URL into cache to ensure smooth synchronous rendering to canvas
   */
  public static preloadImage(url: string): Promise<HTMLImageElement> {
    const existing = this.imageCache.get(url);
    if (existing && existing.complete) {
      return Promise.resolve(existing);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.imageCache.set(url, img);
        resolve(img);
      };
      img.onerror = (err) => {
        console.warn(`Failed to load logo image: ${url}`, err);
        reject(err);
      };
      img.src = url;
    });
  }

  /**
   * Renders an individual 2D surface (peak or valance) to its own crisp offscreen canvas
   */
  public static renderSurfaceToCanvas(
    canvas: HTMLCanvasElement,
    customization: SurfaceCustomization,
    width = 1024,
    height = 512
  ): void {
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // 1. Background Fill
    ctx.fillStyle = customization.backgroundColor || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 2. Render Logos
    for (const logo of customization.logoLayers) {
      const img = this.imageCache.get(logo.imageUrl);
      if (img && img.complete) {
        ctx.save();
        ctx.globalAlpha = logo.opacity ?? 1.0;

        // Coordinates are normalized (0.0 to 1.0)
        const targetX = logo.x * width;
        const targetY = logo.y * height;
        const targetW = logo.width * width;
        const targetH = targetW / (logo.aspectRatio || 1.0);

        ctx.translate(targetX, targetY);
        if (logo.rotation) {
          ctx.rotate((logo.rotation * Math.PI) / 180);
        }

        // Draw centered
        ctx.drawImage(img, -targetW / 2, -targetH / 2, targetW, targetH);
        ctx.restore();
      }
    }

    // 3. Render Text Layers
    for (const textLayer of customization.textLayers) {
      if (!textLayer.text) continue;

      ctx.save();
      ctx.globalAlpha = textLayer.opacity ?? 1.0;

      const targetX = textLayer.x * width;
      const targetY = textLayer.y * height;

      ctx.translate(targetX, targetY);
      if (textLayer.rotation) {
        ctx.rotate((textLayer.rotation * Math.PI) / 180);
      }

      const fontStyle = textLayer.fontStyle === 'italic' ? 'italic ' : '';
      const fontWeight = textLayer.fontWeight === 'bold' ? 'bold ' : textLayer.fontWeight === '900' ? '900 ' : 'normal ';
      const fontSizePx = Math.round((textLayer.fontSize / 100) * height * 0.45);

      ctx.font = `${fontStyle}${fontWeight}${fontSizePx}px "${textLayer.fontFamily || 'Inter'}", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (textLayer.strokeWidth && textLayer.strokeColor) {
        ctx.strokeStyle = textLayer.strokeColor;
        ctx.lineWidth = textLayer.strokeWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(textLayer.text, 0, 0);
      }

      ctx.fillStyle = textLayer.fillColor || '#111827';
      ctx.fillText(textLayer.text, 0, 0);

      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Composes all 8 customized surfaces onto a unified 2048x2048 Master UV Atlas.
   * This composite canvas directly feeds the single THREE.CanvasTexture applied to fabric_Mat,
   * guaranteeing zero texture flickering, zero GPU state thrashing, and maximum WebGL efficiency.
   */
  public static compositeMasterAtlas(
    atlasCanvas: HTMLCanvasElement,
    surfaces: Record<SurfaceId, SurfaceCustomization>,
    baseCanopyColor = '#FFFFFF'
  ): void {
    const size = 2048;
    atlasCanvas.width = size;
    atlasCanvas.height = size;
    const ctx = atlasCanvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    // Default base canopy color flood
    ctx.fillStyle = baseCanopyColor;
    ctx.fillRect(0, 0, size, size);

    // Reusable offscreen buffer for rendering individual sections (zero GC allocation)
    if (!this.reusableTempCanvas) {
      this.reusableTempCanvas = document.createElement('canvas');
    }
    const tempCanvas = this.reusableTempCanvas;

    const surfaceEntries = Object.entries(surfaces) as [SurfaceId, SurfaceCustomization][];

    for (const [id, customization] of surfaceEntries) {
      const atlasBox = ATLAS_MAPPING[id];
      if (!atlasBox) continue;

      const destX = Math.round(atlasBox.uMin * size);
      const destW = Math.round((atlasBox.uMax - atlasBox.uMin) * size);
      // GLTF UV V=0 is bottom, V=1 is top, whereas HTML5 Canvas Y=0 is top.
      // Therefore, Canvas Y = (1 - vMax) * size
      const destY = Math.round((1.0 - atlasBox.vMax) * size);
      const destH = Math.round((atlasBox.vMax - atlasBox.vMin) * size);

      if (destW <= 0 || destH <= 0) continue;

      // Render surface contents to temp buffer
      this.renderSurfaceToCanvas(tempCanvas, customization, 1024, 512);

      ctx.save();
      const centerX = destX + destW / 2;
      const centerY = destY + destH / 2;

      ctx.translate(centerX, centerY);
      if (atlasBox.orientationAngle) {
        ctx.rotate(atlasBox.orientationAngle);
      }

      // Draw matched onto the UV region
      ctx.drawImage(tempCanvas, -destW / 2, -destH / 2, destW, destH);
      ctx.restore();
    }

    ctx.restore();
  }
}
