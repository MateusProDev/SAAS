import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

export function useTemplateFirestore(templateId: string) {
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplate() {
      setLoading(true);
      if (!templateId) {
        setTemplate(null);
        setLoading(false);
        return;
      }
      const ref = doc(db, `sites`, templateId);
      const snap = await getDoc(ref);
      setTemplate(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    }
    fetchTemplate();
  }, [templateId]);

  return { template, loading };
}
