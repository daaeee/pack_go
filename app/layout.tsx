import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './main.css';
import './media.css';
import './react-fix.css'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Система управления переездом',
  description: 'Приложение для управления переездом Pack&Go',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}