import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SaaS Website Builder',
  description: 'Monte seu site profissional em minutos!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <nav style={{ padding: 16, background: '#f5f5f5', marginBottom: 24 }}>
          <Link href="/dashboard" style={{ marginRight: 16 }}>Dashboard</Link>
          <Link href="/sites" style={{ marginRight: 16 }}>Sites</Link>
          <Link href="/sites/new">Novo Site</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
