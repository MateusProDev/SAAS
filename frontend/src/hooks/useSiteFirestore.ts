import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export function useSiteFirestore(siteId: string) {
  const { user } = useAuth();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !siteId) {
      setSite(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = doc(db, 'users', user.uid, 'sites', siteId);
    getDoc(ref)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setSite({ id: docSnap.id, ...docSnap.data() });
        } else {
          setSite(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user, siteId]);

  return { site, loading, error };
}
