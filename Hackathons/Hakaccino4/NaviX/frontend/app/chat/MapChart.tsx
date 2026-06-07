'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EquipmentItem {
  item_name: string;
  status: string;
  risk_level: number;
  risk_category: string;
  variance_days: number;
  expected_date: string;
  actual_date: string;
  project_country: string;
}

interface CountryData {
  country: string;
  average_risk: string;
  items: EquipmentItem[];
}

const RISK_CONFIG: Record<number, { bg: string; border: string; text: string; label: string }> = {
  5: { bg: 'bg-red-100',    border: 'border-red-500',    text: 'text-red-800',    label: 'Critical' },
  4: { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-800', label: 'High' },
  3: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-800', label: 'Medium' },
  2: { bg: 'bg-green-100',  border: 'border-green-500',  text: 'text-green-800',  label: 'Low' },
  1: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', label: 'Minimal' },
};

const BADGE_CONFIG: Record<string, string> = {
  High:   'bg-red-100 text-red-800 border border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  Low:    'bg-green-100 text-green-800 border border-green-200',
};

function getRiskConfig(risk: number) {
  return RISK_CONFIG[Math.round(risk)] ?? RISK_CONFIG[1];
}

const LEGEND = [
  { level: 5, label: 'Critical (5)' },
  { level: 4, label: 'High (4)' },
  { level: 3, label: 'Medium (3)' },
  { level: 2, label: 'Low (2)' },
  { level: 1, label: 'Minimal (1)' },
];

const DOT_BG: Record<number, string> = {
  5: 'bg-red-500',
  4: 'bg-orange-500',
  3: 'bg-yellow-400',
  2: 'bg-green-500',
  1: 'bg-emerald-400',
};

export default function MapChart({
  breakdown,
}: {
  setTooltipContent: (s: string) => void;
  breakdown: CountryData[];
}) {
  const [selected, setSelected] = useState<CountryData | null>(null);

  const sorted = [...breakdown].sort(
    (a, b) => parseInt(b.average_risk) - parseInt(a.average_risk)
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-foreground">Country Risk Heatmap</p>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {LEGEND.map(({ level, label }) => (
            <div key={level} className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded-full ${DOT_BG[level]}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {sorted.map((c) => {
          const risk = parseInt(c.average_risk);
          const cfg = getRiskConfig(risk);
          return (
            <button
              key={c.country}
              onClick={() => setSelected(c)}
              className={`
                ${cfg.bg} ${cfg.border} ${cfg.text}
                border-2 rounded-lg p-2.5 text-left
                transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                cursor-pointer
              `}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="text-xs font-semibold leading-tight">{c.country}</span>
                <span className={`${DOT_BG[risk]} w-2.5 h-2.5 rounded-full shrink-0 mt-0.5`} />
              </div>
              <div className="mt-1.5 flex items-center gap-1">
                <span className="text-lg font-bold leading-none">{risk}</span>
                <span className="text-xs opacity-70">/5</span>
              </div>
              <div className="text-xs opacity-70 mt-0.5">
                {c.items.length} item{c.items.length !== 1 ? 's' : ''}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Click any country card to see equipment details
      </p>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="!max-w-[760px] !w-11/12">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selected?.country}
              {selected && (() => {
                const risk = parseInt(selected.average_risk);
                const cfg = getRiskConfig(risk);
                return (
                  <span className={`${cfg.bg} ${cfg.text} px-2 py-0.5 rounded text-sm font-bold border ${cfg.border}`}>
                    Risk {selected.average_risk}/5 · {cfg.label}
                  </span>
                );
              })()}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <ScrollArea className="max-h-[480px] pr-2">
              <p className="text-sm text-muted-foreground mb-3">
                {selected.items.length} equipment item{selected.items.length !== 1 ? 's' : ''} sourced from this country
              </p>
              <div className="space-y-2">
                {selected.items.map((item, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-3 ${
                      item.risk_category === 'High' ? 'bg-red-50 border-red-200' :
                      item.risk_category === 'Medium' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{item.item_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${BADGE_CONFIG[item.risk_category] ?? ''}`}>
                        {item.risk_category}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-2 text-xs text-muted-foreground">
                      <span>Status: <span className="font-medium text-foreground capitalize">{item.status.replace('_', ' ')}</span></span>
                      <span>Project: <span className="font-medium text-foreground">{item.project_country}</span></span>
                      <span>Expected: <span className="font-medium text-foreground">{item.expected_date}</span></span>
                      <span>Actual: <span className="font-medium text-foreground">{item.actual_date}</span></span>
                      <span className={`col-span-2 font-medium ${item.variance_days > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.variance_days > 0
                          ? `+${item.variance_days} day${item.variance_days !== 1 ? 's' : ''} late`
                          : 'On schedule'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
