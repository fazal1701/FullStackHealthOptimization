"use client";
import * as React from "react";
import * as Select from "@radix-ui/react-select";
import type { DeviceLink } from "@/lib/types";

export interface VendorFilterProps {
  vendors: DeviceLink["vendor"][];
  value?: DeviceLink["vendor"] | "all";
  onChange?: (v: DeviceLink["vendor"] | "all") => void;
}

export const VendorFilter: React.FC<VendorFilterProps> = ({ vendors, value, onChange }) => {
  const [selected, setSelected] = React.useState<string>(value || "all");
  const handleChange = (v: string) => {
    setSelected(v);
    if (onChange) onChange(v as DeviceLink["vendor"] | "all");
  };
  return (
    <Select.Root value={value ?? selected} onValueChange={handleChange}>
      <Select.Trigger className="inline-flex items-center px-3 py-1 border rounded bg-white text-sm">
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="all">All Vendors</Select.Item>
        {vendors.map(v => (
          <Select.Item key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}; 