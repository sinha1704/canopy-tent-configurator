import {
  Compass,
  Grid as GridIcon,
  RotateCw,
  Box,
  Camera,
  Ruler
} from 'lucide-react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import type { CameraPreset } from '../../types/configurator';
import { getThreeCanvasSnapshot } from '../../utils/snapshotHelper';
import { toast } from 'react-toastify';

export function ViewportControls() {
  const cameraPreset = useConfiguratorStore((state) => state.viewport.cameraPreset);
  const setCameraPreset = useConfiguratorStore((state) => state.setCameraPreset);
  const showGrid = useConfiguratorStore((state) => state.viewport.showGrid);
  const toggleGrid = useConfiguratorStore((state) => state.toggleGrid);
  const autoRotate = useConfiguratorStore((state) => state.viewport.autoRotate);
  const toggleAutoRotate = useConfiguratorStore((state) => state.toggleAutoRotate);
  const wireframe = useConfiguratorStore((state) => state.viewport.wireframe);
  const toggleWireframe = useConfiguratorStore((state) => state.toggleWireframe);
  const showDimensions = useConfiguratorStore((state) => state.viewport.showDimensions);
  const toggleDimensions = useConfiguratorStore((state) => state.toggleDimensions);

  const presets: { id: CameraPreset; label: string }[] = [
    { id: 'perspective', label: '3D ISO' },
    { id: 'front', label: 'FRONT' },
    { id: 'left', label: 'LEFT' },
    { id: 'right', label: 'RIGHT' },
    { id: 'back', label: 'BACK' },
    { id: 'top', label: 'TOP' },
  ];

  const handleTakeSnapshot = () => {
    const dataUrl = getThreeCanvasSnapshot('image/png');
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `canopy-3d-render-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { document.body.removeChild(link); }, 100);
    toast.success('3D Canopy snapshot downloaded!');
  };

  const iconBtn = (active: boolean, activeColor: string) =>
    `p-2 rounded-lg transition-all cursor-pointer active:scale-95 ${
      active
        ? activeColor
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
    }`;

  return (
    <div className="absolute top-2.5 left-2.5 right-2.5 sm:right-auto z-20 flex items-center justify-between sm:justify-start gap-1.5 pointer-events-auto">
      <div className="flex sm:hidden items-center gap-1.5 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-sm px-2.5 py-1.5">
        <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
        <select
          value={cameraPreset}
          onChange={(e) => setCameraPreset(e.target.value as CameraPreset)}
          className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-xs focus:outline-none cursor-pointer"
        >
          {presets.map((p) => (
            <option key={p.id} value={p.id} className="dark:bg-[#111827]">
              {p.label === '3D ISO' ? '3D View' : `${p.label.charAt(0) + p.label.slice(1).toLowerCase()} View`}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden sm:flex items-center p-1 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm text-xs">
        <div className="flex items-center gap-1 px-2 text-slate-500 dark:text-slate-400 font-medium text-xs">
          <Compass className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>View</span>
        </div>
        <div className="flex items-center gap-0.5">
          {presets.map((p) => {
            const isActive = cameraPreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setCameraPreset(p.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {p.label === '3D ISO' ? '3D' : p.label.charAt(0) + p.label.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md rounded-lg border border-slate-200/80 dark:border-slate-700 shadow-sm gap-0 p-0.5">

        <button onClick={toggleGrid} title="Toggle Grid"
          className={iconBtn(showGrid, 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800')}
        >
          <GridIcon className="w-3.5 h-3.5" />
        </button>

        <button onClick={toggleAutoRotate} title="Auto Rotate"
          className={iconBtn(autoRotate, 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800')}
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>

        <button onClick={toggleWireframe} title="Wireframe"
          className={iconBtn(wireframe, 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800')}
        >
          <Box className="w-3.5 h-3.5" />
        </button>

        <button onClick={toggleDimensions} title="Dimensions"
          className={iconBtn(showDimensions, 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800')}
        >
          <Ruler className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

        <button onClick={handleTakeSnapshot} title="Save Snapshot"
          className="flex items-center gap-1 px-2 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
        >
          <Camera className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline text-xs font-semibold">Snap</span>
        </button>
      </div>
    </div>
  );
}
