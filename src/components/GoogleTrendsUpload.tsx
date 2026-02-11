import { useState, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Upload, TrendingUp } from 'lucide-react';
import { COLORS } from '../config';

interface TrendDataPoint {
  month: string;
  interest: number;
}

function parseCSV(text: string): TrendDataPoint[] {
  const lines = text.split('\n');
  // Find the data start (skip Google Trends headers)
  let dataStart = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('Month') || lines[i].startsWith('Week')) {
      dataStart = i + 1;
      break;
    }
  }

  const result: TrendDataPoint[] = [];
  for (let i = dataStart; i < lines.length; i++) {
    const parts = lines[i].split(',');
    if (parts.length >= 2) {
      const month = parts[0].trim();
      const val = parseInt(parts[1].trim(), 10);
      if (month && !isNaN(val)) {
        result.push({ month, interest: val });
      }
    }
  }
  return result;
}

export function GoogleTrendsUpload() {
  const [data, setData] = useState<TrendDataPoint[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      setData(parsed);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.endsWith('.csv')) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <section className="rounded-xl border border-border bg-bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-nix-light" />
        <h2 className="text-lg font-semibold font-mono text-text-primary">
          Search Interest Over Time
        </h2>
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={COLORS.border}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: COLORS.textSecondary, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: COLORS.border }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: COLORS.textSecondary, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '8px',
                color: COLORS.textPrimary,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '13px',
              }}
            />
            <Line
              type="monotone"
              dataKey="interest"
              stroke={COLORS.nixLightBlue}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: COLORS.nixLightBlue }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed transition-colors ${
            isDragging
              ? 'border-nix-light bg-nix-light/5'
              : 'border-border hover:border-text-secondary'
          }`}
        >
          <Upload className="w-8 h-8 text-text-secondary mb-3" />
          <p className="text-sm text-text-secondary text-center">
            Paste exported CSV from Google Trends for &quot;NixOS&quot; to
            populate
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Drag & drop a .csv file here, or{' '}
            <label className="text-nix-light cursor-pointer hover:underline">
              browse
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleInputChange}
              />
            </label>
          </p>
        </div>
      )}
    </section>
  );
}
