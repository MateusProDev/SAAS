// Utilitário para buscar site público por SLUG na API externa
export async function fetchPublicSiteBySlug(slug: string) {
  const apiUrl = `https://saas-msjn.onrender.com/api/sites/public/${slug}`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Site público não encontrado');
  return res.json();
}
