export type StepMode = 'AUTO' | 'FAST' | 'QUALITY' | 'CUSTOM';
export type ExecutionProvider = 'NNAPI' | 'XNNPACK' | 'CPU';
export type ThermalState = 'NOMINAL' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
export type RamProfile = '6GB' | '8GB' | '12GB';
export type DeviceModelId = 'X6896' | 'X6837';

export interface DeviceSpecification {
  id: DeviceModelId;
  name: string;
  marketingName: string;
  releaseDate: string;
  network: string;
  dimensions: string;
  weight: string;
  build: string;
  display: string;
  os: string;
  apiLevel: number;
  chipset: string;
  cpu: string;
  gpu: string;
  ramOptions: RamProfile[];
  storageType: string;
  camera: string;
  audio: string;
  battery: string;
  charging: string;
  benchmarks: {
    antutu: string;
    geekbench: string;
  };
  recommendedProvider: ExecutionProvider;
  memoryCeilings: Record<string, number>;
}

export type ModelFormat = 'onnx' | 'ort' | 'safetensors' | 'gguf' | 'ckpt' | 'pt' | 'pth';

export type ModelStatus = 
  | 'LOAD_VALIDATED'
  | 'FORMAT_OK'
  | 'NEEDS_RUNTIME'
  | 'LOAD_FAILED'
  | 'TOO_LARGE'
  | 'UNSUPPORTED';

export interface ModelItem {
  id: string;
  name: string;
  filename: string;
  sizeBytes: number;
  format: ModelFormat;
  status: ModelStatus;
  provider: 'ONNX_RUNTIME' | 'STABLE_DIFFUSION_CPP' | 'UNKNOWN';
  description: string;
  sha256?: string;
  source: 'BUILTIN' | 'LOCAL' | 'HUGGINGFACE' | 'CIVITAI';
  downloadProgress?: number;
  isPart?: boolean;
}

export interface GenerationConfig {
  prompt: string;
  negativePrompt?: string;
  stepMode: StepMode;
  customSteps?: number;
  executionProvider: ExecutionProvider;
  ramProfile: RamProfile;
  thermalState: ThermalState;
  seed?: number;
}

export interface GenerationStepTelemetry {
  step: number;
  totalSteps: number;
  alphaProd: number;
  latentStats: {
    mean: number;
    std: number;
    min: number;
    max: number;
  };
  stepDurationMs: number;
  currentRssMb: number;
  previewUrl?: string;
}

export interface GenerationResult {
  id: string;
  prompt: string;
  imageUrl: string;
  totalDurationMs: number;
  stepsExecuted: number;
  executionProviderUsed: ExecutionProvider;
  peakRssMb: number;
  modelId: string;
  timestamp: string;
  telemetry: GenerationStepTelemetry[];
}

export interface ApkBuildReadiness {
  sourceReady: boolean;
  modelReady: boolean;
  apkReady: boolean;
  checks: {
    name: string;
    description: string;
    passed: boolean;
    details: string;
  }[];
}
