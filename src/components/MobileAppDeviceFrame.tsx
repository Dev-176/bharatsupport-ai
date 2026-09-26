import React from 'react';
import { Wifi, Battery, Signal, Smartphone, X } from 'lucide-react';

interface MobileAppDeviceFrameProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const MobileAppDeviceFrame: React.FC<MobileAppDeviceFrameProps> = ({
  children,
  onClose,
}) => {
  return (
    <div className="py-6 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-slate-200/70">
      {/* Device Top Control Pill */}
      <div className="mb-4 flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-xs border border-slate-300 text-xs text-slate-700">
        <span className="flex items-center gap-1.5 font-bold text-slate-900">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span>Mobile Device Viewport</span>
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-500">Android & iOS Responsive Simulation</span>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-slate-700 p-0.5"
          title="Return to Full Desktop Width"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Phone Bezel */}
      <div className="relative w-full max-w-[410px] h-[820px] bg-slate-900 rounded-[50px] p-3.5 shadow-2xl shadow-slate-900/40 border-4 border-slate-700 flex flex-col overflow-hidden">
        {/* Camera Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
        </div>

        {/* Mobile Status Bar */}
        <div className="h-8 w-full bg-slate-900 text-white text-[11px] font-semibold flex items-center justify-between px-6 shrink-0 z-20 select-none">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Phone Screen Canvas (Scrollable) */}
        <div className="flex-1 bg-slate-50 rounded-[38px] overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* Phone Home Indicator Bar */}
        <div className="h-6 w-full bg-slate-900 flex items-center justify-center shrink-0">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
