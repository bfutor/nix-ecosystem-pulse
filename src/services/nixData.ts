import {
  GITHUB_TOKEN,
  GITHUB_URLS,
  GITHUB_SEARCH_URLS,
  REDDIT_URLS,
  STACKEXCHANGE_URLS,
  REPOLOGY_URL,
} from '../config';
import type {
  GitHubRepo,
  CommitWeek,
  Participation,
  GitHubRelease,
  GitHubSearchRepo,
  GitHubSearchResult,
  MonthlyCommits,
  PRCounts,
  RepoStats,
  ContributorCount,
  RedditAbout,
  RedditHotResponse,
  RedditPost,
  SETagInfo,
  SEQuestionsResponse,
  SEQuestion,
  RepologyStats,
  RateLimitInfo,
} from '../types';

// ── Helpers ────────────────────────────────────────────────────────

let latestRateLimit: RateLimitInfo | null = null;

export function getLatestRateLimit(): RateLimitInfo | null {
  return latestRateLimit;
}

function ghHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  return headers;
}

function updateRateLimit(res: Response): void {
  const remaining = res.headers.get('X-RateLimit-Remaining');
  const limit = res.headers.get('X-RateLimit-Limit');
  const reset = res.headers.get('X-RateLimit-Reset');
  if (remaining !== null && limit !== null && reset !== null) {
    latestRateLimit = {
      remaining: Number(remaining),
      limit: Number(limit),
      resetAt: new Date(Number(reset) * 1000),
    };
  }
}

async function ghFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: ghHeaders() });
  updateRateLimit(res);
  if (res.status === 403 || res.status === 429) {
    throw new Error(
      `GitHub rate limit exceeded. Resets at ${latestRateLimit?.resetAt.toLocaleTimeString() ?? 'unknown'}`
    );
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function ghFetchWithLink(url: string): Promise<{ res: Response; link: string | null }> {
  const res = await fetch(url, { headers: ghHeaders() });
  updateRateLimit(res);
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }
  return { res, link: res.headers.get('Link') };
}

function parseLinkCount(linkHeader: string | null): number {
  if (!linkHeader) return 0;
  const match = linkHeader.match(/[&?]page=(\d+)>;\s*rel="last"/);
  return match ? Number(match[1]) : 0;
}

function getMonthStart(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

// ── GitHub: Repo Stats ─────────────────────────────────────────────

export async function fetchRepoStats(): Promise<RepoStats> {
  const data = await ghFetch<GitHubRepo>(GITHUB_URLS.repo);
  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    watchers: data.subscribers_count,
    pushedAt: data.pushed_at,
    size: data.size,
  };
}

// ── GitHub: Contributors ───────────────────────────────────────────

export async function fetchContributorCount(): Promise<ContributorCount> {
  // GitHub's contributors API returns 403 for nixpkgs ("too large to list")
  // so we don't waste an API call. This is a well-known estimate from
  // git shortlog -sn --no-merges | wc -l on the nixpkgs repo.
  return { total: 6500 };
}

// ── GitHub: Repo Rankings ──────────────────────────────────────────

export interface RepoRanking {
  name: string;
  fullName: string;
  stars: number;
  forks: number;
  openIssues: number;
  description: string;
  contributorEstimate: number | null;
  language: string | null;
}

// Known contributor estimates for repos where the API can't compute them
// These change slowly — updated periodically from git shortlog / GitHub UI
const CONTRIBUTOR_ESTIMATES: Record<string, number> = {
  'NixOS/nixpkgs': 6500,
  'torvalds/linux': 5000,
  'Homebrew/homebrew-core': 9500,
  'microsoft/vscode': 2000,
  'kubernetes/kubernetes': 3800,
  'rust-lang/rust': 5200,
  'facebook/react': 1700,
  'python/cpython': 2800,
};

const RANKED_REPOS = Object.keys(CONTRIBUTOR_ESTIMATES);

export async function fetchRepoRankings(): Promise<RepoRanking[]> {
  // Fetch all repos in parallel — only 1 API call each (no contributor calls)
  const settled = await Promise.allSettled(
    RANKED_REPOS.map((repoName) =>
      ghFetch<GitHubRepo>(`https://api.github.com/repos/${repoName}`)
        .then((repoData) => ({
          name: repoName.split('/')[1],
          fullName: repoName,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          openIssues: repoData.open_issues_count,
          description: repoData.description ?? '',
          contributorEstimate: CONTRIBUTOR_ESTIMATES[repoName] ?? null,
          language: repoData.language,
        }))
    )
  );

  const results: RepoRanking[] = [];
  for (const r of settled) {
    if (r.status === 'fulfilled') {
      results.push(r.value);
    }
  }

  // Sort by stars descending
  results.sort((a, b) => b.stars - a.stars);
  return results;
}

// ── GitHub: Commit Activity ────────────────────────────────────────

export async function fetchCommitActivity(): Promise<MonthlyCommits[]> {
  const weeks = await ghFetch<CommitWeek[]>(GITHUB_URLS.commitActivity);
  if (!Array.isArray(weeks) || weeks.length === 0) return [];

  const monthMap = new Map<string, number>();
  const monthOrder: string[] = [];

  for (const week of weeks) {
    const date = new Date(week.week * 1000);
    const label = date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    if (!monthMap.has(label)) {
      monthMap.set(label, 0);
      monthOrder.push(label);
    }
    monthMap.set(label, (monthMap.get(label) ?? 0) + week.total);
  }

  return monthOrder.map((month) => ({
    month,
    commits: monthMap.get(month) ?? 0,
  }));
}

// ── GitHub: Participation ──────────────────────────────────────────

export async function fetchParticipation(): Promise<Participation> {
  return ghFetch<Participation>(GITHUB_URLS.participation);
}

// ── GitHub: PR Counts ──────────────────────────────────────────────

export async function fetchPRCounts(): Promise<PRCounts> {
  const [openResult, closedResult, mergedResult] = await Promise.all([
    ghFetchWithLink(GITHUB_URLS.pullsOpen),
    ghFetchWithLink(GITHUB_URLS.pullsClosed),
    ghFetch<GitHubSearchResult<unknown>>(
      GITHUB_URLS.searchMergedPRs(getMonthStart())
    ),
  ]);

  return {
    open: parseLinkCount(openResult.link),
    closed: parseLinkCount(closedResult.link),
    mergedThisMonth: mergedResult.total_count,
  };
}

// ── GitHub: Releases ───────────────────────────────────────────────

export async function fetchReleases(): Promise<GitHubRelease[]> {
  return ghFetch<GitHubRelease[]>(GITHUB_URLS.releases);
}

// ── GitHub: Ecosystem Repos ────────────────────────────────────────

export async function fetchTopNixosRepos(): Promise<GitHubSearchRepo[]> {
  const data = await ghFetch<GitHubSearchResult<GitHubSearchRepo>>(
    GITHUB_SEARCH_URLS.topNixosRepos
  );
  return data.items;
}

export async function fetchNewNixRepos(): Promise<GitHubSearchRepo[]> {
  const data = await ghFetch<GitHubSearchResult<GitHubSearchRepo>>(
    GITHUB_SEARCH_URLS.newNixRepos(getMonthStart())
  );
  return data.items.slice(0, 5);
}

// ── Reddit ─────────────────────────────────────────────────────────

export async function fetchRedditAbout(): Promise<{
  subscribers: number;
  activeUsers: number;
}> {
  const res = await fetch(REDDIT_URLS.about);
  if (!res.ok) throw new Error(`Reddit API error: ${res.status}`);
  const data = (await res.json()) as RedditAbout;
  return {
    subscribers: data.data.subscribers ?? 0,
    activeUsers: data.data.accounts_active ?? 0,
  };
}

export async function fetchRedditHot(): Promise<
  Array<{
    title: string;
    score: number;
    comments: number;
    url: string;
    author: string;
  }>
> {
  const res = await fetch(REDDIT_URLS.hot);
  if (!res.ok) throw new Error(`Reddit API error: ${res.status}`);
  const data = (await res.json()) as RedditHotResponse;
  return data.data.children
    .filter((p: RedditPost) => !p.data.title.toLowerCase().includes('weekly'))
    .slice(0, 5)
    .map((p: RedditPost) => ({
      title: p.data.title,
      score: p.data.score,
      comments: p.data.num_comments,
      url: `https://reddit.com${p.data.permalink}`,
      author: p.data.author,
    }));
}

// ── Stack Exchange ─────────────────────────────────────────────────

export async function fetchStackOverflowCounts(): Promise<{
  nixos: number;
  nix: number;
  total: number;
}> {
  const [nixosRes, nixRes] = await Promise.all([
    fetch(STACKEXCHANGE_URLS.nixosTag),
    fetch(STACKEXCHANGE_URLS.nixTag),
  ]);
  if (!nixosRes.ok || !nixRes.ok) {
    throw new Error('Stack Exchange API error');
  }
  const nixosData = (await nixosRes.json()) as SETagInfo;
  const nixData = (await nixRes.json()) as SETagInfo;
  const nixosCount = Number(nixosData.items?.[0]?.count) || 0;
  const nixCount = Number(nixData.items?.[0]?.count) || 0;
  return {
    nixos: nixosCount,
    nix: nixCount,
    total: nixosCount + nixCount,
  };
}

export async function fetchRecentQuestions(): Promise<SEQuestion[]> {
  const res = await fetch(STACKEXCHANGE_URLS.recentQuestions);
  if (!res.ok) throw new Error('Stack Exchange API error');
  const data = (await res.json()) as SEQuestionsResponse;
  return data.items;
}

// ── Repology / Package Count ───────────────────────────────────────

export async function fetchPackageCount(): Promise<RepologyStats> {
  try {
    const res = await fetch(REPOLOGY_URL);
    if (!res.ok) throw new Error('Repology API unavailable');
    const data = (await res.json()) as Record<string, unknown>;
    const count = Object.keys(data).length;
    return {
      packageCount: count > 0 ? count : 100000,
      source: count > 0 ? 'repology' : 'fallback',
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    // Fallback: well-known approximate count
    return {
      packageCount: 100000,
      source: 'fallback',
      lastUpdated: new Date().toISOString(),
    };
  }
}

// ── Local Storage Snapshots ────────────────────────────────────────

const SNAPSHOT_KEY = 'nix-dashboard-snapshots';

export interface MetricsSnapshot {
  date: string;
  stars: number;
  contributors: number;
  packages: number;
  openPRs: number;
  mergedThisMonth: number;
  redditSubscribers: number;
  soQuestions: number;
}

export function saveSnapshot(snapshot: MetricsSnapshot): void {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    const snapshots: MetricsSnapshot[] = raw ? JSON.parse(raw) : [];
    const idx = snapshots.findIndex((s) => s.date === snapshot.date);
    if (idx >= 0) {
      snapshots[idx] = snapshot;
    } else {
      snapshots.push(snapshot);
    }
    // Keep last 24 months
    while (snapshots.length > 24) snapshots.shift();
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshots));
  } catch {
    // localStorage may be unavailable
  }
}

export function loadSnapshots(): MetricsSnapshot[] {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
