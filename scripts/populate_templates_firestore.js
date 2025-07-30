// Script para popular a coleção 'templates' do Firestore com os templates do frontend
// Rode: node scripts/populate_templates_firestore.js

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Carrega o service account do arquivo JSON local
const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Carrega os templates do arquivo do frontend
const templatesPath = path.join(__dirname, '../frontend/src/templates/index.ts');
const fileContent = fs.readFileSync(templatesPath, 'utf-8');

// Regex simples para extrair os templates do arquivo TypeScript
const templateRegex = /\{\s*id: '([^']+)',\s*name: '([^']+)',[\s\S]*?html: `([\s\S]*?)`\s*}/g;

const templates = [];
let match;
while ((match = templateRegex.exec(fileContent)) !== null) {
  templates.push({
    id: match[1],
    name: match[2],
    content: match[3],
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
