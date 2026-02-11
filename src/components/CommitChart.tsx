import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RefreshCw } from 'lucide-react';
import type { MonthlyCommits } from '../types';
import { SkeletonCard } from './SkeletonCard';
import { ErrorBadge } from './ErrorBadge';
import { COLORS } from '../config';

interface CommitChartProps {
  data: MonthlyCommits[] | undefined;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export function CommitChart({
  data,
  isLoading,
  error,
  onRefresh,
}: CommitChartProps) {
  return (
    <section className="rounded-xl border border-border bg-bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold font-mono text-text-primary">
            Monthly Commit Activity
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Last 12 months of commits to nixpkgs
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg hover:bg-bg-card-hover text-text-secondary hover:text-text-primary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {isLoading ? (
        <SkeletonCard height="h-72" />
      ) : error ? (
        <ErrorBadge message={error} />
      ) : data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.nixLightBlue}
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={COLORS.nixDarkBlue}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={COLORS.border}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.border }}
            />
            <YAxis
              tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textPrimary,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
              }}
              labelStyle={{ color: COLORS.textSecondary }}
              formatter={(value: number | undefined) => [
                (value ?? 0).toLocaleString(),
                'Commits',
              ]}
            />
            <Area
              type="monotone"
              dataKey="commits"
              stroke={COLORS.nixLightBlue}
              strokeWidth={2}
              fill="url(#commitGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-72 flex items-center justify-center text-text-secondary">
          No commit data available
        </div>
      )}
    </section>
  );
}
