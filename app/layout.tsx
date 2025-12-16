// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './main.css';
import './media.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Система управления переездом',
  description: 'Pack&Go - система для управления процессом переезда',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
