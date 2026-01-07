import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | HatchIt",
  description: "Terms of service for HatchIt. Read our usage terms, acceptable use policy, and service agreements.",
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
