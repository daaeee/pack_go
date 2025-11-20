import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600']
});

export const metadata: Metadata = {
  title: 'Система управления переездом',
  description: 'Приложение для управления инвентарем и переездом',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={manrope.className}>{children}</body>
    </html>
  );
}