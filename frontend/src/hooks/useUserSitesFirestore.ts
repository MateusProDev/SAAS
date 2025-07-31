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
      const freshSites = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
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
