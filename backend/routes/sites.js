// (MOVER PARA O FINAL DO ARQUIVO) PATCH /api/sites/fix-missing-slugs - Atualiza todos os sites do usuário e gera slug se faltar

const express = require('express');
const router = express.Router();
const admin = require('../config/firebase');

// Middleware para verificar token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /api/sites - Listar sites do usuário
router.get('/', verifyToken, async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .get();

    const sites = [];
    snapshot.forEach(doc => {
      sites.push({ id: doc.id, ...doc.data() });
    });
    console.log('🔍 [DEBUG] Sites lidos do Firestore:', JSON.stringify(sites, null, 2));
    res.json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

// GET /api/sites/:siteId - Obter dados de um site específico
router.get('/:siteId', verifyToken, async (req, res) => {
  try {
    const doc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .doc(req.params.siteId)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Site not found' });
    }
    const data = doc.data();
    // Garantir que sempre retorna name, title e slug
    const result = {
      id: doc.id,
      name: data.name || data.title || '',
      title: data.title || data.name || '',
      slug: data.slug || '',
      ...data
    };
    console.log('🔍 [DEBUG] Site lido do Firestore:', result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching site:', error);
    res.status(500).json({ error: 'Failed to fetch site', details: error.message });
  }
});

// POST /api/sites - Criar novo site
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, template, slug } = req.body;
    console.log('🔍 [DEBUG] Dados recebidos para criar site:', { name, template, slug });

    // Buscar perfil do usuário para saber o plano e limite
    let userDoc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .get();

    let userProfile;
    if (!userDoc.exists) {
      // Procurar por qualquer documento de usuário com o mesmo email
      const email = req.user.email;
      const userQuery = await admin.firestore().collection('users').where('email', '==', email).get();
      if (!userQuery.empty) {
        // Copiar dados do documento antigo para o correto
        const oldDoc = userQuery.docs[0];
        const oldData = oldDoc.data();
        // Atualizar/corrigir o campo uid
        oldData.uid = req.user.uid;
        await admin.firestore().collection('users').doc(req.user.uid).set(oldData, { merge: true });
        // Copiar subcoleção 'sites' se existir
        const oldSitesSnap = await admin.firestore().collection('users').doc(oldDoc.id).collection('sites').get();
        for (const siteDoc of oldSitesSnap.docs) {
          await admin.firestore().collection('users').doc(req.user.uid).collection('sites').doc(siteDoc.id).set(siteDoc.data());
        }
        // Opcional: deletar documento antigo (não obrigatório)
        // await admin.firestore().collection('users').doc(oldDoc.id).delete();
        userDoc = await admin.firestore().collection('users').doc(req.user.uid).get();
        userProfile = userDoc.data();
      } else {
        // Criar perfil mínimo
        const newProfile = {
          uid: req.user.uid,
          email: req.user.email,
          displayName: req.user.name || req.user.displayName || '',
          plan: 'free',
          maxSites: 2,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        await admin.firestore().collection('users').doc(req.user.uid).set(newProfile);
        userProfile = newProfile;
      }
    } else {
      userProfile = userDoc.data();
      // Corrigir campo uid se necessário
      if (userProfile.uid !== req.user.uid) {
        await admin.firestore().collection('users').doc(req.user.uid).update({ uid: req.user.uid });
        userProfile.uid = req.user.uid;
      }
    }

    const plan = userProfile.plan || 'free';
    const maxSites = typeof userProfile.maxSites === 'number' ? userProfile.maxSites : 2;

    // Contar sites atuais
    const sitesSnapshot = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .get();
    const currentSites = sitesSnapshot.size;

    // Checar limite de sites
    if (plan === 'free' && currentSites >= maxSites) {
      return res.status(403).json({ error: `Limite de ${maxSites} sites atingido no plano FREE. Faça upgrade para PRO para criar mais sites.` });
    }

    // Verificar se o slug já existe
    const existingSlug = await admin.firestore()
      .collection('sites')
      .where('slug', '==', slug)
      .get();

    if (!existingSlug.empty) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const siteData = {
      name,
      template,
      slug,
      data: getDefaultTemplateData(template),
      isPublished: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Criar o site na coleção do usuário
    const siteRef = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .add(siteData);
    console.log('✅ [DEBUG] Site criado no Firestore:', { id: siteRef.id, ...siteData });

    // Também criar uma referência global para slugs únicos
    await admin.firestore()
      .collection('sites')
      .doc(siteRef.id)
      .set({
        userId: req.user.uid,
        slug,
        name,
        template,
        isPublished: false
      });
    console.log('✅ [DEBUG] Referência global criada para slug:', { id: siteRef.id, slug });

    res.status(201).json({ 
      id: siteRef.id, 
      ...siteData,
      message: 'Site created successfully' 
    });
  } catch (error) {
    console.error('Error creating site:', error);
    res.status(500).json({ error: 'Failed to create site' });
  }
});

// PUT /api/sites/:siteId - Atualizar site
router.put('/:siteId', verifyToken, async (req, res) => {
  try {
    const { data, name, isPublished, slug } = req.body;

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (data) updateData.data = data;
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (typeof isPublished === 'boolean') updateData.isPublished = isPublished;

    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .doc(req.params.siteId)
      .update(updateData);

    // Atualizar também a referência global se necessário
    const globalUpdate = {};
    if (typeof isPublished === 'boolean') globalUpdate.isPublished = isPublished;
    if (slug) globalUpdate.slug = slug;
    if (Object.keys(globalUpdate).length > 0) {
      const globalDocRef = admin.firestore().collection('sites').doc(req.params.siteId);
      const globalDoc = await globalDocRef.get();
      if (globalDoc.exists) {
        await globalDocRef.update(globalUpdate);
        console.log(`[PUT] Global doc atualizado: ${req.params.siteId}`, globalUpdate);
      } else {
        await globalDocRef.set(globalUpdate, { merge: true });
        console.log(`[PUT] Global doc criado (merge): ${req.params.siteId}`, globalUpdate);
      }
    }

    res.json({ message: 'Site updated successfully' });
  } catch (error) {
    console.error('Error updating site:', error);
    res.status(500).json({ error: 'Failed to update site', details: error.message });
  }
});

// DELETE /api/sites/:siteId - Deletar site
router.delete('/:siteId', verifyToken, async (req, res) => {
  try {
    // Deletar da coleção do usuário
    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .doc(req.params.siteId)
      .delete();

    // Deletar da coleção global
    await admin.firestore()
      .collection('sites')
      .doc(req.params.siteId)
      .delete();

    res.json({ message: 'Site deleted successfully' });
  } catch (error) {
    console.error('Error deleting site:', error);
    res.status(500).json({ error: 'Failed to delete site' });
  }
});

// GET /site/:slug - Endpoint público para visualizar sites publicados
router.get('/public/:slug', async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('sites')
      .where('slug', '==', req.params.slug)
      .where('isPublished', '==', true)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Site not found or not published' });
    }

    const siteDoc = snapshot.docs[0];
    const siteGlobal = siteDoc.data();

    // Buscar dados completos do site
    const siteData = await admin.firestore()
      .collection('users')
      .doc(siteGlobal.userId)
      .collection('sites')
      .doc(siteDoc.id)
      .get();

    if (!siteData.exists) {
      return res.status(404).json({ error: 'Site data not found' });
    }

    res.json({
      id: siteData.id,
      ...siteData.data(),
      slug: siteGlobal.slug
    });
  } catch (error) {
    console.error('Error fetching public site:', error);
    res.status(500).json({ error: 'Failed to fetch site' });
  }
});

// Função para obter dados padrão do template
function getDefaultTemplateData(template) {
  const defaultData = {
    barbershop: {
      businessName: "Barbearia Exemplo",
      description: "A melhor barbearia da cidade",
      phone: "(11) 99999-9999",
      address: "Rua Exemplo, 123 - São Paulo",
      instagram: "@barbearia_exemplo",
      whatsapp: "11999999999",
      colors: {
        primary: "#8B4513",
        secondary: "#D2691E",
        accent: "#FFD700",
        background: "#1A1A1A",
        text: "#FFFFFF"
      },
      images: {
        hero: "",
        gallery: []
      },
      services: [
        { name: "Corte Tradicional", price: "R$ 25" },
        { name: "Barba", price: "R$ 15" },
        { name: "Corte + Barba", price: "R$ 35" }
      ]
    },
    travel: {
      businessName: "Agência Viagem & Cia",
      description: "Realizamos seus sonhos de viagem",
      phone: "(11) 88888-8888",
      email: "contato@viagemecia.com",
      whatsapp: "11888888888",
      colors: {
        primary: "#2E8B57",
        secondary: "#32CD32",
        accent: "#FFD700",
        background: "#F0F8FF",
        text: "#333333"
      },
      images: {
        hero: "",
        gallery: []
      },
      packages: [
        { name: "Europa Clássica", price: "A partir de R$ 3.999", duration: "10 dias" },
        { name: "Caribe Tropical", price: "A partir de R$ 2.499", duration: "7 dias" },
        { name: "Ásia Exótica", price: "A partir de R$ 4.999", duration: "15 dias" }
      ]
    },
    commercial: {
      businessName: "Empresa Exemplo",
      description: "Soluções inovadoras para seu negócio",
      phone: "(11) 77777-7777",
      email: "contato@empresa.com",
      address: "Av. Exemplo, 456 - São Paulo",
      colors: {
        primary: "#2C3E50",
        secondary: "#3498DB",
        accent: "#E74C3C",
        background: "#FFFFFF",
        text: "#2C3E50"
      },
      images: {
        hero: "",
        about: "",
        gallery: []
      },
      services: [
        { name: "Consultoria", description: "Consultoria especializada para seu negócio" },
        { name: "Desenvolvimento", description: "Soluções personalizadas" },
        { name: "Suporte", description: "Suporte técnico especializado" }
      ]
    }
  };

  return defaultData[template] || defaultData.commercial;
}

// PATCH /api/sites/fix-missing-slugs - Atualiza todos os sites do usuário e gera slug se faltar
router.patch('/fix-missing-slugs', verifyToken, async (req, res) => {
  try {
    const userSitesRef = admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites');
    const snapshot = await userSitesRef.get();
    const batch = admin.firestore().batch();
    let updated = 0;
    let skipped = 0;

    function slugify(text) {
      return text
        .toString()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    for (const doc of snapshot.docs) {
      const data = doc.data();
      // Usa name OU title para gerar slug
      const base = data.name || data.title;
      if ((!data.slug || data.slug === '') && base) {
        const newSlug = slugify(base) + '-' + doc.id.slice(-6);
        console.log(`[SLUG PATCH] Atualizando site ${doc.id} com slug: ${newSlug}`);
        batch.update(doc.ref, { slug: newSlug });
        // Atualiza também na coleção global
        batch.update(admin.firestore().collection('sites').doc(doc.id), { slug: newSlug });
        updated++;
      } else {
        skipped++;
        console.log(`[SLUG PATCH] Pulando site ${doc.id} (slug já existe ou sem name/title)`);
      }
    }
    if (updated > 0) {
      await batch.commit();
      console.log(`[SLUG PATCH] Batch commit realizado para ${updated} sites.`);
    } else {
      console.log('[SLUG PATCH] Nenhum site para atualizar.');
    }
    res.json({ message: `Slugs atualizados para ${updated} site(s), pulados ${skipped}` });
  } catch (error) {
    console.error('Erro ao atualizar slugs:', error);
    res.status(500).json({ error: 'Falha ao atualizar slugs', details: error.message });
  }
});

module.exports = router;
