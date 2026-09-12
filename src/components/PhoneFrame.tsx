import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';
import { DeviceModelId } from '../types';

interface PhoneFrameProps {
  children: React.ReactNode;
  activeTitle?: string;
  deviceModel?: DeviceModelId;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ 
  children, 
  deviceModel = 'X6837' 
}) => {
  const [currentTime, setCurrentTime] = useState('12:45');
  const isX6837 = deviceModel === 'X6837';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center items-center py-4 px-2">
      {/* Device Body (Infinix Hot 40 Pro X6837 or Hot 70 Pro X6896 Profile) */}
      <div className="relative w-full max-w-[412px] bg-slate-950 border-[6px] border-slate-800 rounded-[44px] shadow-2xl shadow-amber-500/10 overflow-hidden ring-1 ring-slate-700/50 flex flex-col h-[850px]">
        
        {/* Top Speaker Ear-piece */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-800 rounded-full z-50"></div>

        {/* Status Bar */}
        <div className="h-10 bg-slate-950 px-6 pt-2 flex items-center justify-between z-40 select-none text-slate-300 font-mono text-xs border-b border-slate-900/60">
          {/* Time & Network Badge */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-200">{currentTime}</span>
            <span className="text-[10px] text-amber-400 font-bold px-1.5 bg-amber-500/10 rounded border border-amber-500/30">
              {isX6837 ? '4G+' : '5G'}
            </span>
          </div>

          {/* Center Punch-hole Camera (6.78" 120Hz display) */}
          <div className="w-4 h-4 rounded-full bg-black ring-2 ring-slate-800/80 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
          </div>

          {/* System Icons */}
          <div className="flex items-center space-x-1.5">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center text-[11px] font-sans font-medium text-slate-300">
              <span>92%</span>
              <Battery className="w-4 h-4 ml-0.5 text-emerald-400 fill-emerald-400" />
            </div>
          </div>
        </div>

        {/* Device Sub-banner */}
        <div className="bg-slate-900/80 px-4 py-1 text-[10px] font-mono text-slate-400 flex items-center justify-between border-b border-slate-800/50">
          <span className="text-amber-400 font-semibold truncate">
            {isX6837 ? 'Infinix Hot 40 Pro (X6837)' : 'Infinix Hot 70 Pro (X6896)'}
          </span>
          <span className="text-slate-500">
            {isX6837 ? 'Helio G99 • XOS 13.5' : 'Dimensity 7100 • XOS 16'}
          </span>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col no-scrollbar">
          {children}
        </div>

        {/* Android Gesture Pill Navigation Bar */}
        <div className="h-6 bg-slate-950 flex items-center justify-center select-none pb-1">
          <div className="w-32 h-1 bg-slate-500/60 rounded-full hover:bg-slate-400 transition-colors cursor-pointer"></div>
        </div>

      </div>
    </div>
  );
};
