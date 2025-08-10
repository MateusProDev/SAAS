
import { useEffect, useState } from 'react';
import api from '../../utils/api';

export interface Site {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

/**
 * Hook para buscar sites do usuário autenticado.
 * Envia o token JWT se existir (exemplo usando localStorage).
 * Ajuste conforme seu fluxo de autenticação.
 */
export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await api.get('/api/sites', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        // Padroniza todos os campos essenciais
        const normalized = (res.data || []).map((site: any) => ({
          id: site.id,
          siteId: site.siteId || site.id,
          userId: site.userId,
          slug: site.slug || '',
          template: site.template || '',
          createdAt: site.createdAt,
          updatedAt: site.updatedAt,
          published: typeof site.published === 'boolean' ? site.published : false,
          title: site.title || site.name || '',
          description: site.description || '',
          ...site
        }));
        setSites(normalized);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar sites');
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  return { sites, loading, error };
}
