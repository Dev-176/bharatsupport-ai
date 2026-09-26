import React, { useState } from 'react';
import { Download, Smartphone, Check, X, Share2, PlusSquare, ArrowDown, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already installed and running standalone
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>Installed App Mode</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
        title="Install BharatSupport AI as a standalone Mobile or Desktop App"
      >
        <Smartphone className="w-4 h-4 text-blue-200" />
        <span>Install App</span>
      </button>

      {/* Install App Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    Install BharatSupport AI App
                  </h3>
                  <p className="text-xs text-blue-100">
                    Standalone Mobile & Desktop Experience
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Native App Performance:</strong> Instant loading, offline cached policies, zero browser URL bar, and direct launch from your home screen.
                </span>
              </div>

              {isIOS ? (
                /* iOS Instructions */
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>iOS Safari Installation</span>
                  </h4>
                  <ol className="space-y-2 text-slate-600 list-decimal list-inside leading-relaxed">
                    <li>
                      Tap the <strong className="text-slate-900">Share</strong> icon (<Share2 className="w-3.5 h-3.5 inline text-blue-600" />) in your Safari bottom navigation bar.
                    </li>
                    <li>
                      Scroll down and select <strong className="text-slate-900">Add to Home Screen</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-blue-600" />).
                    </li>
                    <li>
                      Tap <strong className="text-slate-900">Add</strong> in the top right corner.
                    </li>
                  </ol>
                </div>
              ) : (
                /* Android & Chrome Instructions */
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>Android & Chrome / Edge</span>
                  </h4>
                  <ol className="space-y-2 text-slate-600 list-decimal list-inside leading-relaxed">
                    <li>
                      If prompted by browser, tap <strong className="text-slate-900">"Install BharatSupport AI"</strong>.
                    </li>
                    <li>
                      Or tap browser menu (<strong className="text-slate-900">⋮</strong>) in the top-right and select <strong className="text-slate-900">"Install App"</strong> or <strong className="text-slate-900">"Add to Home Screen"</strong>.
                    </li>
                    <li>
                      The app icon will appear directly on your home screen or application launcher!
                    </li>
                  </ol>
                </div>
              )}

              {/* Direct Trigger Button if browser supports prompt */}
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowModal(false);
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Click to Trigger Instant Install</span>
                </button>
              )}

              <div className="pt-2 text-center text-slate-400 text-[11px]">
                Complies with Progressive Web App (PWA) Standards · Enterprise Client
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
