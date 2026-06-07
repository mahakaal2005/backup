import * as React from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from '@/components/ui/sidebar';

interface Session {
  session_id: string;
  user_query: string;
  session_date: string;
}

interface ChatSessionSidebarProps {
  variant?: 'inset' | 'overlay';
  onSessionSelect: (sessionId: string) => void;
  onNewChat?: () => void;
  onDeleteSession?: (sessionId: string) => void;
  activeSessionId?: string | null;
  refreshTrigger?: number;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr.replace(' ', 'T'));
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return dateStr.slice(0, 10);
  }
}

export function ChatSessionSidebar({
  variant,
  onSessionSelect,
  onNewChat,
  onDeleteSession,
  activeSessionId,
  refreshTrigger,
}: ChatSessionSidebarProps) {
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const fetchSessions = React.useCallback(async () => {
    try {
      const response = await fetch('/api/sessions');
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSessions();
  }, [fetchSessions, refreshTrigger]);

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setDeletingId(sessionId);
    try {
      await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      setSessions((prev) => prev.filter((s) => s.session_id !== sessionId));
      onDeleteSession?.(sessionId);
    } catch (err) {
      console.error('Failed to delete session:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Sidebar {...{ variant }}>
      <SidebarContent>
        <div className="px-3 pt-3 pb-2 border-b">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        <ScrollArea className="flex-1 px-2 py-2">
          {isLoading ? (
            <div className="space-y-1 px-2 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-2 py-2 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No sessions yet</p>
              <p className="text-xs mt-1">Start a chat to create one</p>
            </div>
          ) : (
            <div className="space-y-0.5 py-1">
              {sessions.map((session) => {
                const isActive = session.session_id === activeSessionId;
                return (
                  <div
                    key={session.session_id}
                    className={`group relative flex items-center rounded-lg transition-colors ${
                      isActive ? 'bg-primary/10' : 'hover:bg-muted/60'
                    }`}
                  >
                    <button
                      onClick={() => onSessionSelect(session.session_id)}
                      className="flex-1 text-left px-3 py-2.5 min-w-0"
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isActive ? 'text-primary' : 'opacity-40 group-hover:opacity-70'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium truncate leading-snug pr-6 ${
                              isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                            }`}
                          >
                            {session.user_query || 'Untitled session'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(session.session_date)}
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={(e) => handleDelete(e, session.session_id)}
                      disabled={deletingId === session.session_id}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
                      title="Delete chat"
                    >
                      {deletingId === session.session_id ? (
                        <span className="w-3.5 h-3.5 block border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
