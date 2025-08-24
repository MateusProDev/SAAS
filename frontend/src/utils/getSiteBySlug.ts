import { db } from '../config/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export async function getSiteBySlug(slug: string) {
  try {
    // Buscar o registro do slug
    const slugsRef = collection(db, 'slugs');
    const slugQuery = query(slugsRef, where('slug', '==', slug));
    const slugSnapshot = await getDocs(slugQuery);

    if (slugSnapshot.empty) {
      throw new Error('Site não encontrado');
    }

    // Pegar os dados do primeiro documento (deve ser único)
    const slugData = slugSnapshot.docs[0].data();
    const { userId, siteId } = slugData;

    // Buscar o documento do site
    const siteRef = doc(db, 'users', userId, 'sites', siteId);
    const siteDoc = await getDoc(siteRef);

    if (!siteDoc.exists()) {
      throw new Error('Site não encontrado');
    }

    return {
      id: siteDoc.id,
      ...siteDoc.data(),
      slug
    };
  } catch (error) {
    console.error('Error fetching site by slug:', error);
    throw error;
  }
}
