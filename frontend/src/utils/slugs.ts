import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function generateUniqueSlug(name: string) {
  // Remove acentos e caracteres especiais
  const baseSlug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  let slug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    // Verificar se o slug já existe
    const slugsRef = collection(db, 'slugs');
    const slugQuery = query(slugsRef, where('slug', '==', slug));
    const snapshot = await getDocs(slugQuery);

    if (snapshot.empty) {
      isUnique = true;
    } else {
      // Se existir, adicionar um número ao final
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
}
