import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useConfiguratorStore } from '../store/useConfiguratorStore';
import { CanopyCanvasRenderer } from '../utils/canvasRenderer';

/**
 * Custom Hook: useCanvasTextureSync
 * 
 * Performance & Architecture Strategy:
 * 1. Offscreen Master Atlas: Renders all 8 tent panels onto a single 2048x2048 master canvas.
 * 2. CanvasTexture Singleton: Maintains a single THREE.CanvasTexture instance. Zero texture switching.
 * 3. Texture Disposal: Explicitly disposes the THREE.CanvasTexture upon unmount to prevent WebGL memory leaks.
 * 4. Texture settings:
 *    - generateMipmaps = true (with minFilter = LinearMipmapLinearFilter) for crisp anti-aliased view from any camera angle.
 *    - colorSpace = THREE.SRGBColorSpace for accurate color fidelity.
 */
export function useCanvasTextureSync() {
  const surfaces = useConfiguratorStore((state) => state.surfaces);
  const baseCanopyColor = useConfiguratorStore((state) => state.baseCanopyColor);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const [textureVersion, setTextureVersion] = useState(0);

  // Initialize canvas and texture synchronously with initial composite
  if (!canvasRef.current) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    // Immediately draw master atlas so texture is NEVER blank / uninitialized
    CanopyCanvasRenderer.compositeMasterAtlas(canvas, surfaces, baseCanopyColor);
    canvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.flipY = true;
    texture.needsUpdate = true;
    textureRef.current = texture;
  }

  // Synchronize canvas whenever surfaces or base canopy color change
  useEffect(() => {
    if (!canvasRef.current || !textureRef.current) return;

    // Render composite to offscreen canvas
    CanopyCanvasRenderer.compositeMasterAtlas(canvasRef.current, surfaces, baseCanopyColor);

    // Notify Three.js that texture pixels changed
    textureRef.current.needsUpdate = true;
    setTextureVersion((v) => v + 1);
  }, [surfaces, baseCanopyColor]);

  // Clean disposal on unmount
  useEffect(() => {
    const texture = textureRef.current;
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, []);

  return {
    masterTexture: textureRef.current,
    masterCanvas: canvasRef.current,
    textureVersion,
  };
}
