# ❄️ NixOS Ecosystem Pulse

A production-grade, single-page React dashboard that tracks and visualizes the monthly growth and health of the **NixOS and nixpkgs ecosystem**. Refreshable on demand, designed for NixOS meetups or blog embeds.

![Dashboard Screenshot](./screenshot-placeholder.png)

## Features

- **Live Data** — Fetches from GitHub, Reddit, Stack Overflow, and Repology APIs
- **Key Metrics** — Stars, contributors, packages, open PRs, subreddit size, SO questions
- **Commit Activity** — Beautiful area chart of monthly nixpkgs commit volume (12 months)
- **PR Health** — Donut chart showing open vs closed PR ratio, merged-this-month stat
- **Ecosystem Repos** — Top starred repos with `nixos` topic + new repos this month
- **Community Buzz** — Trending r/NixOS posts + latest Stack Overflow questions
- **Google Trends** — CSV upload handler for search interest visualization
- **Export as PNG** — Screenshot the entire dashboard with one click
- **Historical Snapshots** — Stores metrics in localStorage for month-over-month deltas
- **Rate Limit Aware** — Warns when GitHub API quota is low, supports auth tokens

## Tech Stack

- **React 19** + TypeScript
- **Vite 7** for bundling
- **Tailwind CSS v4** for styling
- **Recharts** for data visualization
- **React Query** (`@tanstack/react-query`) for caching & refetching
- **Lucide React** for icons
- **html-to-image** for PNG export
- **react-hot-toast** for notifications

## Setup

```bash
# Clone and install
cd nix-dashboard
npm install

# (Optional) Copy env file and add your GitHub token
cp .env.example .env

# Start dev server
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_GITHUB_TOKEN` | — | GitHub personal access token for 5,000 req/hr (vs 60/hr unauthenticated) |
| `VITE_REFRESH_INTERVAL_MS` | off | Auto-refresh interval in ms (e.g., `300000` for 5 minutes) |

## CORS & Proxying

In development, Vite proxies Reddit and Repology requests to avoid CORS issues:

- `/reddit-api/*` → `https://www.reddit.com/*`
- `/repology-api/*` → `https://repology.org/*`

For production, you'll need a lightweight proxy. Example **Cloudflare Worker**:

```js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/reddit-api')) {
      const target = 'https://www.reddit.com' + url.pathname.replace('/reddit-api', '') + url.search;
      return fetch(target, { headers: { 'User-Agent': 'NixDashboard/1.0' } });
    }
    if (url.pathname.startsWith('/repology-api')) {
      const target = 'https://repology.org' + url.pathname.replace('/repology-api', '') + url.search;
      return fetch(target);
    }
    return fetch(request);
  }
};
```

## Data Sources

- [GitHub REST API](https://docs.github.com/en/rest) — Repo stats, commits, PRs, releases
- [Repology](https://repology.org/) — nixpkgs-unstable package count
- [Reddit JSON API](https://www.reddit.com/dev/api/) — r/NixOS subreddit stats
- [Stack Exchange API](https://api.stackexchange.com/) — Question counts and recent questions
- [Google Trends](https://trends.google.com/) — Manual CSV upload

## License

MIT
