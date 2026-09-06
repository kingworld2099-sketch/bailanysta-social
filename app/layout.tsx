import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BfcacheRefresh from "@/components/BfcacheRefresh";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { countUnseenLikes } from "@/lib/likes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bailanysta",
  description: "Лента тех, кто прямо сейчас в твоём городе и в том же состоянии, что и ты",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='24' fill='%235e5ce6'/%3E%3Ctext x='50' y='68' font-size='58' text-anchor='middle' fill='white' font-family='sans-serif'%3EB%3C/text%3E%3C/svg%3E",
  },
  robots: {
    index: false,
    follow: false,
  },
};

const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem('bailanysta-theme');
    document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  const [pendingRequests, unseenLikes] = user
    ? await Promise.all([
        prisma.connectRequest.count({ where: { toUserId: user.id, status: "PENDING" } }),
        countUnseenLikes(user.id, user.lastSeenLikesAt),
      ])
    : [0, 0];

  return (
    <html
      lang="ru"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <BfcacheRefresh />
        <Header user={user ? { id: user.id, name: user.name } : null} pendingRequests={pendingRequests} unseenLikes={unseenLikes} />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
