import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Hatch",
  description: "Data sovereignty and privacy protocols for the Hatch System.",
};

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
