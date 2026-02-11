import { Github, ExternalLink } from 'lucide-react';

interface FooterProps {
  lastRefresh: Date | null;
}

export function Footer({ lastRefresh }: FooterProps) {
  const sources = [
    { name: 'GitHub', url: 'https://github.com/NixOS/nixpkgs' },
    { name: 'Repology', url: 'https://repology.org/repository/nix_unstable' },
    { name: 'Reddit', url: 'https://www.reddit.com/r/NixOS/' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com/questions/tagged/nixos' },
    { name: 'search.nixos.org', url: 'https://search.nixos.org/packages' },
  ];

  return (
    <footer className="border-t border-border mt-12 py-8">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">
              Data sources:
            </span>
            {sources.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-text-secondary hover:text-nix-light transition-colors"
              >
                {s.name === 'GitHub' && <Github className="w-3 h-3" />}
                {s.name !== 'GitHub' && <ExternalLink className="w-3 h-3" />}
                {s.name}
              </a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <p className="text-sm text-text-secondary">
              Built with 💙 for the Nix community
            </p>
            {lastRefresh && (
              <p className="text-xs text-text-secondary/60 mt-1">
                Last full refresh: {lastRefresh.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
