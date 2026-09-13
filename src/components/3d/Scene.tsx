import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Grid, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { TentModel } from './TentModel';
import { CameraController } from './CameraController';
import { DimensionCallouts } from './DimensionCallouts';
import { useCanvasTextureSync } from '../../hooks/useCanvasTextureSync';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { Loader2 } from 'lucide-react';

function SceneFallback() {
  return (
    <Html center>
      <div className="flex items-center gap-2.5 bg-white/95 text-slate-800 px-5 py-3 rounded-xl border border-slate-200 shadow-xl">
        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
        <div className="text-xs font-semibold tracking-wide">Loading 3D Tent Model...</div>
      </div>
    </Html>
  );
}

export function Scene() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const { masterTexture, textureVersion } = useCanvasTextureSync();
  const showGrid = useConfiguratorStore((state) => state.viewport.showGrid);
  const autoRotate = useConfiguratorStore((state) => state.viewport.autoRotate);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        id="three-tent-canvas"
        shadows
        camera={{ position: [3.8, 2.2, 3.8], fov: 40 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.9} color="#ffffff" />
        <directionalLight
          position={[7, 10, 7]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={25}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-6, 5, -5]} intensity={0.8} color="#f1f5f9" />
        <directionalLight position={[0, -2, 0]} intensity={0.3} color="#e2e8f0" />

        <Suspense fallback={<SceneFallback />}>
          <CameraController controlsRef={controlsRef} />
          <TentModel masterTexture={masterTexture} textureVersion={textureVersion} />
          <DimensionCallouts />

          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.4}
            scale={8.5}
            blur={2.0}
            far={3.0}
            color="#334155"
          />

          {showGrid && (
            <Grid
              position={[0, -0.001, 0]}
              args={[12, 12]}
              cellSize={0.5}
              cellThickness={0.7}
              cellColor="#94a3b8"
              sectionSize={2}
              sectionThickness={1.2}
              sectionColor="#64748b"
              fadeDistance={10}
              fadeStrength={1}
            />
          )}
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.06}
          minDistance={2.0}
          maxDistance={12.0}
          maxPolarAngle={Math.PI / 2 - 0.03}
          autoRotate={autoRotate}
          autoRotateSpeed={1.0}
        />
      </Canvas>
    </div>
  );
}
