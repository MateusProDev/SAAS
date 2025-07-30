import React, { useState } from 'react';
import api from '../../../utils/api';
import { useRouter } from 'next/navigation';

export default function NewSitePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/sites', {
        title,
        description,
        content: `<h1>${title}</h1><p>${description}</p>`
      });
      router.push('/sites');
    } catch (err: any) {
      setError('Erro ao criar site.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Criar Novo Site</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div>
          <label>Título</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <div>
          <label>Descrição</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ width: '100%' }} />
        </div>
        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? 'Criando...' : 'Criar Site'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}
