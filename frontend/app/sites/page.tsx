"use client";
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

interface Site {
  id: string;
  title: string;
  description: string;
  content: string;
  published: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
}

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSites() {
      setLoading(true);
      try {
        // Exemplo: GET /api/sites/public (ajuste conforme seu backend)
        const res = await api.get('/sites/public');
        setSites(res.data);
        setError(null);
      } catch (err: any) {
        setError('Erro ao buscar sites.');
      } finally {
        setLoading(false);
      }
    }
    fetchSites();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Sites Públicos</h1>
      <ul>
        {sites.map(site => (
          <li key={site.id}>
            <h2>{site.title}</h2>
            <p>{site.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
