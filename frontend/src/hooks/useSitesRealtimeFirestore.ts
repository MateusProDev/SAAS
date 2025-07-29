import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export function useSitesRealtimeFirestore() {
  const { user } = useAuth();
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'users', user.uid, 'sites'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSites(data);
      setLoading(false);
      console.log('🔄 [FIRESTORE REALTIME] Sites atualizados:', data);
    }, (err) => {
      setError(err.message);
      setLoading(false);
      console.error('❌ [FIRESTORE REALTIME] Erro:', err);
    });
    return () => unsubscribe();
  }, [user]);

  return { sites, loading, error };
}
