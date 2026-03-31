import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RootLayout } from "../src/app/layouts/RootLayout";
import "../src/styles/index.css";

export const metadata: Metadata = {
  title: "Kenya National Projects Dashboard",
  description: "Kenya National Projects Dashboard",
};

export default function AppLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
