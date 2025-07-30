"use client";
import React from 'react';
import { useSitesFirestore } from '../../src/hooks/useSitesFirestore';

export default function SitesPage() {
  const { sites, loading } = useSitesFirestore();

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Sites Públicos</h1>
      <ul>
        {sites.map(site => (
          <li key={site.id}>
            <h2>{site.name || site.title}</h2>
            <p>{site.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
