import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '予定調整 - スケジュール調整アプリ',
  description:
    '空き枠を設定してリンクを共有するだけで、簡単に予定調整ができるアプリです',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
