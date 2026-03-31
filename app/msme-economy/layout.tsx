import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "MSME Economy Metrics",
  description: "MSME pillar dashboard with metrics and project progress.",
};

export default function MsmeEconomyLayout({ children }: { children: ReactNode }) {
  return children;
}
