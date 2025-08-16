import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

export function useSitesFirestore() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSites() {
      setLoading(true);
      // Busca todos os sites publicados na coleção centralizada
      const publishedSnap = await getDocs(collection(db, "published_sites"));
      let allSites: any[] = [];
      publishedSnap.forEach(siteDoc => {
        const data = siteDoc.data();
        allSites.push({
          id: siteDoc.id,
          siteId: data.siteId || siteDoc.id,
          userId: data.userId || '',
          slug: data.slug || '',
          template: data.template || '',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          published: typeof data.published === 'boolean' ? data.published : false,
          title: data.title || data.name || '',
          description: data.description || '',
          ...data
        });
      });
      setSites(allSites);
      setLoading(false);
    }
    fetchSites();
  }, []);

  return { sites, loading };
}
