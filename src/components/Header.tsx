import React from 'react';
import { 
  Smartphone, 
  Maximize2, 
  Cpu, 
  Flame, 
  Download,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { RamProfile, ThermalState, DeviceModelId } from '../types';

interface HeaderProps {
  activeTab: 'generator' | 'models' | 'apk' | 'hardware';
  setActiveTab: (tab: 'generator' | 'models' | 'apk' | 'hardware') => void;
  isPhoneView: boolean;
  setIsPhoneView: (val: boolean) => void;
  deviceModel: DeviceModelId;
  setDeviceModel: (val: DeviceModelId) => void;
  ramProfile: RamProfile;
  setRamProfile: (val: RamProfile) => void;
  thermalState: ThermalState;
  setThermalState: (val: ThermalState) => void;
  onInstallPwa: () => void;
  canInstallPwa: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isPhoneView,
  setIsPhoneView,
  deviceModel,
  setDeviceModel,
  ramProfile,
  setRamProfile,
  thermalState,
  setThermalState,
  onInstallPwa,
  canInstallPwa,
}) => {
  const isX6837 = deviceModel === 'X6837';

  const handleDeviceChange = (newDevice: DeviceModelId) => {
    setDeviceModel(newDevice);
    if (newDevice === 'X6837' && ramProfile === '6GB') {
      setRamProfile('8GB');
    } else if (newDevice === 'X6896' && ramProfile === '12GB') {
      setRamProfile('8GB');
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Brand & Target Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="text-amber-400 font-black text-lg tracking-wider">TB</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-slate-100 tracking-tight">
                    TAHUBULAT AI
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-medium">
                    v1.2 APK
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  {isX6837 ? 'Infinix Hot 40 Pro (X6837) • Helio G99' : 'Infinix Hot 70 Pro 5G (X6896) • Dimensity 7100'}
                </p>
              </div>
            </div>

            {/* Mobile View Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsPhoneView(!isPhoneView)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1"
                title={isPhoneView ? "Tampilan Penuh" : "Tampilan HP"}
              >
                {isPhoneView ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Hardware Controls & Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Device Switcher */}
            <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
              <span className="px-2 py-0.5 text-slate-400 flex items-center gap-1 font-mono">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" /> Target:
              </span>
              <button
                onClick={() => handleDeviceChange('X6837')}
                className={`px-2.5 py-1 rounded font-mono font-semibold transition-all flex items-center gap-1 ${
                  isX6837
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Infinix Hot 40 Pro (MediaTek Helio G99 / 8GB-12GB)"
              >
                <span>X6837 (Hot 40 Pro)</span>
                {isX6837 && <span className="text-[9px] bg-slate-950/20 px-1 rounded">4G</span>}
              </button>
              <button
                onClick={() => handleDeviceChange('X6896')}
                className={`px-2.5 py-1 rounded font-mono font-semibold transition-all flex items-center gap-1 ${
                  !isX6837
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Infinix Hot 70 Pro 5G (Dimensity 7100 / 6GB-8GB)"
              >
                <span>X6896 (Hot 70 Pro)</span>
                {!isX6837 && <span className="text-[9px] bg-slate-950/20 px-1 rounded">5G</span>}
              </button>
            </div>

            {/* RAM Profile selector (Dynamic per Device) */}
            <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
              <span className="px-2 py-0.5 text-slate-400 flex items-center gap-1 font-mono">
                <Cpu className="w-3.5 h-3.5 text-amber-400" /> RAM:
              </span>
              
              {isX6837 ? (
                <>
                  <button
                    onClick={() => setRamProfile('8GB')}
                    className={`px-2 py-1 rounded font-mono font-semibold transition-all ${
                      ramProfile === '8GB'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    8 GB
                  </button>
                  <button
                    onClick={() => setRamProfile('12GB')}
                    className={`px-2 py-1 rounded font-mono font-semibold transition-all ${
                      ramProfile === '12GB'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    12 GB
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setRamProfile('6GB')}
                    className={`px-2 py-1 rounded font-mono font-semibold transition-all ${
                      ramProfile === '6GB'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    6 GB
                  </button>
                  <button
                    onClick={() => setRamProfile('8GB')}
                    className={`px-2 py-1 rounded font-mono font-semibold transition-all ${
                      ramProfile === '8GB'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    8 GB
                  </button>
                </>
              )}
            </div>

            {/* Thermal Status Selector */}
            <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
              <span className="px-2 py-0.5 text-slate-400 flex items-center gap-1 font-mono">
                <Flame className={`w-3.5 h-3.5 ${
                  thermalState === 'CRITICAL' ? 'text-red-500 animate-bounce' :
                  thermalState === 'SEVERE' ? 'text-orange-500' :
                  thermalState === 'MODERATE' ? 'text-amber-500' : 'text-emerald-400'
                }`} /> Suhu:
              </span>
              <select
                value={thermalState}
                onChange={(e) => setThermalState(e.target.value as ThermalState)}
                className="bg-transparent text-slate-200 border-none outline-none font-mono text-xs cursor-pointer pr-1"
              >
                <option value="NOMINAL" className="bg-slate-900 text-emerald-400">Nominal (36-37°C)</option>
                <option value="MODERATE" className="bg-slate-900 text-amber-400">Moderate (41-42°C)</option>
                <option value="SEVERE" className="bg-slate-900 text-orange-400">Severe (45-46°C)</option>
                <option value="CRITICAL" className="bg-slate-900 text-red-400">Critical (48°C+)</option>
              </select>
            </div>

            {/* Desktop View Mode Toggle */}
            <button
              onClick={() => setIsPhoneView(!isPhoneView)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              {isPhoneView ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Mode Penuh</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Frame HP {isX6837 ? 'X6837' : 'X6896'}</span>
                </>
              )}
            </button>

            {/* Install APK / PWA button */}
            <button
              onClick={onInstallPwa}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang APK / PWA</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'generator'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>⚡ Generator Studio (INT8)</span>
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'models'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>📦 Perpustakaan Model v1.2</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>📱 Jadikan APK & Source Code</span>
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'hardware'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>📊 Profil Hardware ({deviceModel})</span>
          </button>
        </div>

      </div>
    </header>
  );
};
