import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import App from './App'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ExiBy Admin Portal',
  description:
    'ExiBy Admin Portal with MUI, Tailwind, dark/light mode, and authentication',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <App>{children}</App>
      </body>
    </html>
  );
}
