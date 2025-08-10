import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

export function useUserSitesFirestore(userId: string) {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSites() {
      setLoading(true);
      if (!userId) {
        setSites([]);
        setLoading(false);
        localStorage.removeItem(`sites_${userId}`);
        return;
      }
      // Tenta ler do cache local
      const cached = localStorage.getItem(`sites_${userId}`);
      if (cached) {
        try {
          setSites(JSON.parse(cached));
          setLoading(false);
        } catch {}
      }
      // Busca do Firestore (sempre busca para garantir atualização)
      const ref = collection(db, `users/${userId}/sites`);
      const snapshot = await getDocs(ref);
      const freshSites = snapshot.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          siteId: data.siteId || doc.id,
          userId: data.userId || userId,
          slug: data.slug || '',
          template: data.template || '',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          published: typeof data.published === 'boolean' ? data.published : false,
          title: data.title || data.name || '',
          description: data.description || '',
          ...data
        };
      });
      setSites(freshSites);
      localStorage.setItem(`sites_${userId}` , JSON.stringify(freshSites));
      setLoading(false);
    }
    fetchSites();
  }, [userId]);

  // Função para forçar atualização do cache (após criar/editar/deletar)
  const refreshSites = async () => {
    if (!userId) return;
    setLoading(true);
    const ref = collection(db, `users/${userId}/sites`);
    const snapshot = await getDocs(ref);
    const freshSites = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    setSites(freshSites);
    localStorage.setItem(`sites_${userId}` , JSON.stringify(freshSites));
    setLoading(false);
  };

  return { sites, loading, refreshSites };
}
