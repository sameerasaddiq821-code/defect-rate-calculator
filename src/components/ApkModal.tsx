import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  QrCode,
  ShieldCheck,
  HelpCircle,
  PackageCheck
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkModal: React.FC<ApkModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCapacitor, setCopiedCapacitor] = useState(false);
  const [copiedBubblewrap, setCopiedBubblewrap] = useState(false);

  if (!isOpen) return null;

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-oyy3chc2zdazyv4cjbozxv-974758255987.asia-southeast1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(currentAppUrl)}`;

  const copyAppUrl = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const copyCapacitorCommands = () => {
    const cmds = `npm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap init "QC Defect Calculator" "com.qc.defectcalc" --web-dir dist\nnpm run build\nnpx cap add android\nnpx cap open android`;
    navigator.clipboard.writeText(cmds);
    setCopiedCapacitor(true);
    setTimeout(() => setCopiedCapacitor(false), 2000);
  };

  const copyBubblewrapCommands = () => {
    const cmds = `npm install -g @bubblewrap/cli\nbubblewrap init --manifest="${currentAppUrl}manifest.json"\nbubblewrap build`;
    navigator.clipboard.writeText(cmds);
    setCopiedBubblewrap(true);
    setTimeout(() => setCopiedBubblewrap(false), 2000);
  };

  const downloadAndroidManifest = () => {
    const manifestData = {
      id: '/',
      name: 'QC Defect Rate Calculator',
      short_name: 'QC Defect',
      description: 'Industrial Quality Control Defect Rate Calculator with high-visibility color status bands, defect categorization, and shift audit logging.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#F8FAFC',
      theme_color: '#0F172A',
      icons: [
        {
          src: '/icon.svg',
          sizes: '192x192 512x512',
          type: 'image/svg+xml',
          purpose: 'any'
        }
      ]
    };

    const blob = new Blob([JSON.stringify(manifestData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // QR code using high-reliability Google Chart API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentAppUrl)}&color=0F172A&bgcolor=FFFFFF`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Android APK & Mobile App Package
              </h3>
              <p className="text-xs text-slate-300">
                Generate standalone APK, install directly on Android, or export source
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-sm text-slate-700">
          
          {/* Method 1: Instant PWABuilder Standalone .APK Generator (Recommended) */}
          <div className="p-5 rounded-xl border-2 border-emerald-500 bg-emerald-50/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded">
                <PackageCheck className="w-3.5 h-3.5" /> Recommended: 1-Click Standalone APK
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Generate Standalone APK with PWABuilder
              </h4>
              <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                Google and Microsoft's official APK packaging engine converts this web app into a signed, ready-to-install Android <strong className="text-slate-900">.apk file</strong> in 30 seconds.
              </p>
            </div>

            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md whitespace-nowrap transition-colors cursor-pointer"
            >
              <span>Generate .APK Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Method 2: Direct Install on Android (WebAPK) */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Direct Mobile Installation
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                Install as Native Android App (WebAPK)
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md">
                Android Chrome and Samsung Internet create a true native APK directly on the phone with full offline caching and full-screen UI.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isInstalled ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" /> Already Installed
                </span>
              ) : isInstallable ? (
                <button
                  onClick={install}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install WebAPK on Android
                </button>
              ) : (
                <span className="text-xs text-slate-500 italic bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  Open on Android to 1-click install
                </span>
              )}
            </div>
          </div>

          {/* QR Code & Mobile URL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex justify-center">
              <img
                src={qrCodeUrl}
                alt="Scan to open on Android"
                className="w-32 h-32 rounded-lg border border-slate-200 shadow-xs"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                <QrCode className="w-4 h-4 text-slate-500" />
                Scan to Open on Android Device
              </div>
              <p className="text-xs text-slate-600">
                Point your Android camera at the QR code to open the app directly on your phone and tap <strong>"Add to Home Screen"</strong> or <strong>"Install"</strong> to generate the APK.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value={currentAppUrl}
                  className="w-full text-xs font-mono py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                />
                <button
                  onClick={copyAppUrl}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUrl ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Method 3: Local APK Compilation via Capacitor / Android Studio */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Terminal className="w-4 h-4 text-slate-600" />
                Build Local .APK with Capacitor & Android Studio
              </div>
              <button
                onClick={copyCapacitorCommands}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                {copiedCapacitor ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copiedCapacitor ? 'Copied' : 'Copy Commands'}
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
{`# 1. Install Capacitor Android packages
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize project configuration
npx cap init "QC Defect Calculator" "com.qc.defectcalc" --web-dir dist

# 3. Build & generate native Android Studio project
npm run build
npx cap add android
npx cap open android
# Then click 'Build APK' in Android Studio!`}
            </pre>
          </div>

          {/* Quick Assets Download */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
            <span>Also check <strong className="text-slate-800">APK-BUILD-GUIDE.md</strong> in the project code tree.</span>
            <button
              onClick={downloadAndroidManifest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download manifest.json
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Compatible with Android 8.0 through Android 15+
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
