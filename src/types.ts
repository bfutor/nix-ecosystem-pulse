// ── GitHub Types ───────────────────────────────────────────────────

export interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  subscribers_count: number;
  pushed_at: string;
  size: number;
  description: string;
  full_name: string;
  language: string | null;
}

export interface CommitWeek {
  total: number;
  week: number; // Unix timestamp
  days: number[];
}

export interface Participation {
  all: number[];
  owner: number[];
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
}

export interface GitHubSearchRepo {
  full_name: string;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  created_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubSearchResult<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}

// ── Aggregated Data Types ──────────────────────────────────────────

export interface MonthlyCommits {
  month: string; // "Jan 2025"
  commits: number;
}

export interface PRCounts {
  open: number;
  closed: number;
  mergedThisMonth: number;
}

export interface RepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  pushedAt: string;
  size: number;
}

export interface ContributorCount {
  total: number;
}

// ── Reddit Types ───────────────────────────────────────────────────

export interface RedditAbout {
  data: {
    subscribers: number;
    accounts_active: number;
    public_description: string;
    display_name: string;
  };
}

export interface RedditPost {
  data: {
    title: string;
    score: number;
    num_comments: number;
    permalink: string;
    url: string;
    author: string;
    created_utc: number;
  };
}

export interface RedditHotResponse {
  data: {
    children: RedditPost[];
  };
}

// ── Stack Exchange Types ───────────────────────────────────────────

export interface SETagInfo {
  items: Array<{
    count: number;
    name: string;
  }>;
}

export interface SEQuestion {
  title: string;
  link: string;
  score: number;
  answer_count: number;
  creation_date: number;
  tags: string[];
  view_count: number;
}

export interface SEQuestionsResponse {
  items: SEQuestion[];
  has_more: boolean;
}

// ── Repology Types ─────────────────────────────────────────────────

export interface RepologyStats {
  packageCount: number;
  source: 'repology' | 'fallback';
  lastUpdated: string;
}

// ── Dashboard Aggregate Types ──────────────────────────────────────

export interface KeyMetrics {
  stars: number;
  contributors: number;
  packages: number;
  openPRs: number;
  mergedThisMonth: number;
  redditSubscribers: number;
  stackOverflowQuestions: number;
}

export interface HistoricalSnapshot {
  date: string; // YYYY-MM
  metrics: KeyMetrics;
}

// ── Rate Limit ─────────────────────────────────────────────────────

export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetAt: Date;
}
