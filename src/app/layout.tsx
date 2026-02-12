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
    url: 'https://my-reply.ru',
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
  const metrikaId = process.env.NEXT_PUBLIC_METRIKA_ID;

  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Восстановление темы до рендера — предотвращает мигание */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('myreply-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>

        {/* Яндекс.Метрика */}
        {metrikaId && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
                ym(${metrikaId},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
