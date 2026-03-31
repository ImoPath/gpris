import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Digital Superhighway and Creative Economy",
  description:
    "Live dashboard for digital hubs, public Wi-Fi rollout, county performance map, and ICT project execution.",
};

export default function DigitalSuperhighwayLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
