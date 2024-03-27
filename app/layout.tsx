import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter } from 'next/font/google';

import { cn } from 'lib/utils';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  title: 'Planino - Planiranje poslovanja',
  description:
    'Planino je alat za planiranje poslovanja koji pomaže poduzetnicima u izradi poslovnih planova i analizi financijskih izvještaja.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('font-sans', inter.variable, plexMono.variable)}>
        {children}
      </body>
    </html>
  );
}
