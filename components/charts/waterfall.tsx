"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import type { FeatureAttribution } from "@/lib/types";

export interface SHAPWaterfallProps {
  attributions: FeatureAttribution[];
  baseline: number;
  score: number;
}

export const SHAPWaterfall: React.FC<SHAPWaterfallProps> = ({ attributions, baseline, score }) => {
  // Compute cumulative values for waterfall
  let cumulative = baseline;
  const data = [
    { name: "Baseline", value: baseline, color: "#a3a3a3" },
    ...attributions.map((a, i) => {
      cumulative += a.contribution;
      return {
        name: a.feature,
        value: a.contribution,
        color: a.direction === "pos" ? "#22c55e" : "#ef4444",
        cumulative: cumulative
      };
    }),
    { name: "Score", value: score, color: "#2563eb" }
  ];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart layout="vertical" data={data} margin={{ left: 32, right: 32, top: 8, bottom: 8 }}>
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={120} />
        <Tooltip formatter={(v: number) => v.toFixed(2)} />
        <Bar dataKey="value" isAnimationActive radius={[4, 4, 4, 4]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color} />
          ))}
          <LabelList dataKey="value" position="right" formatter={(v: number) => v.toFixed(2)} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}; 