// Script profissional para popular a coleção 'templates' do Firestore com os templates do frontend
// Uso: node scripts/populate_templates_firestore.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Carrega o service account do arquivo JSON local
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Caminho do arquivo de templates do frontend
const templatesPath = path.join(__dirname, '../frontend/src/templates/index.ts');
if (!fs.existsSync(templatesPath)) {
  console.error('❌ Arquivo de templates não encontrado:', templatesPath);
  process.exit(1);
}
const fileContent = fs.readFileSync(templatesPath, 'utf-8');

// Regex para extrair todos os templates do arquivo TypeScript
const templateRegex = /\{\s*id: '([^']+)',\s*name: '([^']+)',[\s\S]*?html: `([\s\S]*?)`\s*}/g;

const templates = [];
let match;
while ((match = templateRegex.exec(fileContent)) !== null) {
  // Detecta placeholders do tipo {{variavel}}
  const placeholders = Array.from(new Set(
    Array.from(match[3].matchAll(/{{(\w+)}}/g)).map(m => m[1])
  ));
  templates.push({
    id: match[1],
    name: match[2],
    content: match[3],
    placeholders,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    category: '',
    description: '',
    preview: '',
    featured: false,
    free: true,
    tags: []
  });
}

async function main() {
  try {
    const colRef = db.collection('templates');
    // Apaga todos os templates antigos para sobrescrever
    const snapshot = await colRef.get();
    const batch = db.batch();
    snapshot.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    console.log(`🗑️  Templates antigos removidos (${snapshot.size})`);

    // Salva todos os novos templates
    let count = 0;
    for (const tpl of templates) {
      await colRef.doc(tpl.id).set(tpl);
      count++;
      console.log(`✅ Template salvo: ${tpl.name} (id: ${tpl.id}) | Placeholders: [${tpl.placeholders.join(', ')}]`);
    }
    console.log(`\n🎉 ${count} templates salvos com sucesso na coleção 'templates'!`);
    if (count === 0) {
      console.warn('⚠️  Nenhum template encontrado. Verifique o arquivo de templates.');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao popular templates:', err);
    process.exit(1);
  }
}

main();

async function main() {
  for (const tpl of templates) {
    await admin.firestore().collection('templates').doc(tpl.id).set(tpl, { merge: true });
    console.log(`✅ Template '${tpl.name}' (${tpl.id}) adicionado ao Firestore.`);
  }
  process.exit(0);
}

main().catch(err => {
  console.error('Erro ao popular templates:', err);
  process.exit(1);
});
