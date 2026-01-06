import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap | HatchIt",
  description: "See what we're building, what's shipped, and what's coming next.",
};

export default function RoadmapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
