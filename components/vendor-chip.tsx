import React from "react";
import Image from "next/image";
import type { DeviceLink } from "@/lib/types";

export interface VendorChipProps {
  vendor: DeviceLink["vendor"];
  status: DeviceLink["status"];
  quality?: number;
}

const VENDOR_LOGOS: Record<DeviceLink["vendor"], string> = {
  fitbit: "/images/device-logos/fitbit.svg",
  oura: "/images/device-logos/oura.svg",
  whoop: "/images/device-logos/whoop.svg",
  garmin: "/images/device-logos/garmin.svg",
  apple: "/images/device-logos/apple.svg"
};

const STATUS_COLORS: Record<DeviceLink["status"], string> = {
  linked: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800"
};

export const VendorChip: React.FC<VendorChipProps> = ({ vendor, status, quality }) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
    <Image src={VENDOR_LOGOS[vendor]} alt={vendor} width={24} height={24} />
    <span className="capitalize">{vendor}</span>
    {typeof quality === "number" && (
      <span className="ml-1 text-xs text-gray-500">{Math.round(quality * 100)}%</span>
    )}
    <span className="ml-2">{status}</span>
  </span>
);