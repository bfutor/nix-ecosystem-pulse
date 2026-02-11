import {
  ExternalLink,
  MessageSquare,
  ArrowUp,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import type { SEQuestion } from '../types';
import { SkeletonList } from './SkeletonCard';
import { ErrorBadge } from './ErrorBadge';

// ── Reddit Hot Posts ───────────────────────────────────────────────

interface RedditPostItem {
  title: string;
  score: number;
  comments: number;
  url: string;
  author: string;
}

interface RedditHotProps {
  posts: RedditPostItem[] | undefined;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export function RedditHot({
  posts,
  isLoading,
  error,
  onRefresh,
}: RedditHotProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold font-mono text-text-primary">
            Trending on r/NixOS
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Hot posts from the subreddit
          </p>
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
      ) : posts && posts.length > 0 ? (
        <ul className="space-y-2">
          {posts.map((post, i) => (
            <li key={i}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-bg-card-hover transition-colors"
              >
                <div className="flex flex-col items-center shrink-0 w-10">
                  <ArrowUp className="w-3.5 h-3.5 text-warning" />
                  <span className="text-xs font-mono font-medium text-text-primary">
                    {post.score}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary group-hover:text-nix-light line-clamp-2 transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                      <MessageSquare className="w-3 h-3" />
                      {post.comments}
                    </span>
                    <span className="text-xs text-text-secondary">
                      u/{post.author}
                    </span>
                    <ExternalLink className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-8 text-center text-text-secondary text-sm">
          No posts found
        </div>
      )}
    </div>
  );
}

// ── Stack Overflow Questions ───────────────────────────────────────

interface SOQuestionsProps {
  questions: SEQuestion[] | undefined;
  isLoading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export function SOQuestions({
  questions,
  isLoading,
  error,
  onRefresh,
}: SOQuestionsProps) {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold font-mono text-text-primary">
            Latest on Stack Overflow
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Recent nixos-tagged questions
          </p>
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
      ) : questions && questions.length > 0 ? (
        <ul className="space-y-2">
          {questions.map((q, i) => (
            <li key={i}>
              <a
                href={q.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-3 -mx-3 rounded-lg hover:bg-bg-card-hover transition-colors"
              >
                <div className="flex flex-col items-center shrink-0 w-10 gap-1">
                  <span className="flex items-center gap-0.5 text-xs font-mono text-text-secondary">
                    <ArrowUp className="w-3 h-3" />
                    {q.score}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-mono ${q.answer_count > 0 ? 'text-positive' : 'text-text-secondary'}`}
                  >
                    {q.answer_count > 0 ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <HelpCircle className="w-3 h-3" />
                    )}
                    {q.answer_count}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm text-text-primary group-hover:text-nix-light line-clamp-2 transition-colors"
                    dangerouslySetInnerHTML={{ __html: q.title }}
                  />
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {q.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 text-xs rounded bg-nix-dark/20 text-nix-light"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-text-secondary ml-auto">
                      {new Date(q.creation_date * 1000).toLocaleDateString(
                        'en-US',
                        { month: 'short', day: 'numeric' }
                      )}
                    </span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-8 text-center text-text-secondary text-sm">
          No questions found
        </div>
      )}
    </div>
  );
}
