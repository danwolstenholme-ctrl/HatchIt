import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | HatchIt",
  description: "Privacy policy for HatchIt. Learn how we collect, use, and protect your data.",
};

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
