// ── API Configuration ──────────────────────────────────────────────

export const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
export const REFRESH_INTERVAL_MS = import.meta.env.VITE_REFRESH_INTERVAL_MS
  ? Number(import.meta.env.VITE_REFRESH_INTERVAL_MS)
  : undefined;

export const STALE_TIME = 15 * 60 * 1000; // 15 minutes

// ── GitHub API ─────────────────────────────────────────────────────

const GH = 'https://api.github.com';
const REPO = 'NixOS/nixpkgs';

export const GITHUB_URLS = {
  repo: `${GH}/repos/${REPO}`,
  contributors: `${GH}/repos/${REPO}/contributors`,
  commitActivity: `${GH}/repos/${REPO}/stats/commit_activity`,
  participation: `${GH}/repos/${REPO}/stats/participation`,
  pullsOpen: `${GH}/repos/${REPO}/pulls?state=open&per_page=1`,
  pullsClosed: `${GH}/repos/${REPO}/pulls?state=closed&per_page=1`,
  searchMergedPRs: (since: string) =>
    `${GH}/search/issues?q=repo:${REPO}+type:pr+merged:>${since}`,
  releases: `${GH}/repos/${REPO}/releases?per_page=5`,
} as const;

export const GITHUB_SEARCH_URLS = {
  topNixosRepos: `${GH}/search/repositories?q=topic:nixos&sort=stars&per_page=5`,
  newNixRepos: (since: string) =>
    `${GH}/search/repositories?q=topic:nix+created:>${since}&sort=stars&per_page=5`,
} as const;

// ── CORS Proxy (for production where Vite proxy isn't available) ───

const isDev = import.meta.env.DEV;
const CORS_PROXY = 'https://corsproxy.io/?url=';

function proxyUrl(devPrefix: string, prodUrl: string): string {
  return isDev ? devPrefix : `${CORS_PROXY}${encodeURIComponent(prodUrl)}`;
}

// ── Repology ───────────────────────────────────────────────────────

export const REPOLOGY_URL = proxyUrl(
  '/repology-api/api/v1/repository/nix_unstable',
  'https://repology.org/api/v1/repository/nix_unstable'
);

// ── Reddit (via proxy for CORS) ────────────────────────────────────

export const REDDIT_URLS = {
  about: proxyUrl('/reddit-api/r/NixOS/about.json', 'https://www.reddit.com/r/NixOS/about.json'),
  hot: proxyUrl('/reddit-api/r/NixOS/hot.json?limit=5', 'https://www.reddit.com/r/NixOS/hot.json?limit=5'),
} as const;

// ── Stack Exchange ─────────────────────────────────────────────────

const SE = 'https://api.stackexchange.com/2.3';

export const STACKEXCHANGE_URLS = {
  nixosTag: `${SE}/tags/nixos/info?site=stackoverflow`,
  nixTag: `${SE}/tags/nix/info?site=stackoverflow`,
  recentQuestions: `${SE}/questions?tagged=nixos&sort=creation&order=desc&site=stackoverflow&pagesize=5&filter=withbody`,
} as const;

// ── Colors ─────────────────────────────────────────────────────────

export const COLORS = {
  nixLightBlue: '#7eb1d4',
  nixDarkBlue: '#5277c3',
  bg: '#0d1117',
  bgCard: '#161b22',
  bgCardHover: '#1c2333',
  border: '#30363d',
  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  green: '#3fb950',
  red: '#f85149',
  orange: '#d29922',
  purple: '#a371f7',
} as const;
