import { Trophy, Star, Users, GitFork, RefreshCw } from 'lucide-react';
import type { RepoRanking } from '../services/nixData';
import { SkeletonList } from './SkeletonCard';
import { ErrorBadge } from './ErrorBadge';

const LANG_COLORS: Record<string, string> = {
  Nix: '#7e7eff',
  C: '#555555',
  TypeScript: '#3178c6',
  Dart: '#00B4AB',
  Go: '#00ADD8',
  Rust: '#dea584',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  'C++': '#f34b7d',
  Ruby: '#701516',
};

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

interface RepoRankingTableProps {
  data: RepoRanking[] | undefined;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export function RepoRankingTable({
  data,
  isLoading,
  error,
  onRefresh,
}: RepoRankingTableProps) {
  const nixpkgsRank = data
    ? data.findIndex((r) => r.fullName === 'NixOS/nixpkgs') + 1
    : null;

  return (
    <section className="rounded-xl border border-border bg-bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold font-mono text-text-primary flex items-center gap-2">
            <Trophy className="w-5 h-5 text-warning" />
            Nixpkgs Among Top Open Source Projects
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Ranked by GitHub stars against other major repositories
            {nixpkgsRank && nixpkgsRank > 0 && (
              <span className="ml-2 text-nix-light font-medium">
                — nixpkgs is #{nixpkgsRank}
              </span>
            )}
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
        <SkeletonList rows={8} />
      ) : error ? (
        <ErrorBadge message={error} />
      ) : data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-secondary w-12">
                  #
                </th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-secondary">
                  Repository
                </th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-secondary text-right">
                  <span className="flex items-center justify-end gap-1">
                    <Star className="w-3 h-3" /> Stars
                  </span>
                </th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-secondary text-right hidden md:table-cell">
                  <span className="flex items-center justify-end gap-1">
                    <Users className="w-3 h-3" /> Contributors
                  </span>
                </th>
                <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-text-secondary text-right hidden lg:table-cell">
                  <span className="flex items-center justify-end gap-1">
                    <GitFork className="w-3 h-3" /> Forks
                  </span>
                </th>
                <th className="pb-3 text-xs font-medium uppercase tracking-wider text-text-secondary text-right hidden lg:table-cell">
                  Language
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((repo, i) => {
                const isNixpkgs = repo.fullName === 'NixOS/nixpkgs';
                return (
                  <tr
                    key={repo.fullName}
                    className={`border-b border-border/50 transition-colors ${
                      isNixpkgs
                        ? 'bg-nix-dark/10 border-nix-dark/30'
                        : 'hover:bg-bg-card-hover'
                    }`}
                  >
                    <td className="py-3 pr-4">
                      <span
                        className={`font-mono text-sm ${
                          isNixpkgs
                            ? 'text-nix-light font-bold'
                            : i < 3
                              ? 'text-warning font-medium'
                              : 'text-text-secondary'
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <a
                        href={`https://github.com/${repo.fullName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-medium hover:underline ${
                          isNixpkgs ? 'text-nix-light' : 'text-text-primary'
                        }`}
                      >
                        {isNixpkgs && (
                          <span className="mr-1.5">❄️</span>
                        )}
                        {repo.fullName}
                      </a>
                      {isNixpkgs && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-nix-dark/30 text-nix-light">
                          You are here
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span
                        className={`font-mono ${
                          isNixpkgs
                            ? 'text-nix-light font-bold'
                            : 'text-text-primary'
                        }`}
                      >
                        {formatNum(repo.stars)}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right hidden md:table-cell">
                      <span
                        className={`font-mono ${
                          isNixpkgs
                            ? 'text-nix-light font-bold'
                            : 'text-text-primary'
                        }`}
                      >
                        {repo.contributorEstimate
                          ? formatNum(repo.contributorEstimate)
                          : '—'}
                      </span>
                      {repo.contributorEstimate === null && (
                        <span className="text-xs text-text-secondary ml-1">*</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-right hidden lg:table-cell">
                      <span className="font-mono text-text-secondary">
                        {formatNum(repo.forks)}
                      </span>
                    </td>
                    <td className="py-3 text-right hidden lg:table-cell">
                      {repo.language && (
                        <span className="flex items-center justify-end gap-1.5 text-xs text-text-secondary">
                          <span
                            className="w-2 h-2 rounded-full inline-block shrink-0"
                            style={{
                              backgroundColor:
                                LANG_COLORS[repo.language] ?? '#8b949e',
                            }}
                          />
                          {repo.language}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-text-secondary mt-4">
            * Contributor counts are estimates for very large repos where the GitHub API cannot compute exact totals.
            Sorted by stars. Data fetched live from GitHub.
          </p>
        </div>
      ) : (
        <div className="py-8 text-center text-text-secondary text-sm">
          No ranking data available
        </div>
      )}
    </section>
  );
}
