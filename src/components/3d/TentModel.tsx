import { useEffect, useMemo, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { TENT_SIZES_CONFIG } from '../../constants/configurator';
import type { SurfaceId } from '../../types/configurator';

interface TentModelProps {
  masterTexture: THREE.CanvasTexture | null;
  textureVersion?: number;
}

const checkIsFabricMesh = (mesh: THREE.Mesh): boolean => {
  const pName = mesh.parent?.name?.toLowerCase() || '';
  const mName = mesh.name?.toLowerCase() || '';
  if (pName.includes('leg') || mName.includes('leg') || pName.includes('mech') || mName.includes('mech')) {
    return false;
  }
  return (
    pName.includes('fabric') ||
    mName.includes('fabric') ||
    pName.includes('tent') ||
    mName.includes('canopy')
  );
};

export function TentModel({ masterTexture, textureVersion }: TentModelProps) {
  const tentSize = useConfiguratorStore((state) => state.tentSize);
  const frameType = useConfiguratorStore((state) => state.frameType);
  const setActiveSurfaceId = useConfiguratorStore((state) => state.setActiveSurfaceId);
  const wireframe = useConfiguratorStore((state) => state.viewport.wireframe);
  const accessories = useConfiguratorStore((state) => state.accessories);
  const baseCanopyColor = useConfiguratorStore((state) => state.baseCanopyColor);
  const surfaces = useConfiguratorStore((state) => state.surfaces);

  const [, setHoveredSurface] = useState<SurfaceId | null>(null);

  const modelConfig = TENT_SIZES_CONFIG[tentSize];
  const gltf = useGLTF(modelConfig.modelFile);

  const frameColor = useConfiguratorStore((state) => state.frameColor);

  const fabricMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      map: masterTexture || undefined,
      color: '#FFFFFF',
      roughness: 0.65,
      metalness: 0.05,
      side: THREE.DoubleSide,
      wireframe: wireframe,
    });
    return mat;
  }, [masterTexture, wireframe]);

  // Metal frame & leg sticks material (instant color customization)
  const metalMaterial = useMemo(() => {
    const isHex = frameType === 'hex_aluminum_pro';
    return new THREE.MeshStandardMaterial({
      color: frameColor,
      roughness: isHex ? 0.35 : 0.45,
      metalness: isHex ? 0.8 : 0.4,
      wireframe: wireframe,
    });
  }, [frameColor, frameType, wireframe]);

  // Dedicated material for underside / interior lining fabric matching baseCanopyColor
  const innerFabricMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: baseCanopyColor,
      roughness: 0.8,
      metalness: 0.0,
      side: THREE.DoubleSide,
      wireframe: wireframe,
    });
  }, [baseCanopyColor, wireframe]);

  // Clone scene and synchronously apply custom fabric and metal materials so there is ZERO 1-second flash of default GLTF colors
  const clonedScene = useMemo(() => {
    const scene = gltf.scene.clone(true);

    scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const isFabric = checkIsFabricMesh(mesh);

        if (isFabric) {
          // Strip ALL vertex color attributes exported by Blender that override shader material colors
          if (mesh.geometry) {
            ['color', 'color_1', 'color_2', 'COLOR_0', 'COLOR_1', 'COLOR_2'].forEach((attr) => {
              if (mesh.geometry.attributes[attr]) {
                mesh.geometry.deleteAttribute(attr);
              }
            });
          }

          const origMatName = (mesh.userData?.origMatName as string) || (Array.isArray(mesh.material) ? mesh.material[0]?.name : mesh.material?.name) || '';
          if (!mesh.userData?.origMatName && origMatName) {
            mesh.userData.origMatName = origMatName;
          }
          const isInner = (mesh.userData.origMatName || '').toLowerCase().includes('inner') || mesh.name.endsWith('_1');

          if (isInner) {
            mesh.material = innerFabricMaterial;
          } else {
            mesh.material = fabricMaterial;
          }
        } else {
          mesh.material = metalMaterial;
        }
      }
    });

    return scene;
  }, [gltf.scene, fabricMaterial, innerFabricMaterial, metalMaterial]);

  // Exact geometric measurements per official 3D model GLB files:
  // 5x5 (Tent_5_5.glb): leg frame span X/Z = 1.502m (halfWidth = 0.751m), valance bottom Y = 1.25m
  // 6.5x6.5 (Tent_6.5_6.5.glb): leg frame span X/Z = 1.502m (halfWidth = 0.751m), valance bottom Y = 1.20m
  // 8x8 (Tent_8_8.glb): leg frame span X/Z = 2.412m (halfWidth = 1.206m), valance bottom Y = 1.52m
  const modelMetrics = useMemo(() => {
    switch (tentSize) {
      case '8x8':
        return { halfW: 1.206, height: 1.52, valanceOverlap: 0.05 };
      case '6.5x6.5':
        // Tent_6.5_6.5.glb has 1.502m leg span and 1.20m valance bottom
        return { halfW: 0.751, height: 1.20, valanceOverlap: 0.05 };
      case '5x5':
      default:
        // Tent_5_5.glb has 1.502m leg span and 1.25m valance bottom
        return { halfW: 0.751, height: 1.25, valanceOverlap: 0.05 };
    }
  }, [tentSize]);

  const wallColor = useConfiguratorStore((state) => state.wallColor);

  // Dedicated wall fabric material matching wallColor instantaneously
  const wallMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: wallColor,
      side: THREE.DoubleSide,
      roughness: 0.75,
      metalness: 0.02,
      wireframe: wireframe,
    });
  }, [wallColor, wireframe]);

  // Back wall mesh geometry (if enabled in accessories)
  const backWallMesh = useMemo(() => {
    if (!accessories.hasBackWall) return null;

    const { halfW, height, valanceOverlap } = modelMetrics;
    const w = halfW * 2;
    const h = height + valanceOverlap;
    const geom = new THREE.PlaneGeometry(w, h);

    return { geom, mat: wallMaterial, pos: [0, h / 2, -halfW] as [number, number, number] };
  }, [accessories.hasBackWall, modelMetrics, wallMaterial]);

  // Full side walls (pair) mesh geometry (if enabled in accessories)
  const sideWallsMeshes = useMemo(() => {
    if (!accessories.hasSideWalls) return null;

    const { halfW, height, valanceOverlap } = modelMetrics;
    const w = halfW * 2;
    const h = height + valanceOverlap;
    const geom = new THREE.PlaneGeometry(w, h);

    return [
      // Left side wall (flush with left legs)
      { geom, mat: wallMaterial, pos: [-halfW, h / 2, 0] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] },
      // Right side wall (flush with right legs)
      { geom, mat: wallMaterial, pos: [halfW, h / 2, 0] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] },
    ];
  }, [accessories.hasSideWalls, modelMetrics, wallMaterial]);

  // Apply updates to cloned scene fabric texture and materials whenever texture, colors or surfaces update
  useEffect(() => {
    if (masterTexture) {
      masterTexture.needsUpdate = true;
      fabricMaterial.map = masterTexture;
      fabricMaterial.needsUpdate = true;
    }

    // Update metal material color and roughness dynamically
    metalMaterial.color.set(frameColor);
    metalMaterial.needsUpdate = true;

    clonedScene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        if (checkIsFabricMesh(mesh)) {
          const isInner = (mesh.userData?.origMatName || '').toLowerCase().includes('inner') || mesh.name.endsWith('_1');
          if (isInner) {
            mesh.material = innerFabricMaterial;
          } else {
            mesh.material = fabricMaterial;
          }
        } else {
          mesh.material = metalMaterial;
        }
      }
    });
  }, [clonedScene, fabricMaterial, innerFabricMaterial, metalMaterial, frameColor, masterTexture, textureVersion, baseCanopyColor, surfaces]);

  // 3D Raycasting: Determine which canopy quadrant was clicked/hovered
  const resolveSurfaceFromIntersection = (event: ThreeEvent<PointerEvent>): SurfaceId | null => {
    const mesh = event.object as THREE.Mesh;
    if (!checkIsFabricMesh(mesh)) {
      return null;
    }

    if (!event.point) return null;

    const p = event.point;
    const isPeak = p.y > 1.28;
    let side: 'front' | 'back' | 'left' | 'right' = 'front';

    if (Math.abs(p.z) >= Math.abs(p.x)) {
      side = p.z >= 0 ? 'front' : 'back';
    } else {
      side = p.x >= 0 ? 'right' : 'left';
    }

    return `${side}_${isPeak ? 'peak' : 'valance'}` as SurfaceId;
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const surfaceId = resolveSurfaceFromIntersection(event);
    if (surfaceId) {
      setActiveSurfaceId(surfaceId);
    }
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const surfaceId = resolveSurfaceFromIntersection(event);
    setHoveredSurface(surfaceId);
    if (surfaceId) {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    setHoveredSurface(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <group
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <primitive object={clonedScene} />

      {/* Optional Accessory Back Wall */}
      {backWallMesh && (
        <mesh
          geometry={backWallMesh.geom}
          material={backWallMesh.mat}
          position={backWallMesh.pos}
          rotation={[0, 0, 0]}
          castShadow
          receiveShadow
        />
      )}

      {/* Optional Accessory Side Walls (Left & Right) */}
      {sideWallsMeshes &&
        sideWallsMeshes.map((wall, idx) => (
          <mesh
            key={idx}
            geometry={wall.geom}
            material={wall.mat}
            position={wall.pos}
            rotation={wall.rot}
            castShadow
            receiveShadow
          />
        ))}
    </group>
  );
}

// Preload all 3 tent models for instantaneous switching without pause
useGLTF.preload(TENT_SIZES_CONFIG['5x5'].modelFile);
useGLTF.preload(TENT_SIZES_CONFIG['6.5x6.5'].modelFile);
useGLTF.preload(TENT_SIZES_CONFIG['8x8'].modelFile);
