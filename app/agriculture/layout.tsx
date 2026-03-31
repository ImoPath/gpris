import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Agriculture Metrics",
  description: "Agriculture pillar dashboard and metric breakdown.",
};

export default function AgricultureLayout({ children }: { children: ReactNode }) {
  return children;
}
