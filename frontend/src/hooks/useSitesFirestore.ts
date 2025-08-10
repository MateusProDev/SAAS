import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";

export function useSitesFirestore() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSites() {
      setLoading(true);
      // Busca todos os sites publicados na estrutura centralizada
      const usersSnap = await getDocs(collection(db, "users"));
      let allSites: any[] = [];
      for (const userDoc of usersSnap.docs) {
        const sitesSnap = await getDocs(collection(db, "users", userDoc.id, "sites"));
        sitesSnap.forEach(siteDoc => {
          const data = siteDoc.data();
          if (data.published === true || data.isPublished === true) {
            allSites.push({
              id: siteDoc.id,
              siteId: data.siteId || siteDoc.id,
              userId: data.userId || userDoc.id,
              slug: data.slug || '',
              template: data.template || '',
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              published: typeof data.published === 'boolean' ? data.published : (typeof data.isPublished === 'boolean' ? data.isPublished : false),
              title: data.title || data.name || '',
              description: data.description || '',
              ...data
            });
          }
        });
      }
      setSites(allSites);
      setLoading(false);
    }
    fetchSites();
  }, []);

  return { sites, loading };
}
