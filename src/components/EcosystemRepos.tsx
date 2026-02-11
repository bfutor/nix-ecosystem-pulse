import { Star, ExternalLink, RefreshCw, GitFork } from 'lucide-react';
import type { GitHubSearchRepo } from '../types';
import { SkeletonList } from './SkeletonCard';
import { ErrorBadge } from './ErrorBadge';

const LANG_COLORS: Record<string, string> = {
  Nix: '#7e7eff',
  Haskell: '#5e5086',
  Rust: '#dea584',
  Python: '#3572A5',
  Go: '#00ADD8',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
};

function LanguageBadge({ language }: { language: string | null }) {
  if (!language) return null;
  const color = LANG_COLORS[language] ?? '#8b949e';
  return (
    <span className="flex items-center gap-1.5 text-xs text-text-secondary">
      <span
        className="w-2.5 h-2.5 rounded-full inline-block"
        style={{ backgroundColor: color }}
      />
      {language}
    </span>
  );
}

interface RepoListProps {
  title: string;
  subtitle: string;
  repos: GitHubSearchRepo[] | undefined;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
  showCreatedDate?: boolean;
}

export function RepoList({
  title,
  subtitle,
  repos,
  isLoading,
  error,
  onRefresh,
  showCreatedDate,
}: RepoListProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold font-mono text-text-primary">
            {title}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg hover:bg-bg-card-hover text-text-secondary hover:text-text-primary transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {isLoading ? (
        <SkeletonList rows={5} />
      ) : error ? (
        <ErrorBadge message={error} />
      ) : repos && repos.length > 0 ? (
        <ul className="space-y-3">
          {repos.map((repo, i) => (
            <li key={repo.full_name}>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-bg-card-hover transition-colors"
              >
                <span className="text-sm font-mono text-text-secondary w-5 shrink-0 pt-0.5">
                  {i + 1}.
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-nix-light group-hover:text-text-primary truncate">
                      {repo.full_name}
                    </span>
                    <ExternalLink className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                  </div>
                  {repo.description && (
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                      <Star className="w-3 h-3 text-warning" />
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                    <LanguageBadge language={repo.language} />
                    {showCreatedDate && (
                      <span className="text-xs text-text-secondary">
                        {new Date(repo.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-8 text-center text-text-secondary text-sm">
          No repositories found
        </div>
      )}
    </div>
  );
}

// Suppress unused import warning — GitFork is exported for potential use
void GitFork;
