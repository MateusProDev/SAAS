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
        return;
      }
      const ref = collection(db, `users/${userId}/sites`);
      const snapshot = await getDocs(ref);
      setSites(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }
    fetchSites();
  }, [userId]);

  return { sites, loading };
}
