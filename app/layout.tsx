import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: 'HatchIt - From Prompt to Production',
  description: 'AI-powered React component generator',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
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
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}