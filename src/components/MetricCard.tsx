import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ReactNode } from 'react';
import { SkeletonCard } from './SkeletonCard';
import { ErrorBadge } from './ErrorBadge';

interface MetricCardProps {
  title: string;
  value: number | string | null;
  icon: ReactNode;
  subtitle?: string;
  delta?: number | null;
  deltaLabel?: string;
  isLoading?: boolean;
  error?: string | null;
  formatter?: (val: number) => string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export function MetricCard({
  title,
  value,
  icon,
  subtitle,
  delta,
  deltaLabel,
  isLoading,
  error,
  formatter,
}: MetricCardProps) {
  if (isLoading) return <SkeletonCard />;

  const displayValue =
    value === null
      ? '—'
      : typeof value === 'number'
        ? (formatter ?? formatNumber)(value)
        : value;

  return (
    <div className="group relative rounded-xl border border-border bg-bg-card p-5 hover:border-nix-dark/50 hover:bg-bg-card-hover transition-all duration-200">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-nix-dark/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
            {title}
          </span>
          <span className="text-nix-light/70">{icon}</span>
        </div>

        {error ? (
          <ErrorBadge message={error} />
        ) : (
          <>
            <div className="text-3xl font-bold font-mono text-text-primary mb-1">
              {displayValue}
            </div>

            <div className="flex items-center gap-2">
              {delta !== undefined && delta !== null && (
                <span
                  className={`flex items-center gap-1 text-xs font-medium ${
                    delta > 0
                      ? 'text-positive'
                      : delta < 0
                        ? 'text-negative'
                        : 'text-text-secondary'
                  }`}
                >
                  {delta > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : delta < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  {delta > 0 ? '+' : ''}
                  {formatNumber(delta)}
                  {deltaLabel && <span className="text-text-secondary ml-1">{deltaLabel}</span>}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-text-secondary">{subtitle}</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
