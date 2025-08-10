// Script para popular o Firestore com todos os templates, incluindo o Portfolio

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const templates = [
  {
    id: 'barbearia',
    name: 'Barbearia Premium',
    category: 'barbearia',
    description: 'Template profissional para barbearias, com agendamento e serviços.',
    content: '<!DOCTYPE html><html><head><title>Barbearia Premium</title></head><body><h1>Barbearia Premium</h1></body></html>',
    featured: true,
    free: true,
    tags: ['barbearia', 'corte', 'masculino'],
    preview: '',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'comercial',
    name: 'Comercial Moderno',
    category: 'comercial',
    description: 'Template versátil para empresas e negócios locais.',
    content: '<!DOCTYPE html><html><head><title>Comercial Moderno</title></head><body><h1>Comercial Moderno</h1></body></html>',
    featured: true,
    free: true,
    tags: ['comercial', 'empresa', 'negócios'],
    preview: '',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'agencia',
    name: 'Agência de Viagens',
    category: 'agencia',
    description: 'Template moderno para agências de turismo e viagens.',
    content: '<!DOCTYPE html><html><head><title>Agência de Viagens</title></head><body><h1>Agência de Viagens</h1></body></html>',
    featured: true,
    free: true,
    tags: ['agencia', 'viagem', 'turismo'],
    preview: '',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: 'portfolio',
    name: 'Portfolio Profissional',
    category: 'portfolio',
    description: 'Template profissional para freelancers, desenvolvedores e criativos.',
    content: '<!DOCTYPE html><html><head><title>Portfolio Profissional</title></head><body><h1>Portfolio Profissional</h1></body></html>',
    featured: true,
    free: true,
    tags: ['portfolio', 'freelancer', 'dev'],
    preview: '',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function populateTemplates() {
  for (const tpl of templates) {
    await db.collection('templates').doc(tpl.id).set(tpl, { merge: true });
    console.log(`✅ Template '${tpl.name}' criado/atualizado.`);
  }
  process.exit(0);
}

populateTemplates();
