import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { GitPullRequest, RefreshCw } from 'lucide-react';
import type { PRCounts } from '../types';
import { SkeletonCard } from './SkeletonCard';
import { ErrorBadge } from './ErrorBadge';
import { COLORS } from '../config';

interface PRHealthChartProps {
  data: PRCounts | undefined;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export function PRHealthChart({
  data,
  isLoading,
  error,
  onRefresh,
}: PRHealthChartProps) {
  const chartData = data
    ? [
        { name: 'Open', value: data.open },
        { name: 'Closed', value: data.closed },
      ]
    : [];

  const PIE_COLORS = [COLORS.nixLightBlue, COLORS.green];

  return (
    <section className="rounded-xl border border-border bg-bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold font-mono text-text-primary flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-nix-light" />
            PR & Issue Health
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Open vs Closed pull requests
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
        <SkeletonCard height="h-64" />
      ) : error ? (
        <ErrorBadge message={error} />
      ) : data ? (
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.bgCard,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '8px',
                    color: COLORS.textPrimary,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '13px',
                  }}
                  formatter={(value: number | undefined) => [
                    (value ?? 0).toLocaleString(),
                    'PRs',
                  ]}
                />
                <Legend
                  formatter={(value: string) => (
                    <span className="text-text-secondary text-sm">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full lg:w-1/2 space-y-4">
            <div className="rounded-lg bg-bg/50 border border-border p-4">
              <div className="text-sm text-text-secondary">Open PRs</div>
              <div className="text-2xl font-bold font-mono text-nix-light">
                {data.open.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-bg/50 border border-border p-4">
              <div className="text-sm text-text-secondary">Closed PRs</div>
              <div className="text-2xl font-bold font-mono text-positive">
                {data.closed.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-bg/50 border border-border p-4">
              <div className="text-sm text-text-secondary">
                Merged This Month
              </div>
              <div className="text-2xl font-bold font-mono text-accent-purple">
                {data.mergedThisMonth.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
