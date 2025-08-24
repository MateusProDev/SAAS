// Função para gerar slug a partir do nome do site
function generateSlug(name) {
  // Remove acentos e caracteres especiais
  const normalizedText = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Converte para minúsculas e substitui espaços por hífens
  const slug = normalizedText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  // Remove hífens do início e fim
  return slug.replace(/^-+|-+$/g, '');
}

// Função para gerar slug único
async function generateUniqueSlug(name, firestore) {
  let baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;
  
  // Verifica se o slug já existe
  while (true) {
    const snapshot = await firestore
      .collection('slugs')
      .where('slug', '==', slug)
      .get();
    
    if (snapshot.empty) {
      break;
    }
    
    // Se existir, adiciona um número ao final
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}
