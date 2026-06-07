'use client';

import { ChatBubble, ChatBubbleAction, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import { ChatInput } from '@/components/ui/chat/chat-input';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import { Button } from '@/components/ui/button';
import { CopyIcon, CornerDownLeft, Download, RefreshCcw, Upload, Volume2, X } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './markdown-styles-1.module.css';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeDisplayBlock from '@/components/code-display-block';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChatSessionSidebar } from './chat-session-sidebar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import dynamic from 'next/dynamic';

const MapChart = dynamic(() => import('./MapChart'), { ssr: false });

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  convo_id?: string;
  action?: string;
  reportId?: string;
  hasMap?: boolean;
}

interface HeatmapData {
  country: string;
  average_risk: string;
  items: {
    item_name: string;
    status: string;
    risk_level: number;
    risk_category: string;
    variance_days: number;
    expected_date: string;
    actual_date: string;
    project_country: string;
  }[];
}

const ChatAiIcons = [
  {
    icon: CopyIcon,
    label: 'Copy',
  },
  {
    icon: RefreshCcw,
    label: 'Refresh',
  },
  {
    icon: Volume2,
    label: 'Volume',
  },
];

export default function ChatPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your AI assistant for procurement risk analysis. How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [heatmapDataMap, setHeatmapDataMap] = useState<Record<string, HeatmapData[]>>({});
  const [globalHeatmap, setGlobalHeatmap] = useState<HeatmapData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleNewChat = () => {
    setSessionId(null);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I am your AI assistant for procurement risk analysis. How can I assist you today?',
      },
    ]);
    setInput('');
    setHeatmapDataMap({});
    setGlobalHeatmap([]);
    setUploadStatus(null);
  };

  const handleDeleteSession = (deletedId: string) => {
    if (sessionId === deletedId) {
      handleNewChat();
    }
    setSidebarRefresh((n) => n + 1);
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Pre-fetch heatmap on mount so the map is always ready
  useEffect(() => {
    fetch('/api/heatmap')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setGlobalHeatmap(data); })
      .catch(() => {});
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating || !input) return;
      setIsGenerating(true);
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        if (data.session_id) {
          setSessionId(data.session_id);
          setSidebarRefresh((n) => n + 1);
        }

        const isRiskQuery = data.query_type && data.query_type !== 'general';
        const msgId = data.conversation_id || Date.now().toString();

        const botMessage: ChatMessage = {
          id: msgId,
          role: 'assistant',
          content: data.response,
          reportId: data.has_report ? data.report_session_id : undefined,
          hasMap: isRiskQuery,
        };
        setMessages((prev) => [...prev, botMessage]);

        if (isRiskQuery) {
          try {
            const hmRes = await fetch('/api/heatmap');
            if (hmRes.ok) {
              const hmData: HeatmapData[] = await hmRes.json();
              setGlobalHeatmap(hmData);
              setHeatmapDataMap((prev) => ({ ...prev, [msgId]: hmData }));
            }
          } catch (_) {}
        }
      } else {
        // Handle error
        const errorMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Error: ${data.error || 'Something went wrong'}`,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      // Handle network error
      const errorMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, there was an error connecting to the server.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleActionClick = async (action: string, messageIndex: number) => {
    console.log('Action clicked:', action, 'Message index:', messageIndex);
    if (action === 'Refresh') {
      setIsGenerating(true);
      try {
        // Reload logic would go here
      } catch (error) {
        console.error('Error reloading:', error);
      } finally {
        setIsGenerating(false);
      }
    }

    if (action === 'Copy') {
      const message = messages[messageIndex];
      if (message && message.role === 'assistant') {
        navigator.clipboard.writeText(message.content);
      }
    }
  };

  const loadSession = async (id: string) => {
    console.log('Loading session:', id);
    try {
      const response = await fetch(`/api/chat/${id}`);
      const data = await response.json();
      console.log('Session data:', data);

      // Transform the API response into chat messages
      const transformedMessages = data.conversations.flatMap((conv: any) =>
        conv.messages
          .map((msg: any, i: number) => {
            const messages = [];

            if (i === 0 && msg.user_query) {
              messages.push({
                id: Date.now().toString(),
                role: 'user',
                content: msg.user_query,
              });
            }

            if (msg.agent_output && !msg.agent_output.startsWith('```json\n')) {
              if (msg.agent_name === 'Chatbot' || msg.action === 'Political Risk JSON Data') {
                messages.push({
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: msg.agent_output,
                  convo_id: conv.conversation_id,
                  action: msg.action,
                });
              }
            }

            return messages;
          })
          .flat()
      );

      // Only update messages if we have some, otherwise keep the welcome message
      if (transformedMessages.length > 0) {
        setMessages(transformedMessages);
      }
      setSessionId(id);
      setIsGenerating(false); // Ensure generating state is reset
      setInput(''); // Clear any existing input

      // After transforming messages, check for Political Risk messages and fetch their heatmap data
      const politicalRiskMessages = transformedMessages.filter(
        (msg) => msg.action === 'Political Risk JSON Data' && msg.convo_id
      );

      // Fetch heatmap data for each relevant conversation
      for (const msg of politicalRiskMessages) {
        try {
          const response = await fetch(`/api/heatmap?conversation_id=${msg.convo_id}&session_id=${id}`);
          if (response.ok) {
            const data = await response.json();
            setHeatmapDataMap((prev) => ({
              ...prev,
              [msg.convo_id!]: data,
            }));
          }
        } catch (error) {
          console.error('Error fetching heatmap data:', error);
        }
      }
    } catch (error) {
      console.error('Error loading chat logs:', error);
    }
  };

  const handleDownloadReport = async (sessionIdForReport: string) => {
    try {
      const res = await fetch(`/api/reports/by-session/${sessionIdForReport}`);
      if (!res.ok) return;
      const reports = await res.json();
      if (!reports || reports.length === 0) return;
      const latestReport = reports[0];
      const dlRes = await fetch(`/api/reports/download/${latestReport.report_id}`);
      if (!dlRes.ok) return;
      const blob = await dlRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `navix_report_${latestReport.report_id.slice(0, 8)}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  const handleHeatmapClick = async (convoId: string) => {
    try {
      console.log('Heatmap clicked:', convoId, sessionId);
      const response = await fetch(`/api/heatmap?conversation_id=${convoId}&session_id=${sessionId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Heatmap data:', data);
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    }
  };

  const uploadFile = useCallback(async (file: File) => {
    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith('.xlsx') && !lowerName.endsWith('.xls')) {
      setUploadStatus({ type: 'error', message: 'Only .xlsx or .xls files are accepted.' });
      return;
    }
    setIsUploading(true);
    setUploadStatus(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload-schedule', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.status === 'success') {
        setUploadStatus({
          type: 'success',
          message: `Schedule uploaded successfully — ${data.items_loaded} item${data.items_loaded !== 1 ? 's' : ''} loaded. You can now ask risk questions about your real data.`,
        });
      } else {
        setUploadStatus({ type: 'error', message: data.error || 'Upload failed.' });
      }
    } catch (err) {
      setUploadStatus({ type: 'error', message: 'Network error — could not reach the server.' });
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <SidebarProvider>
      <ChatSessionSidebar
        variant="inset"
        onSessionSelect={loadSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        activeSessionId={sessionId}
        refreshTrigger={sidebarRefresh}
      />
      <SidebarInset>
        <main className="flex h-[90vh] px-2 pt-4 w-full flex-col items-center">
          <div className="flex items-center gap-2 px-4 pb-4 justify-start w-full">
            <SidebarTrigger />
            {!sessionId && <p className="text-lg font-bold">New Chat</p>}
            {sessionId && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  ID: {sessionId}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 h-4 w-4 cursor-pointer hover:bg-blue-300 hover:text-blue-700"
                    onClick={() => navigator.clipboard.writeText(sessionId)}
                  >
                    <CopyIcon className="h-3 w-3" />
                  </Button>
                </Badge>
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 w-full h-[60vh]">
            <ChatMessageList>
              {/* Messages */}
              {messages &&
                messages.map((message, index) => (
                  <ChatBubble key={index} variant={message.role == 'user' ? 'sent' : 'received'}>
                    <ChatBubbleAvatar src="" fallback={message.role == 'user' ? '👩🏻' : '🤖'} />
                    <ChatBubbleMessage>
                      {message.content.split('```').map((part: string, index: number) => {
                        if (index % 2 === 0) {
                          return message.role === 'user' ? (
                            <p key={index}>{part}</p>
                          ) : (
                            <div key={index} className={`!text-default ${styles['markdown-body']}`}>
                              <Markdown remarkPlugins={[remarkGfm]}>{part}</Markdown>
                            </div>
                          );
                        } else {
                          return (
                            <pre className="whitespace-pre-wrap pt-2" key={index}>
                              <CodeDisplayBlock code={part} lang="" />
                            </pre>
                          );
                        }
                      })}

                      {message.hasMap && globalHeatmap.length > 0 && (
                        <div className="mt-4 border rounded-xl p-3 bg-muted/30">
                          <MapChart
                            setTooltipContent={() => {}}
                            breakdown={globalHeatmap}
                          />
                        </div>
                      )}

                      {message.role === 'assistant' && (
                        <div className="flex items-center mt-1.5 gap-1 flex-wrap">
                          {!isGenerating && (
                            <>
                              {ChatAiIcons.map((icon, iconIndex) => {
                                const Icon = icon.icon;
                                return (
                                  <ChatBubbleAction
                                    variant="outline"
                                    className="size-5"
                                    key={iconIndex}
                                    icon={<Icon className="size-3" />}
                                    onClick={() => handleActionClick(icon.label, index)}
                                  />
                                );
                              })}
                              {message.reportId && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-xs flex items-center gap-1 ml-1"
                                  onClick={() => handleDownloadReport(message.reportId!)}
                                >
                                  <Download className="size-3" />
                                  Download Report
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))}

              {/* Loading */}
              {isGenerating && (
                <ChatBubble variant="received">
                  <ChatBubbleAvatar src="" fallback="🤖" />
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              )}
            </ChatMessageList>
          </ScrollArea>
          {/* Form and Footer fixed at the bottom */}
          <div className="w-full px-4 pb-4 space-y-2">
            {/* Upload zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-2 cursor-pointer transition-colors text-sm
                ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : 'border-muted-foreground/30 hover:border-muted-foreground/60 hover:bg-muted/30'}
                ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Upload className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {isUploading ? 'Uploading…' : 'Upload equipment schedule (.xlsx / .xls) — drag & drop or click'}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>

            {/* Upload status */}
            {uploadStatus && (
              <div
                className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm
                  ${uploadStatus.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200'}`}
              >
                <span className="flex-1">{uploadStatus.message}</span>
                <button onClick={() => setUploadStatus(null)} className="shrink-0 mt-0.5 opacity-60 hover:opacity-100">
                  <X className="size-3.5" />
                </button>
              </div>
            )}

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            >
              <ChatInput
                value={input}
                onKeyDown={onKeyDown}
                onChange={handleInputChange}
                placeholder="Type your message here..."
                className="rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0 dark:bg-input/30">
                <Button disabled={!input || isGenerating} type="submit" size="sm" className="ml-auto gap-1.5">
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
