import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quarto - Strategiespiel',
  description: 'Spiele Quarto online - Ein spannendes Strategiespiel für zwei Spieler',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
