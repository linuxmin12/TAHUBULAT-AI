import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  RotateCcw, 
  Download, 
  Cpu, 
  Flame, 
  Zap, 
  Layers, 
  AlertCircle,
  Clock,
  HardDrive,
  Info,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { 
  StepMode, 
  ExecutionProvider, 
  RamProfile, 
  ThermalState, 
  GenerationResult,
  DeviceModelId 
} from '../types';
import { DEVICE_SPECIFICATIONS } from '../data/devices';

interface GeneratorTabProps {
  deviceModel: DeviceModelId;
  ramProfile: RamProfile;
  thermalState: ThermalState;
  onNavigateToModels: () => void;
}

const PROMPT_SUGGESTIONS = [
  'Gerobak tahu bulat penggorengan panas berasap di pinggir jalan malam hari',
  'Pemandangan Gunung Bromo saat fajar berkabut estetik foto sinematik',
  'Kucing oranye cyberpunk memakai kacamata neon di gang Jakarta',
  'Motif batik mega mendung dengan aksen emas futuristik bersinar',
  'Mobil balap listrik futuristik melaju di jalanan basah hujan lebat'
];

export const GeneratorTab: React.FC<GeneratorTabProps> = ({
  deviceModel,
  ramProfile,
  thermalState,
  onNavigateToModels,
}) => {
  const isX6837 = deviceModel === 'X6837';
  const currentSpec = DEVICE_SPECIFICATIONS[deviceModel];

  const [prompt, setPrompt] = useState('Pemandangan Gunung Bromo saat fajar berkabut estetik foto sinematik');
  const [stepMode, setStepMode] = useState<StepMode>('AUTO');
  const [customSteps, setCustomSteps] = useState(isX6837 ? 6 : 6);
  const [executionProvider, setExecutionProvider] = useState<ExecutionProvider>(
    isX6837 ? 'XNNPACK' : 'NNAPI'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepProgress, setCurrentStepProgress] = useState(0);
  const [totalStepsToRun, setTotalStepsToRun] = useState(6);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync default provider when device changes
  useEffect(() => {
    if (isX6837 && executionProvider === 'NNAPI') {
      setExecutionProvider('XNNPACK');
    } else if (!isX6837 && executionProvider === 'XNNPACK') {
      setExecutionProvider('NNAPI');
    }
  }, [deviceModel]);

  // Compute allowed steps according to Device Profile
  const computeSteps = (): number => {
    let base = 4;
    if (isX6837) {
      if (ramProfile === '12GB') {
        base = stepMode === 'FAST' ? 4 : stepMode === 'QUALITY' ? 8 : 6;
      } else {
        base = stepMode === 'FAST' ? 4 : stepMode === 'QUALITY' ? 6 : 4;
      }
      if (stepMode === 'CUSTOM') {
        base = Math.min(customSteps, ramProfile === '12GB' ? 8 : 6);
      }
    } else {
      if (ramProfile === '6GB') {
        base = stepMode === 'FAST' ? 4 : stepMode === 'QUALITY' ? 6 : 4;
      } else {
        base = stepMode === 'FAST' ? 4 : stepMode === 'QUALITY' ? 8 : 6;
      }
      if (stepMode === 'CUSTOM') {
        base = Math.min(customSteps, ramProfile === '6GB' ? 6 : 8);
      }
    }

    if (thermalState === 'MODERATE') base = Math.min(base, 6);
    if (thermalState === 'SEVERE') base = Math.min(base, 4);
    return base;
  };

  const effectiveSteps = computeSteps();
  const isBlocked = thermalState === 'CRITICAL';
  const memoryCeilingMb = currentSpec.memoryCeilings[ramProfile] || (isX6837 ? 2600 : 2200);

  const handleGenerate = async () => {
    if (!prompt.trim() || isBlocked || isGenerating) return;

    setErrorMsg(null);
    setIsGenerating(true);
    setCurrentStepProgress(0);
    setTotalStepsToRun(effectiveSteps);

    const stepInterval = setInterval(() => {
      setCurrentStepProgress((prev) => {
        if (prev < effectiveSteps) {
          return prev + 1;
        }
        return prev;
      });
    }, 180);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          deviceModel,
          stepMode,
          customSteps: effectiveSteps,
          executionProvider,
          ramProfile,
          thermalState,
        }),
      });

      clearInterval(stepInterval);
      setCurrentStepProgress(effectiveSteps);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || 'Generasi gagal');
      }

      const data: GenerationResult = await response.json();
      setResult(data);
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMsg(err.message || 'Gagal menghubungi server generator.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!result?.imageUrl) return;
    const a = document.createElement('a');
    a.href = result.imageUrl;
    a.download = `tahubulat-256x256-${deviceModel}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      
      {/* Top Banner: Device Policy Active */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span>{currentSpec.name} ({currentSpec.id}) Adaptive Policy</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-mono">
                {isX6837 ? 'Helio G99' : 'Dimensity 7100'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Limit RAM: {memoryCeilingMb} MB • INT8 QDQ (256×256)
            </div>
          </div>
        </div>

        {/* Step Indicator Badge */}
        <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <span className="text-slate-400">Target Steps:</span>
          <span className={`font-bold ${isBlocked ? 'text-red-400' : 'text-amber-400'}`}>
            {isBlocked ? 'DIBLOKIR' : `${effectiveSteps} Langkah`}
          </span>
        </div>
      </div>

      {/* Critical Thermal Warning Banner */}
      {isBlocked && (
        <div className="bg-red-950/50 border border-red-800/80 rounded-xl p-3 flex items-start space-x-2.5 text-red-200 text-xs animate-pulse">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-300">Generasi Diblokir (Suhu Kritis {isX6837 ? '49°C+' : '48°C+'})</p>
            <p className="text-red-300/80 mt-0.5 font-sans">
              Governor hardware {currentSpec.name} mematikan inferensi AI untuk melindungi baterai 5000 mAh dan thermal SoC {isX6837 ? 'Helio G99' : 'Dimensity 7100'}. Turunkan suhu di header untuk melanjutkan.
            </p>
          </div>
        </div>
      )}

      {/* Prompt Input Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <label className="font-medium text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Prompt Input (Text-to-Image)
          </label>
          <span className="text-slate-500 font-mono text-[11px]">
            Hashed BoW 384-dim
          </span>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="Masukkan prompt deskripsi gambar..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none font-sans"
          />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
            <span>Contoh Prompt:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(item)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-left truncate max-w-full"
              >
                {item.slice(0, 38)}...
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Execution Controls (Step Mode & Provider) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        
        {/* Step Mode Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Langkah DDIM
            </span>
            <span className="text-[11px] text-amber-400/90 font-mono">
              {stepMode === 'AUTO' ? `AUTO (${effectiveSteps} langkah)` : `${effectiveSteps} langkah`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {(['AUTO', 'FAST', 'QUALITY', 'CUSTOM'] as StepMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setStepMode(mode)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold font-mono transition-colors ${
                  stepMode === mode
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 leading-tight font-sans">
            {stepMode === 'AUTO' && (
              isX6837 
                ? `Otomatis Helio G99 (${ramProfile === '12GB' ? '6' : '4'} langkah standar untuk stabilitas).`
                : `Otomatis Dimensity 7100 (${ramProfile === '8GB' ? '6' : '4'} langkah).`
            )}
            {stepMode === 'FAST' && 'Cepat 4 langkah, inferensi ultra-ringan (~480-560ms).'}
            {stepMode === 'QUALITY' && (
              isX6837
                ? `Kualitas tinggi (${ramProfile === '12GB' ? '8 langkah di 12GB' : '6 langkah maks di 8GB'}).`
                : `Kualitas tinggi (${ramProfile === '8GB' ? '8 langkah di 8GB' : '6 langkah di 6GB'}).`
            )}
            {stepMode === 'CUSTOM' && (
              <div className="pt-1 flex items-center gap-2">
                <input
                  type="range"
                  min="2"
                  max={(isX6837 ? ramProfile === '12GB' : ramProfile === '8GB') ? 8 : 6}
                  value={customSteps}
                  onChange={(e) => setCustomSteps(Number(e.target.value))}
                  className="flex-1 accent-amber-500 h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="font-mono text-xs text-amber-400 font-bold">{customSteps}</span>
              </div>
            )}
          </div>
        </div>

        {/* Execution Provider (NNAPI / XNNPACK / CPU) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              Backend Provider (ONNX)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {executionProvider === 'XNNPACK' ? 'ARM NEON 6nm' : executionProvider === 'NNAPI' ? 'Akselerasi NPU' : 'CPU Standar'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(['XNNPACK', 'NNAPI', 'CPU'] as ExecutionProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => setExecutionProvider(p)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold font-mono transition-colors ${
                  executionProvider === p
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 leading-tight font-sans">
            {executionProvider === 'XNNPACK' && (
              isX6837 
                ? '⭐ Direkomendasikan untuk Helio G99 (2x Cortex-A76 NEON Vector).'
                : 'Optimasi CPU multi-threaded ARM NEON.'
            )}
            {executionProvider === 'NNAPI' && (
              isX6837
                ? 'NNAPI Android 13 fallback driver.'
                : '⭐ Direkomendasikan untuk Dimensity 7100 NPU APU 550.'
            )}
            {executionProvider === 'CPU' && 'Standard floating point fallback (tanpa akselerasi hardware).'}
          </p>
        </div>

      </div>

      {/* Generate Action Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || isBlocked || !prompt.trim()}
        className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all ${
          isBlocked
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            : isGenerating
            ? 'bg-amber-600 text-slate-950 cursor-wait animate-pulse'
            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20 active:scale-[0.99]'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            <span>Mengenerate pada {currentSpec.name} ({currentStepProgress}/{totalStepsToRun} steps)...</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Generate Gambar 256×256 ({effectiveSteps} Steps INT8)</span>
          </>
        )}
      </button>

      {/* Error Notice */}
      {errorMsg && (
        <div className="bg-red-950/60 border border-red-800 p-3 rounded-xl text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Output & Telemetry View */}
      {result && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                HASIL INFERENSI ON-DEVICE ({result.deviceModel || deviceModel})
              </span>
              <h3 className="text-sm font-bold text-slate-100">
                Latent Diffusion 256×256 (INT8 Static QDQ)
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={downloadImage}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan Gambar</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* 256x256 Render Box */}
            <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <div className="relative rounded-lg overflow-hidden border border-slate-700 shadow-md">
                <img
                  src={result.imageUrl}
                  alt={result.prompt}
                  className="w-[256px] h-[256px] object-cover"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                256×256 RGB ARGB_8888 • {result.stepsExecuted} Steps DDIM
              </p>
            </div>

            {/* Hardware Telemetry Card */}
            <div className="space-y-2.5 font-mono text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-amber-400" /> Perangkat:
                  </span>
                  <span className="font-bold text-slate-200">
                    {result.deviceName || currentSpec.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> Total Durasi:
                  </span>
                  <span className="font-bold text-amber-400">{result.totalDurationMs} ms</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-amber-400" /> Provider Digunakan:
                  </span>
                  <span className="text-slate-200">{result.executionProviderUsed}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-amber-400" /> Puncak Memori RSS:
                  </span>
                  <span className="text-emerald-400 font-bold">{result.peakRssMb} MB (Budget {memoryCeilingMb} MB)</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Bobot Model:
                  </span>
                  <span className="text-slate-200">~290 MiB (INT8)</span>
                </div>
              </div>

              {/* Enhanced Prompt Note */}
              {result.enhancedPrompt && result.enhancedPrompt !== result.prompt && (
                <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-sans">
                  <span className="text-amber-400 font-mono font-semibold">Gemini Prompt Expansion: </span>
                  "{result.enhancedPrompt}"
                </div>
              )}

              <p className="text-[10px] text-slate-500 font-sans leading-tight">
                *Memori tetap stabil di bawah batas keamanan sistem {memoryCeilingMb} MB untuk mencegah LowMemoryKiller (LMK) Android.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
