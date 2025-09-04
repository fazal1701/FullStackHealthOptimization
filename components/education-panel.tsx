import React from 'react';

export interface EvidenceEntry {
  summary: string;
  citation: string;
  url: string;
  details?: string; // For clinician mode: effect sizes, NNT/NNH, confidence, etc.
}

export interface EducationPanelProps {
  mode: 'patient' | 'clinician';
  evidence: EvidenceEntry[];
}

export const EducationPanel: React.FC<EducationPanelProps> = ({ mode, evidence }) => (
  <section className="rounded-lg border bg-muted/40 p-4 space-y-4">
    <h2 className="font-semibold text-lg mb-2">What affects your score?</h2>
    <ul className="space-y-3">
      {evidence.map((entry, i) => (
        <li key={i} className="flex flex-col gap-1">
          <span className="text-base">
            {mode === 'patient' ? entry.summary : (
              <>
                {entry.summary}
                {entry.details && (
                  <span className="ml-2 text-xs text-muted-foreground">({entry.details})</span>
                )}
              </>
            )}
          </span>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-700 underline hover:text-blue-900"
          >
            {entry.citation}
          </a>
        </li>
      ))}
    </ul>
  </section>
); 