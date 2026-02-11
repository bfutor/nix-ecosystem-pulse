import { AlertTriangle } from 'lucide-react';

export function ErrorBadge({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-negative/10 border border-negative/30 px-3 py-2 text-sm text-negative">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span className="truncate">{message}</span>
    </div>
  );
}
