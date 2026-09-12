import React from 'react';
import { 
  Cpu, 
  Flame, 
  HardDrive, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Lock, 
  Layers,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Camera,
  BatteryCharging,
  Volume2,
  Wifi,
  Radio,
  BarChart3
} from 'lucide-react';
import { RamProfile, ThermalState, DeviceModelId } from '../types';
import { DEVICE_SPECIFICATIONS } from '../data/devices';

interface HardwarePolicyTabProps {
  deviceModel: DeviceModelId;
  setDeviceModel: (model: DeviceModelId) => void;
  ramProfile: RamProfile;
  thermalState: ThermalState;
  setRamProfile: (ram: RamProfile) => void;
  setThermalState: (state: ThermalState) => void;
}

export const HardwarePolicyTab: React.FC<HardwarePolicyTabProps> = ({
  deviceModel,
  setDeviceModel,
  ramProfile,
  thermalState,
  setRamProfile,
  setThermalState,
}) => {
  const currentSpec = DEVICE_SPECIFICATIONS[deviceModel];
  const isX6837 = deviceModel === 'X6837';

  return (
    <div className="p-4 space-y-5 max-w-5xl mx-auto">
      
      {/* Device Selector Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
              MULTI-DEVICE ARCHITECTURE
            </span>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              Profil Perangkat & Governor TAHUBULAT AI
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Pilih profil perangkat untuk melihat spesifikasi lengkap, kebijakan memori, dan kalibrasi thermal.
            </p>
          </div>

          {/* Model Switch Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => {
                setDeviceModel('X6837');
                if (ramProfile === '6GB') setRamProfile('8GB');
              }}
              className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                isX6837
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Infinix Hot 40 Pro (X6837)</span>
            </button>
            <button
              onClick={() => {
                setDeviceModel('X6896');
                if (ramProfile === '12GB') setRamProfile('8GB');
              }}
              className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                !isX6837
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Infinix Hot 70 Pro 5G (X6896)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target Device Active Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">
                {currentSpec.name} ({currentSpec.id})
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                {currentSpec.network.includes('5G') ? '5G SA/NSA' : '4G LTE'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-semibold">
                {currentSpec.os}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Rilis: {currentSpec.releaseDate} • Dimensi: {currentSpec.dimensions} ({currentSpec.weight})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-lg">
              {isX6837 ? 'XNNPACK NEON Accelerated' : 'NNAPI APU 550 Accelerated'}
            </span>
          </div>
        </div>

        {/* 4 Highlights Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-amber-400" /> CHIPSET / SOC
            </span>
            <p className="text-xs font-bold text-slate-200">{currentSpec.chipset}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{currentSpec.cpu}</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" /> GPU & GRAFIS
            </span>
            <p className="text-xs font-bold text-slate-200">{currentSpec.gpu}</p>
            <p className="text-[10px] text-slate-400">
              {isX6837 ? 'Dual Core 950MHz' : 'Quad Core Valhall'}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-amber-400" /> MEMORI & STORAGE
            </span>
            <p className="text-xs font-bold text-slate-200">
              {currentSpec.ramOptions.join(' / ')} RAM
            </p>
            <p className="text-[10px] text-slate-400">{currentSpec.storageType}</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" /> BENCHMARK
            </span>
            <p className="text-xs font-bold text-amber-400">AnTuTu {currentSpec.benchmarks.antutu}</p>
            <p className="text-[10px] text-slate-400">GeekBench: {currentSpec.benchmarks.geekbench}</p>
          </div>
        </div>

        {/* Detailed Hardware Specs Accordion / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 font-sans">
              <Smartphone className="w-3.5 h-3.5 text-blue-400" /> Layar & Tampilan
            </span>
            <p className="text-slate-300 font-sans text-xs">{currentSpec.display}</p>
            <p className="text-[10px] text-slate-500 font-sans">{currentSpec.build}</p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 font-sans">
              <Camera className="w-3.5 h-3.5 text-rose-400" /> Kamera & Sensor
            </span>
            <p className="text-slate-300 font-sans text-xs">{currentSpec.camera}</p>
            <p className="text-[10px] text-slate-500 font-sans">Video 1440p@30fps, 1080p@30fps</p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 font-sans">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> Baterai & Daya
            </span>
            <p className="text-slate-300 font-sans text-xs">{currentSpec.battery}</p>
            <p className="text-[10px] text-slate-500 font-sans">{currentSpec.charging}</p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 font-sans">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" /> Audio & Akustik
            </span>
            <p className="text-slate-300 font-sans text-xs">{currentSpec.audio}</p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 font-sans">
              <Wifi className="w-3.5 h-3.5 text-teal-400" /> Konektivitas
            </span>
            <p className="text-slate-300 font-sans text-xs">
              {isX6837 
                ? 'Wi-Fi 802.11 a/b/g/n/ac dual-band, BT, NFC, FM Radio, USB-C OTG' 
                : 'Wi-Fi 6 (ax), Bluetooth 5.4, Dual-Band GPS, NFC, USB-C OTG'}
            </p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Sensor Keamanan
            </span>
            <p className="text-slate-300 font-sans text-xs">
              Fingerprint side-mounted, Accelerometer, Gyro hardware, Proximity, Compass
            </p>
          </div>
        </div>
      </div>

      {/* RAM & Policy Governor Table for Selected Device */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-400" />
            Kebijakan Runtime Memori & Alokasi Steps ({deviceModel})
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            configs/device-infinix-{deviceModel.toLowerCase()}.json
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Varian RAM</th>
                <th className="py-2.5 px-3">Mode AUTO</th>
                <th className="py-2.5 px-3">Mode FAST</th>
                <th className="py-2.5 px-3">Mode QUALITY</th>
                <th className="py-2.5 px-3">Plafon Memori App</th>
                <th className="py-2.5 px-3">Status Saat Ini</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isX6837 ? (
                <>
                  <tr className={ramProfile === '8GB' ? 'bg-amber-500/10 text-amber-300 font-bold' : 'text-slate-300'}>
                    <td className="py-3 px-3">8 GB LPDDR4X (UFS 2.2)</td>
                    <td className="py-3 px-3">4 steps</td>
                    <td className="py-3 px-3">4 steps</td>
                    <td className="py-3 px-3">Maks 6 steps</td>
                    <td className="py-3 px-3">2,600 MB</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setRamProfile('8GB')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                          ramProfile === '8GB' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {ramProfile === '8GB' ? 'AKTIF' : 'Pilih'}
                      </button>
                    </td>
                  </tr>
                  <tr className={ramProfile === '12GB' ? 'bg-amber-500/10 text-amber-300 font-bold' : 'text-slate-300'}>
                    <td className="py-3 px-3">12 GB LPDDR4X (UFS 2.2)</td>
                    <td className="py-3 px-3">6 steps</td>
                    <td className="py-3 px-3">4 steps</td>
                    <td className="py-3 px-3">8 steps (Penuh)</td>
                    <td className="py-3 px-3">3,600 MB</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setRamProfile('12GB')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                          ramProfile === '12GB' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {ramProfile === '12GB' ? 'AKTIF' : 'Pilih'}
                      </button>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr className={ramProfile === '6GB' ? 'bg-amber-500/10 text-amber-300 font-bold' : 'text-slate-300'}>
                    <td className="py-3 px-3">6 GB LPDDR5</td>
                    <td className="py-3 px-3">4 steps</td>
                    <td className="py-3 px-3">4 steps</td>
                    <td className="py-3 px-3">Maks 6 steps</td>
                    <td className="py-3 px-3">2,200 MB</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setRamProfile('6GB')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                          ramProfile === '6GB' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {ramProfile === '6GB' ? 'AKTIF' : 'Pilih'}
                      </button>
                    </td>
                  </tr>
                  <tr className={ramProfile === '8GB' ? 'bg-amber-500/10 text-amber-300 font-bold' : 'text-slate-300'}>
                    <td className="py-3 px-3">8 GB LPDDR5</td>
                    <td className="py-3 px-3">6 steps</td>
                    <td className="py-3 px-3">4 steps</td>
                    <td className="py-3 px-3">8 steps</td>
                    <td className="py-3 px-3">3,000 MB</td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setRamProfile('8GB')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                          ramProfile === '8GB' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {ramProfile === '8GB' ? 'AKTIF' : 'Pilih'}
                      </button>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          {isX6837 ? (
            <>
              💡 <strong>Rekomendasi untuk Infinix Hot 40 Pro (Helio G99):</strong> Model kuantisasi INT8 (~290 MiB) berjalan dengan sangat lancar pada 2 core performa Cortex-A76 @ 2.2 GHz menggunakan backend <strong>XNNPACK (ARM NEON)</strong>. Varian 12GB memungkinkan cache tensor aktivasi hingga 3,6 GiB tanpa resiko reload proses di latar belakang.
            </>
          ) : (
            <>
              💡 <strong>Rekomendasi untuk Infinix Hot 70 Pro 5G (Dimensity 7100):</strong> Menggunakan backend <strong>NNAPI</strong> untuk memanfaatkan hardware APU 550 NPU secara langsung, menghasilkan inferensi ~140ms per step.
            </>
          )}
        </p>
      </div>

      {/* Thermal Management Policy */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          Governor Manajemen Suhu SoC {isX6837 ? 'Helio G99 (6nm)' : 'Dimensity 7100 (4nm)'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs font-mono">
          <div
            onClick={() => setThermalState('NOMINAL')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              thermalState === 'NOMINAL'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>NOMINAL</span>
              <span className="text-[10px]">{isX6837 ? '37°C' : '36°C'}</span>
            </div>
            <p className="text-[11px] mt-1 font-sans">Langkah penuh (4/6/8 steps)</p>
          </div>

          <div
            onClick={() => setThermalState('MODERATE')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              thermalState === 'MODERATE'
                ? 'bg-amber-950/60 border-amber-500 text-amber-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>MODERATE</span>
              <span className="text-[10px]">{isX6837 ? '42°C' : '41°C'}</span>
            </div>
            <p className="text-[11px] mt-1 font-sans">Diturunkan maks 6 steps</p>
          </div>

          <div
            onClick={() => setThermalState('SEVERE')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              thermalState === 'SEVERE'
                ? 'bg-orange-950/60 border-orange-500 text-orange-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>SEVERE</span>
              <span className="text-[10px]">{isX6837 ? '46°C' : '45°C'}</span>
            </div>
            <p className="text-[11px] mt-1 font-sans">Diturunkan ke 4 steps</p>
          </div>

          <div
            onClick={() => setThermalState('CRITICAL')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              thermalState === 'CRITICAL'
                ? 'bg-red-950/80 border-red-500 text-red-200 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>CRITICAL</span>
              <span className="text-[10px]">{isX6837 ? '49°C+' : '48°C+'}</span>
            </div>
            <p className="text-[11px] mt-1 text-red-400 font-bold font-sans">Generasi DIBLOKIR</p>
          </div>
        </div>
      </div>

      {/* SatuAkses Gateway & Fallback Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400" />
          SatuAkses Gateway & Kebijakan Fallback
        </h3>

        <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
          <p>
            Berdasarkan spesifikasi v0.5–v1.2, TAHUBULAT AI mengadopsi arsitektur <strong>Gateway-First &rarr; Local MiniGen Fallback</strong>:
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
            <div>• Gateway Kegagalan Jaringan &rarr; <strong>Otomatis beralih ke Lokal ONNX INT8</strong></div>
            <div>• Gateway HTTP 402 (Saldo Habis) &rarr; <strong>Otomatis beralih ke Lokal ONNX INT8</strong></div>
            <div>• Gateway HTTP 429 / 5xx &rarr; <strong>Otomatis beralih ke Lokal ONNX INT8</strong></div>
            <div>• Token Gateway disimpan terenkripsi menggunakan <strong>Android Keystore AES/GCM</strong> (tidak ada API key dalam source code).</div>
          </div>
        </div>
      </div>

    </div>
  );
};
