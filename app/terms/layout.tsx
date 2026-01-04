import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Hatch",
  description: "Legal protocols and usage terms for the Hatch System.",
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
