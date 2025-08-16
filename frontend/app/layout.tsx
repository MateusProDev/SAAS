import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PlanProvider } from '../src/contexts/PlanContext';

export const metadata: Metadata = {
  title: 'MabelSoft - Website Builder',
  description: 'Crie seu site profissional em minutos com MabelSoft!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR"> 
      <body>
        {/* Navbar removida do layout global. Navegação só aparece no dashboard. */}
        <PlanProvider>
          <main>{children}</main>
        </PlanProvider>
      </body>
    </html>
  );
}
