import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";

export async function deleteSite(userId: string, siteId: string) {
  if (!userId || !siteId) return;
  const ref = doc(db, `users/${userId}/sites`, siteId);
  await deleteDoc(ref);
  // Também pode remover da coleção 'sites' global, se necessário
  const refGlobal = doc(db, "sites", siteId);
  await deleteDoc(refGlobal);
}
