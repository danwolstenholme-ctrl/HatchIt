import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'HatchIt - From Prompt to Production',
  description: 'AI-powered React component generator',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}