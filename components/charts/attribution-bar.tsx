"use client";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { FeatureAttribution } from "@/lib/types";

export interface AttributionBarProps {
  attributions: FeatureAttribution[];
  maxFeatures?: number;
}

const COLORS = {
  pos: "#22c55e",
  neg: "#ef4444"
};

export const AttributionBar: React.FC<AttributionBarProps> = ({ attributions, maxFeatures = 8 }) => {
  const data = attributions.slice(0, maxFeatures).map(a => ({
    feature: a.feature,
    contribution: a.contribution,
    direction: a.direction
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart layout="vertical" data={data} margin={{ left: 24, right: 24, top: 8, bottom: 8 }}>
        <XAxis type="number" hide domain={[Math.min(-1, ...data.map(d => d.contribution)), Math.max(1, ...data.map(d => d.contribution))]} />
        <YAxis type="category" dataKey="feature" width={120} />
        <Tooltip formatter={(v: number) => v.toFixed(2)} />
        <Bar dataKey="contribution" isAnimationActive radius={[4, 4, 4, 4]}>
          {data.map((entry, idx) => (
            <Cell key={idx} fill={COLORS[entry.direction]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}; 