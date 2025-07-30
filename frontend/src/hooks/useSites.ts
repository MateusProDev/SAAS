
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
        // Exemplo: buscar token salvo após login
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await api.get('/api/sites', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setSites(res.data);
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
