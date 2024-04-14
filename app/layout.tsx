import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter } from 'next/font/google';
import PlausibleProvider from 'next-plausible';

import { Toaster } from 'ui/sonner';

import { DOMAIN } from 'lib/constants';
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
    <html lang="hr">
      <head>
        <PlausibleProvider domain={DOMAIN} />
      </head>
      <body className={cn('font-sans', inter.variable, plexMono.variable)}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
