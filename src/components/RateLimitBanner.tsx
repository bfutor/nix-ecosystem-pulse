import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import type { RateLimitInfo } from '../types';

interface RateLimitBannerProps {
  rateLimit: RateLimitInfo | null;
}

export function RateLimitBanner({ rateLimit }: RateLimitBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!rateLimit || rateLimit.remaining > 5 || dismissed) return null;

  return (
    <div className="bg-warning/10 border-b border-warning/30 px-6 py-3">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-warning">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            GitHub API rate limit low: <strong>{rateLimit.remaining}</strong> /{' '}
            {rateLimit.limit} requests remaining. Resets at{' '}
            {rateLimit.resetAt.toLocaleTimeString()}.
            {!import.meta.env.VITE_GITHUB_TOKEN && (
              <span className="ml-1 text-text-secondary">
                Set <code className="font-mono text-xs">VITE_GITHUB_TOKEN</code>{' '}
                for 5,000 requests/hour.
              </span>
            )}
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-warning/20 rounded transition-colors"
        >
          <X className="w-4 h-4 text-warning" />
        </button>
      </div>
    </div>
  );
}
