'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, MessageSquare, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

type ThinkingLog = {
  id: string;
  session_id: string;
  first_query: string;
};

function formatDate(id: string): string {
  return '';
}

export default function ThinkingLogsPage() {
  const [data, setData] = useState<ThinkingLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/thinking-logs');
        if (!response.ok) throw new Error('Failed to fetch thinking logs');
        const result = await response.json();
        setData(result.sessions || []);
      } catch (error) {
        console.error('Failed to fetch thinking logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = data.filter(
    (log) =>
      log.first_query?.toLowerCase().includes(search.toLowerCase()) ||
      log.session_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Thinking Logs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse every agent reasoning trace captured during your sessions.
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FlaskConical className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">{search ? 'No results found' : 'No thinking logs yet'}</p>
          <p className="text-sm mt-1">
            {search ? 'Try a different search term.' : 'Send a message to generate agent reasoning traces.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((log, i) => (
            <Link
              key={log.session_id}
              href={`/thinking-logs/${log.session_id}`}
              className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border bg-card hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">
                    {log.first_query || 'Untitled session'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate font-mono">
                    {log.session_id}
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Badge variant="outline" className="text-xs hidden sm:flex">
                  Session {i + 1}
                </Badge>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  <FlaskConical className="w-3.5 h-3.5" />
                  View trace
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
