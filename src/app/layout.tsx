import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
};

export const metadata: Metadata = {
  title: "MyReply — Умные ответы на отзывы",
  description: "Профессиональные ответы на отзывы клиентов за секунды. Сохраните нервы и репутацию. AI-помощник для любого бизнеса.",
  keywords: ["отзывы", "ответы на отзывы", "репутация", "бизнес", "AI", "автоматизация", "управление репутацией", "негативные отзывы"],
  authors: [{ name: "MyReply" }],
  creator: "MyReply",
  publisher: "MyReply",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://myreply.app',
    siteName: 'MyReply',
    title: 'MyReply — Умные ответы на отзывы',
    description: 'Профессиональные ответы на отзывы клиентов за секунды. Сохраните нервы и репутацию.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MyReply — Умные ответы на отзывы',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyReply — Умные ответы на отзывы',
    description: 'Профессиональные ответы на отзывы клиентов за секунды. Сохраните нервы и репутацию.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
