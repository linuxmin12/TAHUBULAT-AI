import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  FileCode, 
  Terminal, 
  Cpu, 
  Copy, 
  Check, 
  FolderArchive,
  Layers,
  Sparkles
} from 'lucide-react';
import { ANDROID_PROJECT_FILES } from '../templates/androidProject';

interface ApkBuilderTabProps {
  onInstallPwa: () => void;
  canInstallPwa: boolean;
}

export const ApkBuilderTab: React.FC<ApkBuilderTabProps> = ({
  onInstallPwa,
  canInstallPwa,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const selectedFile = ANDROID_PROJECT_FILES[selectedFileIndex] || ANDROID_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadProjectZip = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export-apk-project');
      if (!response.ok) throw new Error('Gagal mengekspor file zip proyek');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TahubulatAI-Infinix-APK-Project.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh ZIP proyek APK. Silakan periksa koneksi.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      
      {/* Executive Summary: Document Analysis */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-5 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
              HASIL ANALISIS DOKUMEN & SPESIFIKASI APK MULTI-DEVICE
            </span>
            <h2 className="text-lg font-extrabold text-slate-100">
              TAHUBULAT AI v1.2 — Native APK Infinix Dual-Profile
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Berdasarkan dokumen teknis MiniGen v0.9–v1.0 & TAHUBULAT AI v1.2, arsitektur aplikasi kini mendukung penuh:
              <br />
              1. <strong>Infinix Hot 40 Pro (X6837)</strong>: Helio G99 (6nm), Mali-G57 MC2, 8GB/12GB RAM, Android 13/XOS 13.5 (Akselerasi <strong>XNNPACK ARM NEON</strong>).
              <br />
              2. <strong>Infinix Hot 70 Pro 5G (X6896)</strong>: Dimensity 7100 (4nm), Mali-G610, 6GB/8GB RAM, Android 16/XOS 16 (Akselerasi <strong>NNAPI APU 550</strong>).
            </p>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <button
              onClick={handleDownloadProjectZip}
              disabled={isExporting}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 text-xs transition-transform active:scale-95 cursor-pointer"
            >
              <FolderArchive className="w-4 h-4" />
              <span>{isExporting ? 'Mengekstrak ZIP...' : 'Download Proyek APK (.ZIP)'}</span>
            </button>

            <button
              onClick={onInstallPwa}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl border border-amber-500/30 flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Pasang Langsung ke HP (PWA/WebAPK)</span>
            </button>
          </div>
        </div>

        {/* Readiness Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-400">SOURCE_READY</div>
              <div className="text-xs font-bold text-slate-200">✅ 100% Kotlin + ONNX</div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-400">TARGET OS</div>
              <div className="text-xs font-bold text-amber-400">Android 13 & 16 (API 33-36)</div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <div className="text-[10px] font-mono text-slate-400">DUAL HARDWARE PROFILE</div>
              <div className="text-xs font-bold text-slate-200">X6837 & X6896</div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Inspector & Project Tree */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              Penjelajah Kode Sumber Proyek Android
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {selectedFile.description}
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className="self-start sm:self-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copied ? 'Tersalin!' : 'Salin File'}</span>
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {ANDROID_PROJECT_FILES.map((file, idx) => (
            <button
              key={file.path}
              onClick={() => setSelectedFileIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedFileIndex === idx
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>{file.path.split('/').pop()}</span>
            </button>
          ))}
        </div>

        {/* Code Viewer */}
        <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{selectedFile.path}</span>
            <span>{selectedFile.content.split('\n').length} baris</span>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[380px] leading-relaxed no-scrollbar">
            <code>{selectedFile.content}</code>
          </pre>
        </div>
      </div>

      {/* Step-by-Step APK Build Guide (in Indonesian) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          Panduan Langkah Build Menjadi File APK (Siap Pasang)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Option 1: Android Studio */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">1</span>
              <span>Kompilasi via Android Studio (GUI)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li>Klik tombol <strong>Download Proyek APK (.ZIP)</strong> di atas.</li>
              <li>Ekstrak file ZIP di komputer/laptop Anda.</li>
              <li>Buka <strong>Android Studio Ladybug+</strong>, pilih <strong>Open</strong> dan pilih folder yang diekstrak.</li>
              <li>Tunggu hingga <strong>Gradle Sync</strong> selesai (mengunduh dependensi ONNX Runtime 1.18+).</li>
              <li>Buka menu <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.</li>
              <li>File APK siap dipasang berada di:
                <div className="bg-slate-900 p-1.5 mt-1 rounded font-mono text-[10px] text-amber-300 break-all">
                  app/build/outputs/apk/debug/app-debug.apk
                </div>
              </li>
            </ol>
          </div>

          {/* Option 2: Command-line Gradle */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">2</span>
              <span>Kompilasi via Command Line / Terminal</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Jalankan perintah ini di dalam root folder proyek:
            </p>
            <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-amber-300 space-y-1">
              <div># Build APK Debug</div>
              <div className="text-emerald-400 font-bold">./gradlew assembleDebug</div>
              <div className="pt-1"># Build APK Release (Teroptimasi R8)</div>
              <div className="text-emerald-400 font-bold">./gradlew assembleRelease</div>
            </div>
            <p className="text-[11px] text-slate-400">
              Untuk menginstall langsung ke HP Infinix melalui kabel USB:
            </p>
            <div className="bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-slate-200">
              adb install -r app/build/outputs/apk/debug/app-debug.apk
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
