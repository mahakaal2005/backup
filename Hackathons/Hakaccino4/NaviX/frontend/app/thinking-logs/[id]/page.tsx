'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Bot, BrainIcon, ChevronDown, ScrollTextIcon, User, Workflow } from 'lucide-react';
import { useParams } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from '../../chat/markdown-styles.module.css';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

const isBrowser = typeof window !== 'undefined';

const STAGE_COLORS: Record<string, string> = {
  data_retrieval:     'bg-blue-100 text-blue-800 border-blue-300',
  data_analysis:      'bg-indigo-100 text-indigo-800 border-indigo-300',
  risk_calculation:   'bg-rose-100 text-rose-800 border-rose-300',
  analysis_complete:  'bg-green-100 text-green-800 border-green-300',
  analysis_start:     'bg-cyan-100 text-cyan-800 border-cyan-300',
  search:             'bg-yellow-100 text-yellow-800 border-yellow-300',
  web_search:         'bg-yellow-100 text-yellow-800 border-yellow-300',
  categorization:     'bg-purple-100 text-purple-800 border-purple-300',
  synthesis_start:    'bg-teal-100 text-teal-800 border-teal-300',
  report_generation:  'bg-orange-100 text-orange-800 border-orange-300',
  report_complete:    'bg-green-100 text-green-800 border-green-300',
  document_creation:  'bg-slate-100 text-slate-800 border-slate-300',
  document_saved:     'bg-green-100 text-green-800 border-green-300',
  general_query:      'bg-gray-100 text-gray-800 border-gray-300',
  response:           'bg-violet-100 text-violet-800 border-violet-300',
};

const AGENT_COLORS: Record<string, { dot: string; label: string; border: string }> = {
  SCHEDULER_AGENT:        { dot: 'bg-blue-500',    label: 'text-blue-600',    border: 'border-blue-200' },
  POLITICAL_RISK_AGENT:   { dot: 'bg-rose-500',    label: 'text-rose-600',    border: 'border-rose-200' },
  TARIFF_RISK_AGENT:      { dot: 'bg-amber-500',   label: 'text-amber-600',   border: 'border-amber-200' },
  LOGISTICS_RISK_AGENT:   { dot: 'bg-teal-500',    label: 'text-teal-600',    border: 'border-teal-200' },
  REPORTING_AGENT:        { dot: 'bg-violet-500',  label: 'text-violet-600',  border: 'border-violet-200' },
  ASSISTANT_AGENT:        { dot: 'bg-green-500',   label: 'text-green-600',   border: 'border-green-200' },
};

const getStageClass = (stage: string) =>
  STAGE_COLORS[stage] ?? 'bg-gray-100 text-gray-800 border-gray-300';

const getAgentStyle = (name: string) =>
  AGENT_COLORS[name] ?? { dot: 'bg-gray-400', label: 'text-gray-600', border: 'border-gray-200' };

const MotionChevron = motion(ChevronDown);

const CollapsibleSection = ({ thought }: { thought: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!thought.thinking_stage_output) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="w-full flex items-center justify-between mt-2 cursor-pointer">
          <span className="flex items-center gap-2 text-xs">
            <ScrollTextIcon className="w-3 h-3" />
            Show Output
          </span>
          <MotionChevron className="h-3 w-3" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} />
        </Button>
      </CollapsibleTrigger>
      <AnimatePresence initial={false}>
        {isOpen && (
          <CollapsibleContent forceMount>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`${styles['markdown-body']} bg-muted border mt-2 rounded-lg p-3 !text-foreground text-sm overflow-hidden`}
            >
              <Markdown remarkPlugins={[remarkGfm]}>{thought.thinking_stage_output}</Markdown>
            </motion.div>
          </CollapsibleContent>
        )}
      </AnimatePresence>
    </Collapsible>
  );
};

const ThoughtTimeline = ({ thoughts }: { thoughts: any[] }) => (
  <div className="relative pl-6 mt-3 space-y-4">
    <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
    {thoughts.map((thought: any, i: number) => (
      <motion.div
        key={i}
        className="relative"
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05, duration: 0.25 }}
      >
        <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-muted-foreground/40 border border-muted-foreground/30" />
        <div className="bg-background border rounded-lg p-3 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <Badge
              variant="outline"
              className={`text-xs px-2 py-0.5 border ${getStageClass(thought.thinking_stage)}`}
            >
              <Workflow className="w-3 h-3 mr-1" />
              {thought.thinking_stage}
            </Badge>
            <span className="text-xs text-muted-foreground">{thought.created_date}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{thought.thought_content}</p>
          <CollapsibleSection thought={thought} />
        </div>
      </motion.div>
    ))}
  </div>
);

export default function ThinkingLogPage() {
  const [thinkingData, setThinkingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchThinkingLogs = async () => {
      if (!params.id) return;
      try {
        const response = await fetch(`/api/thinking-logs/${params.id}`);
        const data = await response.json();
        setThinkingData(data);
      } catch (error) {
        console.error('Error fetching thinking logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchThinkingLogs();
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full px-8 py-8 space-y-4">
        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        <div className="space-y-3 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!thinkingData || !thinkingData.conversations?.length) {
    return (
      <div className="w-full px-8 py-8">
        <h1 className="text-xl font-semibold">Thinking Process</h1>
        <p className="text-muted-foreground mt-2">No thinking logs found for this session.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-xl font-bold">Thinking Process</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Multi-agent reasoning trace</p>
      </motion.div>

      <div className="mt-6 space-y-6">
        {thinkingData.conversations.map((conversation: any, cIdx: number) => (
          <motion.div
            key={conversation.conversation_id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: cIdx * 0.08, duration: 0.4 }}
            className="border rounded-xl bg-muted/40 p-4"
          >
            <div className="flex items-center gap-2 mb-4 text-sm font-semibold">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Query:</span>
              <span>{conversation.user_query}</span>
            </div>

            <div className="space-y-5">
              {conversation.agents.map((agent: any, aIdx: number) => {
                const agentStyle = getAgentStyle(agent.agent_name);
                return (
                  <motion.div
                    key={`${conversation.conversation_id}-${agent.agent_name}`}
                    className={`bg-card border ${agentStyle.border} rounded-xl p-4 shadow-sm`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: cIdx * 0.08 + aIdx * 0.06, duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${agentStyle.dot}`} />
                      <Bot className={`w-4 h-4 ${agentStyle.label}`} />
                      <span className={`text-sm font-bold ${agentStyle.label}`}>{agent.agent_name}</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        {agent.thoughts.length} step{agent.thoughts.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <ThoughtTimeline thoughts={agent.thoughts} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
