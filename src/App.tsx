import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PhoneFrame } from './components/PhoneFrame';
import { GeneratorTab } from './components/GeneratorTab';
import { ModelLibraryTab } from './components/ModelLibraryTab';
import { ApkBuilderTab } from './components/ApkBuilderTab';
import { HardwarePolicyTab } from './components/HardwarePolicyTab';
import { RamProfile, ThermalState, DeviceModelId } from './types';
import { DEVICE_SPECIFICATIONS } from './data/devices';

export default function App() {
  const [activeTab, setActiveTab] = useState<'generator' | 'models' | 'apk' | 'hardware'>('apk');
  const [isPhoneView, setIsPhoneView] = useState(false);
  const [deviceModel, setDeviceModel] = useState<DeviceModelId>('X6837');
  const [ramProfile, setRamProfile] = useState<RamProfile>('8GB');
  const [thermalState, setThermalState] = useState<ThermalState>('NOMINAL');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  const currentDevice = DEVICE_SPECIFICATIONS[deviceModel];

  // Register service worker for PWA / WebAPK capabilities
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration note:', err);
      });
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setCanInstallPwa(false);
      }
      setDeferredPrompt(null);
    } else {
      alert('Aplikasi siap dipasang sebagai WebAPK! Jika menggunakan Chrome/Browser di HP Infinix, Anda juga dapat menekan menu titik tiga (⋮) > "Tambahkan ke Layar Utama / Pasang Aplikasi".');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'generator':
        return (
          <GeneratorTab
            deviceModel={deviceModel}
            ramProfile={ramProfile}
            thermalState={thermalState}
            onNavigateToModels={() => setActiveTab('models')}
          />
        );
      case 'models':
        return (
          <ModelLibraryTab
            onBackToGenerator={() => setActiveTab('generator')}
          />
        );
      case 'apk':
        return (
          <ApkBuilderTab
            onInstallPwa={handleInstallPwa}
            canInstallPwa={canInstallPwa}
          />
        );
      case 'hardware':
        return (
          <HardwarePolicyTab
            deviceModel={deviceModel}
            setDeviceModel={setDeviceModel}
            ramProfile={ramProfile}
            thermalState={thermalState}
            setRamProfile={setRamProfile}
            setThermalState={setThermalState}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPhoneView={isPhoneView}
        setIsPhoneView={setIsPhoneView}
        deviceModel={deviceModel}
        setDeviceModel={setDeviceModel}
        ramProfile={ramProfile}
        setRamProfile={setRamProfile}
        thermalState={thermalState}
        setThermalState={setThermalState}
        onInstallPwa={handleInstallPwa}
        canInstallPwa={canInstallPwa}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">
        {isPhoneView ? (
          <PhoneFrame 
            activeTitle="TAHUBULAT AI v1.2"
            deviceModel={deviceModel}
          >
            <div className="py-2">
              {renderContent()}
            </div>
          </PhoneFrame>
        ) : (
          <div className="py-6 px-4 sm:px-6">
            {renderContent()}
          </div>
        )}
      </main>

      {/* Footer info bar */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-3 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TAHUBULAT AI v1.2 • Target Aktif: {currentDevice.name} ({currentDevice.id})</span>
          <span className="text-amber-500/80">
            {currentDevice.chipset} • {currentDevice.os} • 256×256 INT8 QDQ DDIM
          </span>
        </div>
      </footer>
    </div>
  );
}
