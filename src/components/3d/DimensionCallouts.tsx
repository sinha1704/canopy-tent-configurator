import { Html } from '@react-three/drei';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { TENT_SIZES_CONFIG } from '../../constants/configurator';

export function DimensionCallouts() {
  const showDimensions = useConfiguratorStore((state) => state.viewport.showDimensions);
  const tentSize = useConfiguratorStore((state) => state.tentSize);

  if (!showDimensions) return null;

  const config = TENT_SIZES_CONFIG[tentSize];
  const halfWidth = tentSize === '8x8' ? 1.206 : 0.751;
  const heightValance = tentSize === '8x8' ? 1.52 : tentSize === '6.5x6.5' ? 1.20 : 1.25;
  const heightPeak = tentSize === '8x8' ? 2.60 : 2.12;

  return (
    <group>
      {/* Width Dimension Callout (Front base line) */}
      <Html position={[0, 0.05, halfWidth + 0.25]} center>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 dark:bg-slate-950/90 text-white rounded-md text-[11px] font-semibold shadow-md border border-slate-700/80 backdrop-blur-xs whitespace-nowrap select-none pointer-events-none tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>Width: {config.nominalDimensions.split('(')[0].trim()}</span>
        </div>
      </Html>

      {/* Depth Dimension Callout (Right base line) */}
      <Html position={[halfWidth + 0.25, 0.05, 0]} center>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 dark:bg-slate-950/90 text-white rounded-md text-[11px] font-semibold shadow-md border border-slate-700/80 backdrop-blur-xs whitespace-nowrap select-none pointer-events-none tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>Depth: {config.nominalDimensions.split('(')[0].trim()}</span>
        </div>
      </Html>

      {/* Height Dimension Callout (Valance clearance) */}
      <Html position={[-halfWidth - 0.2, heightValance / 2, halfWidth]} center>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 dark:bg-slate-950/90 text-white rounded-md text-[11px] font-semibold shadow-md border border-slate-700/80 backdrop-blur-xs whitespace-nowrap select-none pointer-events-none tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Clearance: 7 ft</span>
        </div>
      </Html>

      {/* Peak Overall Height Callout */}
      <Html position={[0, heightPeak + 0.2, 0]} center>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 dark:bg-slate-950/90 text-white rounded-md text-[11px] font-semibold shadow-md border border-slate-700/80 backdrop-blur-xs whitespace-nowrap select-none pointer-events-none tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Peak: 10.5 ft</span>
        </div>
      </Html>
    </group>
  );
}
