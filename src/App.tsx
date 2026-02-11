import { useState, useEffect, useCallback } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import {
  Star,
  Users,
  Package,
  GitPullRequest,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

import { STALE_TIME, REFRESH_INTERVAL_MS } from './config';
import {
  fetchRepoStats,
  fetchContributorCount,
  fetchCommitActivity,
  fetchPRCounts,
  fetchTopNixosRepos,
  fetchNewNixRepos,
  fetchRedditAbout,
  fetchRedditHot,
  fetchStackOverflowCounts,
  fetchRecentQuestions,
  fetchPackageCount,
  getLatestRateLimit,
  saveSnapshot,
  loadSnapshots,
  fetchRepoRankings,
} from './services/nixData';

import { Header } from './components/Header';
import { MetricCard } from './components/MetricCard';
import { CommitChart } from './components/CommitChart';
import { PRHealthChart } from './components/PRHealthChart';
import { RepoList } from './components/EcosystemRepos';
import { RedditHot, SOQuestions } from './components/CommunityBuzz';
import { GoogleTrendsUpload } from './components/GoogleTrendsUpload';
import { RepoRankingTable } from './components/RepoRanking';
import { Footer } from './components/Footer';
import { RateLimitBanner } from './components/RateLimitBanner';

import type { RateLimitInfo } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function Dashboard() {
  const qc = useQueryClient();
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);

  // ── Queries ────────────────────────────────────────────────────

  const repoStats = useQuery({
    queryKey: ['repoStats'],
    queryFn: fetchRepoStats,
  });

  const contributors = useQuery({
    queryKey: ['contributors'],
    queryFn: fetchContributorCount,
  });

  const commitActivity = useQuery({
    queryKey: ['commitActivity'],
    queryFn: fetchCommitActivity,
  });

  const prCounts = useQuery({
    queryKey: ['prCounts'],
    queryFn: fetchPRCounts,
  });

  const topRepos = useQuery({
    queryKey: ['topRepos'],
    queryFn: fetchTopNixosRepos,
  });

  const newRepos = useQuery({
    queryKey: ['newRepos'],
    queryFn: fetchNewNixRepos,
  });

  const redditAbout = useQuery({
    queryKey: ['redditAbout'],
    queryFn: fetchRedditAbout,
  });

  const redditHot = useQuery({
    queryKey: ['redditHot'],
    queryFn: fetchRedditHot,
  });

  const soCounts = useQuery({
    queryKey: ['soCounts'],
    queryFn: fetchStackOverflowCounts,
  });

  const soQuestions = useQuery({
    queryKey: ['soQuestions'],
    queryFn: fetchRecentQuestions,
  });

  const packageCount = useQuery({
    queryKey: ['packageCount'],
    queryFn: fetchPackageCount,
  });

  const repoRankings = useQuery({
    queryKey: ['repoRankings'],
    queryFn: fetchRepoRankings,
    staleTime: 30 * 60 * 1000, // 30 min — this makes many API calls
  });

  // ── Rate limit polling ─────────────────────────────────────────

  useEffect(() => {
    const interval = setInterval(() => {
      const rl = getLatestRateLimit();
      if (rl) setRateLimit(rl);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ── Auto-refresh ───────────────────────────────────────────────

  useEffect(() => {
    if (!REFRESH_INTERVAL_MS) return;
    const interval = setInterval(() => {
      qc.invalidateQueries();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [qc]);

  // ── Save snapshots when data arrives ───────────────────────────

  useEffect(() => {
    if (
      repoStats.data &&
      contributors.data &&
      packageCount.data &&
      prCounts.data &&
      redditAbout.data &&
      soCounts.data
    ) {
      const now = new Date();
      const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      saveSnapshot({
        date: dateKey,
        stars: repoStats.data.stars,
        contributors: contributors.data.total,
        packages: packageCount.data.packageCount,
        openPRs: prCounts.data.open,
        mergedThisMonth: prCounts.data.mergedThisMonth,
        redditSubscribers: redditAbout.data.subscribers,
        soQuestions: soCounts.data.total,
      });
      setLastRefresh(now);
    }
  }, [
    repoStats.data,
    contributors.data,
    packageCount.data,
    prCounts.data,
    redditAbout.data,
    soCounts.data,
  ]);

  // ── Deltas from localStorage snapshots ─────────────────────────

  const snapshots = loadSnapshots();
  const prevSnapshot = snapshots.length >= 2 ? snapshots[snapshots.length - 2] : null;

  // ── Refresh handler ────────────────────────────────────────────

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await qc.invalidateQueries();
    // Wait a bit for queries to start refetching
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success(
        `Data refreshed at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        {
          style: {
            background: '#161b22',
            color: '#e6edf3',
            border: '1px solid #30363d',
          },
          iconTheme: { primary: '#3fb950', secondary: '#161b22' },
        }
      );
    }, 2000);
  }, [qc]);

  const errMsg = (e: Error | null) => (e ? e.message : null);

  return (
    <div className="min-h-screen bg-bg" id="dashboard-root">
      <Toaster position="bottom-right" />

      <RateLimitBanner rateLimit={rateLimit} />

      <Header
        lastRefresh={lastRefresh}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        rateLimitRemaining={rateLimit?.remaining ?? null}
      />

      <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
        {/* ── Section 1: Key Metrics ─────────────────────────────── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-4">
            Key Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <MetricCard
              title="Nixpkgs Stars"
              value={repoStats.data?.stars ?? null}
              icon={<Star className="w-5 h-5" />}
              isLoading={repoStats.isLoading}
              error={errMsg(repoStats.error)}
              delta={
                prevSnapshot && repoStats.data
                  ? repoStats.data.stars - prevSnapshot.stars
                  : null
              }
              deltaLabel="MoM"
            />
            <MetricCard
              title="Contributors"
              value={contributors.data?.total ?? null}
              icon={<Users className="w-5 h-5" />}
              subtitle="~estimate (repo too large for API)"
              isLoading={contributors.isLoading}
              error={errMsg(contributors.error)}
              delta={
                prevSnapshot && contributors.data
                  ? contributors.data.total - prevSnapshot.contributors
                  : null
              }
              deltaLabel="MoM"
            />
            <MetricCard
              title="Packages"
              value={packageCount.data?.packageCount ?? null}
              icon={<Package className="w-5 h-5" />}
              subtitle={
                packageCount.data?.source === 'fallback'
                  ? '(estimate)'
                  : 'nixpkgs-unstable'
              }
              isLoading={packageCount.isLoading}
              error={errMsg(packageCount.error)}
              delta={
                prevSnapshot && packageCount.data
                  ? packageCount.data.packageCount - prevSnapshot.packages
                  : null
              }
              deltaLabel="MoM"
            />
            <MetricCard
              title="Open PRs"
              value={prCounts.data?.open ?? null}
              icon={<GitPullRequest className="w-5 h-5" />}
              subtitle={
                prCounts.data
                  ? `${(prCounts.data.mergedThisMonth ?? 0).toLocaleString()} merged this month`
                  : undefined
              }
              isLoading={prCounts.isLoading}
              error={errMsg(prCounts.error)}
            />
            <MetricCard
              title="r/NixOS"
              value={redditAbout.data?.subscribers ?? null}
              icon={<MessageSquare className="w-5 h-5" />}
              subtitle={
                redditAbout.data
                  ? `${(redditAbout.data.activeUsers ?? 0).toLocaleString()} online`
                  : undefined
              }
              isLoading={redditAbout.isLoading}
              error={errMsg(redditAbout.error)}
              delta={
                prevSnapshot && redditAbout.data
                  ? redditAbout.data.subscribers - prevSnapshot.redditSubscribers
                  : null
              }
              deltaLabel="MoM"
            />
            <MetricCard
              title="SO Questions"
              value={soCounts.data?.total ?? null}
              icon={<HelpCircle className="w-5 h-5" />}
              subtitle={
                soCounts.data
                  ? `nix: ${(soCounts.data.nix ?? 0).toLocaleString()} · nixos: ${(soCounts.data.nixos ?? 0).toLocaleString()}`
                  : undefined
              }
              isLoading={soCounts.isLoading}
              error={errMsg(soCounts.error)}
              delta={
                prevSnapshot && soCounts.data
                  ? soCounts.data.total - prevSnapshot.soQuestions
                  : null
              }
              deltaLabel="MoM"
            />
          </div>
        </section>

        {/* ── Section 2: Commit Activity ─────────────────────────── */}
        <CommitChart
          data={commitActivity.data}
          isLoading={commitActivity.isLoading}
          error={errMsg(commitActivity.error)}
          onRefresh={() => qc.invalidateQueries({ queryKey: ['commitActivity'] })}
        />

        {/* ── Section 2b: Ranking Among Top OSS Projects ──────────── */}
        <RepoRankingTable
          data={repoRankings.data}
          isLoading={repoRankings.isLoading}
          error={errMsg(repoRankings.error)}
          onRefresh={() => qc.invalidateQueries({ queryKey: ['repoRankings'] })}
        />

        {/* ── Section 3: Community & Ecosystem ───────────────────── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-4">
            Community & Ecosystem
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RepoList
              title="Top Ecosystem Repos"
              subtitle="Most starred repos with the nixos topic"
              repos={topRepos.data}
              isLoading={topRepos.isLoading}
              error={errMsg(topRepos.error)}
              onRefresh={() => qc.invalidateQueries({ queryKey: ['topRepos'] })}
            />
            <RepoList
              title="New This Month"
              subtitle="Recently created repos with the nix topic"
              repos={newRepos.data}
              isLoading={newRepos.isLoading}
              error={errMsg(newRepos.error)}
              onRefresh={() => qc.invalidateQueries({ queryKey: ['newRepos'] })}
              showCreatedDate
            />
          </div>
        </section>

        {/* ── Section 4: Community Buzz ───────────────────────────── */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-4">
            Community Buzz
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RedditHot
              posts={redditHot.data}
              isLoading={redditHot.isLoading}
              error={errMsg(redditHot.error)}
              onRefresh={() => qc.invalidateQueries({ queryKey: ['redditHot'] })}
            />
            <SOQuestions
              questions={soQuestions.data}
              isLoading={soQuestions.isLoading}
              error={errMsg(soQuestions.error)}
              onRefresh={() =>
                qc.invalidateQueries({ queryKey: ['soQuestions'] })
              }
            />
          </div>
        </section>

        {/* ── Section 5: PR & Issue Health ────────────────────────── */}
        <PRHealthChart
          data={prCounts.data}
          isLoading={prCounts.isLoading}
          error={errMsg(prCounts.error)}
          onRefresh={() => qc.invalidateQueries({ queryKey: ['prCounts'] })}
        />

        {/* ── Section 6: Search Interest ─────────────────────────── */}
        <GoogleTrendsUpload />
      </main>

      <Footer lastRefresh={lastRefresh} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
