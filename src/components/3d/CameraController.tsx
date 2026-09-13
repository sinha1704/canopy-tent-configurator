import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { TENT_SIZES_CONFIG } from '../../constants/configurator';

interface CameraControllerProps {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export function CameraController({ controlsRef }: CameraControllerProps) {
  const { camera } = useThree();
  const cameraPreset = useConfiguratorStore((state) => state.viewport.cameraPreset);
  const tentSize = useConfiguratorStore((state) => state.tentSize);
  const activeSurfaceId = useConfiguratorStore((state) => state.activeSurfaceId);

  // Determine ideal camera distance based on tent size
  const dist = TENT_SIZES_CONFIG[tentSize]?.cameraDistance || 5.5;

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    let targetX = 0;
    let targetY = 2.2;
    let targetZ = dist;

    switch (cameraPreset) {
      case 'perspective':
        targetX = dist * 0.7;
        targetY = 2.4;
        targetZ = dist * 0.7;
        break;
      case 'front':
        targetX = 0;
        targetY = 1.6;
        targetZ = dist;
        break;
      case 'back':
        targetX = 0;
        targetY = 1.6;
        targetZ = -dist;
        break;
      case 'left':
        targetX = -dist;
        targetY = 1.6;
        targetZ = 0;
        break;
      case 'right':
        targetX = dist;
        targetY = 1.6;
        targetZ = 0;
        break;
      case 'top':
        targetX = 0.001; // tiny offset avoids singularity in spherical coords
        targetY = dist * 1.25;
        targetZ = 0.001;
        break;
    }

    // Smooth transition
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(targetX, targetY, targetZ);
    const startTarget = controls.target.clone();
    const endTarget = new THREE.Vector3(0, 1.3, 0);

    let frameId: number;
    const durationMs = 400;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1.0, elapsed / durationMs);

      // Smooth cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPos, endPos, ease);
      controls.target.lerpVectors(startTarget, endTarget, ease);
      controls.update();

      if (progress < 1.0) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [cameraPreset, tentSize, dist, camera, controlsRef]);

  // If user clicks a specific surface in 2D or 3D, orient camera naturally towards that face
  useEffect(() => {
    if (!controlsRef.current) return;
    if (activeSurfaceId.startsWith('back')) {
      useConfiguratorStore.getState().setCameraPreset('back');
    } else if (activeSurfaceId.startsWith('left')) {
      useConfiguratorStore.getState().setCameraPreset('left');
    } else if (activeSurfaceId.startsWith('right')) {
      useConfiguratorStore.getState().setCameraPreset('right');
    } else if (activeSurfaceId.startsWith('front')) {
      useConfiguratorStore.getState().setCameraPreset('front');
    }
  }, [activeSurfaceId, controlsRef]);

  return null;
}
