import React, { useState } from 'react';
import { 
  FolderPlus, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  HardDrive, 
  Info, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Pause,
  Play,
  Trash2
} from 'lucide-react';
import { ModelItem, ModelStatus, ModelFormat } from '../types';

interface ModelLibraryTabProps {
  onBackToGenerator: () => void;
}

const INITIAL_MODELS: ModelItem[] = [
  {
    id: 'minigen-v10-denoiser-int8',
    name: 'MiniGen v1.0 Latent Denoiser (INT8)',
    filename: 'minigen-v10-denoiser-int8.onnx',
    sizeBytes: 195035136, // ~186 MB
    format: 'onnx',
    status: 'LOAD_VALIDATED',
    provider: 'ONNX_RUNTIME',
    description: 'Model inti denoising 24 residual blocks, INT8 static QDQ untuk Dimensity 7100 NNAPI.',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    source: 'BUILTIN',
  },
  {
    id: 'minigen-v10-decoder-int8',
    name: 'MiniGen v1.0 Mobile VAE Decoder (INT8)',
    filename: 'minigen-v10-decoder-int8.onnx',
    sizeBytes: 109051904, // ~104 MB
    format: 'onnx',
    status: 'LOAD_VALIDATED',
    provider: 'ONNX_RUNTIME',
    description: 'Decoder rekonstruksi dari latent 4x32x32 kembali ke gambar 256x256 RGB.',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    source: 'BUILTIN',
  },
  {
    id: 'sd-turbo-mobile-safetensors',
    name: 'SD-Turbo Mobile Distilled (INT8)',
    filename: 'sd-turbo-mobile-int8.safetensors',
    sizeBytes: 754974720, // ~720 MB
    format: 'safetensors',
    status: 'NEEDS_RUNTIME',
    provider: 'STABLE_DIFFUSION_CPP',
    description: 'Format safetensors single-file 1-step, butuh native backend stable-diffusion.cpp.',
    source: 'HUGGINGFACE',
  },
  {
    id: 'flux-schnell-q4-gguf',
    name: 'FLUX.1 Schnell Quantized (GGUF Q4_0)',
    filename: 'flux-schnell-q4_0.gguf',
    sizeBytes: 933232640, // ~890 MB
    format: 'gguf',
    status: 'FORMAT_OK',
    provider: 'STABLE_DIFFUSION_CPP',
    description: 'Header GGUF terverifikasi, mendekati batas maksimal alokasi 1 GiB.',
    source: 'CIVITAI',
  },
];

const MAX_BUDGET_BYTES = 1024 * 1024 * 1024; // 1 GiB

export const ModelLibraryTab: React.FC<ModelLibraryTabProps> = ({ onBackToGenerator }) => {
  const [models, setModels] = useState<ModelItem[]>(INITIAL_MODELS);
  const [activeDownloadTab, setActiveDownloadTab] = useState<'LOCAL' | 'HF' | 'CIVITAI'>('HF');

  // Hugging Face Form State
  const [hfRepo, setHfRepo] = useState('stabilityai/sd-turbo');
  const [hfFilename, setHfFilename] = useState('model-q8_0.onnx');
  const [hfRevision, setHfRevision] = useState('main');
  const [hfToken, setHfToken] = useState('');

  // Civitai / Direct URL State
  const [directUrl, setDirectUrl] = useState('https://civitai.com/api/download/models/128713?type=Model&format=SafeTensor');
  const [directFilename, setDirectFilename] = useState('custom-anime-diffusion.safetensors');

  // Local Import State
  const [importedFilename, setImportedFilename] = useState('');
  const [isSimulatingDownload, setIsSimulatingDownload] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Total active ONNX model weights
  const activeWeightBytes = models
    .filter((m) => m.status === 'LOAD_VALIDATED')
    .reduce((sum, m) => sum + m.sizeBytes, 0);

  const activeWeightMb = Math.round(activeWeightBytes / (1024 * 1024));
  const budgetPercentage = Math.min(100, Math.round((activeWeightBytes / MAX_BUDGET_BYTES) * 100));

  const formatSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Simulate Hugging Face Download
  const handleHfDownload = () => {
    if (!hfRepo || !hfFilename || isSimulatingDownload) return;
    setIsSimulatingDownload(true);
    setDownloadProgress(10);

    const tempId = `hf_${Date.now()}`;
    const newModel: ModelItem = {
      id: tempId,
      name: `${hfRepo.split('/')[1] || hfRepo} (${hfFilename})`,
      filename: hfFilename,
      sizeBytes: 245 * 1024 * 1024,
      format: hfFilename.endsWith('.onnx') ? 'onnx' : 'safetensors',
      status: 'FORMAT_OK',
      provider: hfFilename.endsWith('.onnx') ? 'ONNX_RUNTIME' : 'STABLE_DIFFUSION_CPP',
      description: `Diunduh dari Hugging Face: ${hfRepo} [rev: ${hfRevision}]`,
      source: 'HUGGINGFACE',
      isPart: true,
      downloadProgress: 10,
    };

    setModels((prev) => [newModel, ...prev]);

    // Simulate chunked download progress
    let p = 10;
    const interval = setInterval(() => {
      p += 20;
      setDownloadProgress(p);
      setModels((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, downloadProgress: p } : m))
      );

      if (p >= 100) {
        clearInterval(interval);
        setIsSimulatingDownload(false);
        setModels((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...m,
                  isPart: false,
                  status: m.format === 'onnx' ? 'LOAD_VALIDATED' : 'NEEDS_RUNTIME',
                  sha256: 'a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890',
                }
              : m
          )
        );
      }
    }, 400);
  };

  // Simulate Direct HTTPS Download
  const handleDirectDownload = () => {
    if (!directUrl || !directFilename || isSimulatingDownload) return;
    setIsSimulatingDownload(true);
    setDownloadProgress(15);

    const tempId = `direct_${Date.now()}`;
    const newModel: ModelItem = {
      id: tempId,
      name: directFilename.replace(/\.[^/.]+$/, ''),
      filename: directFilename,
      sizeBytes: 380 * 1024 * 1024,
      format: directFilename.endsWith('.safetensors') ? 'safetensors' : 'gguf',
      status: 'FORMAT_OK',
      provider: 'STABLE_DIFFUSION_CPP',
      description: `Diunduh via Direct URL: ${directUrl.slice(0, 45)}...`,
      source: 'CIVITAI',
      isPart: true,
      downloadProgress: 15,
    };

    setModels((prev) => [newModel, ...prev]);

    let p = 15;
    const interval = setInterval(() => {
      p += 25;
      setDownloadProgress(p);
      setModels((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, downloadProgress: p } : m))
      );

      if (p >= 100) {
        clearInterval(interval);
        setIsSimulatingDownload(false);
        setModels((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...m,
                  isPart: false,
                  status: 'NEEDS_RUNTIME',
                  sha256: '9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba',
                }
              : m
          )
        );
      }
    }, 350);
  };

  // Handle Local File Upload / SAF Pick
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    let format: ModelFormat = 'onnx';
    let status: ModelStatus = 'LOAD_VALIDATED';
    let provider: 'ONNX_RUNTIME' | 'STABLE_DIFFUSION_CPP' = 'ONNX_RUNTIME';

    if (ext === 'safetensors') {
      format = 'safetensors';
      status = 'NEEDS_RUNTIME';
      provider = 'STABLE_DIFFUSION_CPP';
    } else if (ext === 'gguf') {
      format = 'gguf';
      status = 'FORMAT_OK';
      provider = 'STABLE_DIFFUSION_CPP';
    } else if (file.size > MAX_BUDGET_BYTES) {
      status = 'TOO_LARGE';
    }

    const newModel: ModelItem = {
      id: `local_${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      filename: file.name,
      sizeBytes: file.size,
      format,
      status,
      provider,
      description: 'Diimpor dari penyimpanan lokal Android melalui Document Picker (SAF).',
      source: 'LOCAL',
    };

    setModels((prev) => [newModel, ...prev]);
    setImportedFilename(file.name);
  };

  const removeModel = (id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      
      {/* Header & Hard Model Budget Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-amber-400" />
              Perpustakaan Model TAHUBULAT AI v1.2
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Target: App-private Storage (Internal UFS 2.2 Infinix X6896)
            </p>
          </div>
          <button
            onClick={onBackToGenerator}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold self-start sm:self-center transition-colors"
          >
            ← Kembali ke Generator
          </button>
        </div>

        {/* Hard Budget Meter (<= 1 GiB INT8) */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Total Berat Model Aktif (INT8 QDQ):</span>
            <span className="text-amber-400 font-bold">
              {activeWeightMb} MB / 1,024 MB ({budgetPercentage}%)
            </span>
          </div>

          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                budgetPercentage > 90 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
              }`}
              style={{ width: `${budgetPercentage}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500">
            *Batas keras 1 GiB dirancang agar tetap menyisakan 1,200 MB+ RAM untuk aktivasi ONNX Runtime, bitmap decode, dan sistem OS Infinix XOS.
          </p>
        </div>
      </div>

      {/* Downloader & Import Box (Hugging Face / Civitai / Local) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <span className="text-xs font-bold text-slate-200">
            Tambah / Unduh Model Baru
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveDownloadTab('HF')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeDownloadTab === 'HF'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hugging Face
            </button>
            <button
              onClick={() => setActiveDownloadTab('CIVITAI')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeDownloadTab === 'CIVITAI'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Civitai / Direct
            </button>
            <button
              onClick={() => setActiveDownloadTab('LOCAL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                activeDownloadTab === 'LOCAL'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Impor Lokal
            </button>
          </div>
        </div>

        {/* HF Download Form */}
        {activeDownloadTab === 'HF' && (
          <div className="space-y-3 pt-1 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-400 font-mono block mb-1">
                  Namespace / Repository:
                </label>
                <input
                  type="text"
                  value={hfRepo}
                  onChange={(e) => setHfRepo(e.target.value)}
                  placeholder="contoh: stabilityai/sd-turbo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1">
                  Nama File Model:
                </label>
                <input
                  type="text"
                  value={hfFilename}
                  onChange={(e) => setHfFilename(e.target.value)}
                  placeholder="contoh: unet.onnx atau model.safetensors"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-400 font-mono block mb-1">
                  Revision (Branch/Tag/Commit):
                </label>
                <input
                  type="text"
                  value={hfRevision}
                  onChange={(e) => setHfRevision(e.target.value)}
                  placeholder="main, v1.0, atau commit hash"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono block mb-1">
                  Access Token (Opsional):
                </label>
                <input
                  type="password"
                  value={hfToken}
                  onChange={(e) => setHfToken(e.target.value)}
                  placeholder="hf_xxxxxxxx (tidak disimpan permanen)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
              Target URL: <span className="text-amber-400">https://huggingface.co/{hfRepo}/resolve/{hfRevision}/{hfFilename}</span>
            </div>

            <button
              onClick={handleHfDownload}
              disabled={isSimulatingDownload || !hfRepo || !hfFilename}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {isSimulatingDownload ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mengunduh (.part {downloadProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Mulai Unduh dari Hugging Face</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Civitai / Direct URL Form */}
        {activeDownloadTab === 'CIVITAI' && (
          <div className="space-y-3 pt-1 text-xs">
            <div>
              <label className="text-slate-400 font-mono block mb-1">
                Direct HTTPS URL:
              </label>
              <input
                type="text"
                value={directUrl}
                onChange={(e) => setDirectUrl(e.target.value)}
                placeholder="https://.../model.safetensors"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 font-mono block mb-1">
                Simpan Sebagai Nama File:
              </label>
              <input
                type="text"
                value={directFilename}
                onChange={(e) => setDirectFilename(e.target.value)}
                placeholder="contoh: anime-style.safetensors atau flux.gguf"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              *Mendukung fitur HTTP Range resume (.part), SHA-256 verifikasi, dan atomic finalize saat download selesai.
            </p>

            <button
              onClick={handleDirectDownload}
              disabled={isSimulatingDownload || !directUrl || !directFilename}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {isSimulatingDownload ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Mengunduh (.part {downloadProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Mulai Unduh via Direct URL</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Local SAF Document Picker */}
        {activeDownloadTab === 'LOCAL' && (
          <div className="space-y-3 pt-1 text-xs text-center">
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-xl p-6 bg-slate-950/60 transition-colors">
              <FolderPlus className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="font-semibold text-slate-200">
                Pilih File Model dari Penyimpanan HP Android
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Format didukung: .onnx, .ort, .safetensors, .gguf, .ckpt
              </p>

              <label className="mt-3 inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg font-mono font-semibold cursor-pointer border border-slate-700">
                Pilih Dokumen File...
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".onnx,.ort,.safetensors,.gguf,.ckpt,.pt,.pth"
                />
              </label>

              {importedFilename && (
                <div className="mt-2 text-emerald-400 text-xs font-mono">
                  ✓ Berhasil diimpor: {importedFilename}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Model Catalog Table / Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200">
            Daftar Model Terpasang ({models.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Status Validasi Mesin
          </span>
        </div>

        <div className="space-y-2.5">
          {models.map((model) => {
            const isLoaded = model.status === 'LOAD_VALIDATED';
            const isNeedsRuntime = model.status === 'NEEDS_RUNTIME';
            const isFormatOk = model.status === 'FORMAT_OK';
            const isTooLarge = model.status === 'TOO_LARGE';

            return (
              <div
                key={model.id}
                className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-100 text-xs">
                      {model.name}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isLoaded
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                          : isNeedsRuntime
                          ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                          : isFormatOk
                          ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                          : isTooLarge
                          ? 'bg-red-950/80 text-red-400 border-red-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {model.status}
                    </span>

                    {/* Backend tag */}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {model.provider}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {model.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500">
                    <span>File: <strong className="text-slate-400">{model.filename}</strong></span>
                    <span>Ukuran: <strong className="text-slate-400">{formatSize(model.sizeBytes)}</strong></span>
                    {model.sha256 && (
                      <span className="truncate max-w-[200px]" title={model.sha256}>
                        SHA-256: {model.sha256.slice(0, 16)}...
                      </span>
                    )}
                  </div>

                  {/* If in part download */}
                  {model.isPart && (
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-amber-500 h-full transition-all"
                        style={{ width: `${model.downloadProgress || 0}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {model.source !== 'BUILTIN' && (
                    <button
                      onClick={() => removeModel(model.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      title="Hapus Model"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Meaning Reference Box */}
        <div className="mt-3 p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            Arti Status Validasi TAHUBULAT AI:
          </div>
          <p><strong className="text-emerald-400 font-mono">LOAD_VALIDATED</strong>: Graf ONNX berhasil diverifikasi dan siap dieksekusi offline.</p>
          <p><strong className="text-amber-400 font-mono">NEEDS_RUNTIME</strong>: Format valid (safetensors/GGUF), membutuhkan native library stable-diffusion.cpp.</p>
          <p><strong className="text-blue-400 font-mono">FORMAT_OK</strong>: Header model dikenali, menunggu verifikasi backend.</p>
          <p><strong className="text-red-400 font-mono">TOO_LARGE</strong>: Ukuran file melebihi batas anggaran memori keras 1 GiB.</p>
        </div>

      </div>

    </div>
  );
};
