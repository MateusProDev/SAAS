import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";

export async function deleteSite(userId: string, siteId: string) {
  if (!userId || !siteId) return;
  
  // ✅ USAR APENAS A NOVA ESTRUTURA users/{userId}/sites/{siteId}
  const ref = doc(db, "users", userId, "sites", siteId);
  await deleteDoc(ref);
  
  console.log('✅ [DELETE SITE] Site deletado da nova estrutura:', { userId, siteId });
}
