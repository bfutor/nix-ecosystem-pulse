import { RefreshCw, Camera } from 'lucide-react';
import { AnimatedSnowflake } from './NixLogo';
import { toPng } from 'html-to-image';
import toast from 'react-hot-toast';

interface HeaderProps {
  lastRefresh: Date | null;
  isRefreshing: boolean;
  onRefresh: () => void;
  rateLimitRemaining: number | null;
}

export function Header({
  lastRefresh,
  isRefreshing,
  onRefresh,
  rateLimitRemaining,
}: HeaderProps) {
  const now = new Date();
  const monthYear = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const handleExport = async () => {
    const el = document.getElementById('dashboard-root');
    if (!el) return;
    try {
      toast.loading('Generating screenshot...', { id: 'export' });
      const dataUrl = await toPng(el, {
        backgroundColor: '#0d1117',
        quality: 0.95,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `nixos-pulse-${now.toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Screenshot saved!', { id: 'export' });
    } catch {
      toast.error('Export failed', { id: 'export' });
    }
  };

  return (
    <header className="border-b border-border bg-bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AnimatedSnowflake />
            <div>
              <h1 className="text-2xl font-bold font-mono tracking-tight text-text-primary">
                NixOS Ecosystem Pulse
              </h1>
              <p className="text-sm text-text-secondary">
                {monthYear}
                {lastRefresh && (
                  <span className="ml-2 text-text-secondary/70">
                    · Last refresh:{' '}
                    {lastRefresh.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {rateLimitRemaining !== null && rateLimitRemaining < 10 && (
              <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning border border-warning/30">
                API: {rateLimitRemaining} left
              </span>
            )}

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border bg-bg-card hover:bg-bg-card-hover text-text-secondary hover:text-text-primary transition-colors"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Export PNG</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-nix-dark hover:bg-nix-light text-white font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin-slow' : ''}`}
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh All'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
