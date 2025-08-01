import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";

export function useSitesFirestore() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSites() {
      setLoading(true);
      const q = query(collection(db, "published_sites"), where("isPublished", "==", true));
      const snapshot = await getDocs(q);
      setSites(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchSites();
  }, []);

  return { sites, loading };
}
