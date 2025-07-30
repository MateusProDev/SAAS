import { useEffect, useState } from 'react';
import api from '../../utils/api';

export interface Site {
  id: string;
  name: string;
  [key: string]: any;
}

export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adapte para incluir token se necessário
        const res = await api.get('/api/sites');
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

// Para rodar o backend, execute os comandos abaixo no terminal:
// cd ../backend
// npm install
// npm start
