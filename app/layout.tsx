import type { Metadata } from 'next';
import './globals.css';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PerformanceDashboard } from '@/hooks/usePerformance';

export const metadata: Metadata = {
  title: 'Quarto - Strategiespiel',
  description: 'Spiele Quarto online - Ein spannendes Strategiespiel für zwei Spieler',
  keywords: ['Quarto', 'Strategiespiel', 'Brettspiel', 'Online-Spiel', 'Multiplayer'],
  authors: [{ name: 'Quarto Game' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#4F46E5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <ErrorBoundary>
          {children}
          <PerformanceDashboard />
        </ErrorBoundary>
      </body>
    </html>
  );
}
