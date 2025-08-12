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
    let { name, template, slug } = req.body;
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

    // Gerar slug automaticamente se não enviado
    function slugify(text) {
      return text
        .toString()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    if (!slug || slug.trim() === '') {
      let base = name || '';
      slug = slugify(base);
      // Garante unicidade
      let trySlug = slug;
      let i = 1;
  // Gera slug único apenas na subcoleção do usuário
      while (true) {
        const exists = await admin.firestore()
          .collection('users')
          .doc(req.user.uid)
          .collection('sites')
          .where('slug', '==', trySlug)
          .get();
        if (exists.empty) {
          slug = trySlug;
          break;
        }
        trySlug = `${slug}-${i}`;
        i++;
      }
    } else {
      // Verificar se o slug já existe
      const existingSlug = await admin.firestore()
        .collection('users')
        .doc(req.user.uid)
        .collection('sites')
        .where('slug', '==', slug)
        .get();
      if (!existingSlug.empty) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
    }

    // Buscar HTML base do template, se existir
    let templateContent = '';
    try {
      const templateDoc = await admin.firestore().collection('templates').doc(template).get();
      if (templateDoc.exists) {
        const tpl = templateDoc.data();
        if (tpl.content) templateContent = tpl.content;
      }
    } catch (e) {
      console.warn('Não foi possível buscar template do Firestore:', e);
    }

    const defaultCustomization = getDefaultTemplateData(template);
    const siteData = {
      name,
      template,
      slug,
      data: defaultCustomization, // compatibilidade antiga
      customization: defaultCustomization, // compatível com frontend
      isPublished: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      active: true,
      content: templateContent,
      publishedAt: null,
      siteId: '', // será atualizado após criar
      userId: req.user.uid,
      views: 0
    };

    // Criar o site na coleção do usuário
    const siteRef = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .add(siteData);
    // Atualizar os campos siteId e slug explicitamente para garantir que ambos estejam presentes
    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .doc(siteRef.id)
      .update({ siteId: siteRef.id, slug });

    // Registrar slug na coleção auxiliar
    await admin.firestore().collection('slugs').doc(slug).set({
      userId: req.user.uid,
      siteId: siteRef.id
    });

    // Criar/atualizar documento em published_sites para lookup rápido por slug
    await admin.firestore().collection('published_sites').doc(siteRef.id).set({
      siteId: siteRef.id,
      userId: req.user.uid,
      slug,
      name,
      template,
      active: true,
      published: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishedAt: null,
      content: templateContent,
      views: 0
    }, { merge: true });

    console.log('✅ [DEBUG] Site criado no Firestore:', { id: siteRef.id, ...siteData, siteId: siteRef.id });
    console.log('✅ [DEBUG] Slug registrado na coleção auxiliar:', { slug, userId: req.user.uid, siteId: siteRef.id });
    console.log('✅ [DEBUG] Documento criado em published_sites:', { siteId: siteRef.id, slug });

    res.status(201).json({ 
      id: siteRef.id, 
      ...siteData,
      siteId: siteRef.id,
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

    // Atualizar slug na coleção auxiliar se mudou
    if (slug) {
      await admin.firestore().collection('slugs').doc(slug).set({
        userId: req.user.uid,
        siteId: req.params.siteId
      });
    }

    // Sincronizar published_sites
    const siteDoc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .doc(req.params.siteId)
      .get();
    if (siteDoc.exists) {
      const data = siteDoc.data();
      await admin.firestore().collection('published_sites').doc(req.params.siteId).set({
        siteId: req.params.siteId,
        userId: req.user.uid,
        slug: data.slug,
        name: data.name,
        template: data.template,
        active: data.active,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        publishedAt: data.publishedAt || null,
        content: data.content || '',
        views: data.views || 0
      }, { merge: true });
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
    // Buscar o site para pegar o slug
    const siteDoc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .doc(req.params.siteId)
      .get();
    let slugToDelete = null;
    if (siteDoc.exists) {
      const siteData = siteDoc.data();
      if (siteData.slug) {
        slugToDelete = siteData.slug;
      }
    }
    // Deletar da coleção do usuário
    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .doc(req.params.siteId)
      .delete();
    // Remover slug da coleção auxiliar
    if (slugToDelete) {
      await admin.firestore().collection('slugs').doc(slugToDelete).delete();
    }
    // Remover da published_sites
    await admin.firestore().collection('published_sites').doc(req.params.siteId).delete();
    res.json({ message: 'Site deleted successfully' });
  } catch (error) {
    console.error('Error deleting site:', error);
    res.status(500).json({ error: 'Failed to delete site' });
  }
});

// GET /site/:slug - Endpoint público para visualizar sites publicados
// GET /api/sites/public/:slug - Retorna HTML publicado do site centralizado
router.get('/public/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    console.log(`[PUBLIC] Buscando site público para slug/siteId: ${slug}`);
    // 1. Busca rápida pelo slug na coleção auxiliar 'slugs'
    const slugRef = admin.firestore().collection('slugs').doc(slug);
    const slugSnap = await slugRef.get();
    if (slugSnap.exists) {
      const { userId, siteId } = slugSnap.data();
      console.log(`[PUBLIC] Slug encontrado em 'slugs': userId=${userId}, siteId=${siteId}`);
      const siteDoc = await admin.firestore()
        .collection('users')
        .doc(userId)
        .collection('sites')
        .doc(siteId)
        .get();
      if (siteDoc.exists) {
        const siteData = siteDoc.data();
        console.log(`[PUBLIC] Site encontrado por slug:`, siteData);
        return res.json({
          id: siteDoc.id,
          ...siteData
        });
      } else {
        console.warn(`[PUBLIC] Documento do site não encontrado para userId=${userId}, siteId=${siteId}`);
      }
    } else {
      // 2. Se não achou pelo slug, tenta buscar diretamente em published_sites pelo siteId
      const pubDoc = await admin.firestore().collection('published_sites').doc(slug).get();
      if (pubDoc.exists) {
        const pubData = pubDoc.data();
        console.log(`[PUBLIC] Site encontrado em 'published_sites':`, pubData);
        // Buscar o documento real do usuário, se possível
        if (pubData.userId && pubData.siteId) {
          const siteDoc = await admin.firestore()
            .collection('users')
            .doc(pubData.userId)
            .collection('sites')
            .doc(pubData.siteId)
            .get();
          if (siteDoc.exists) {
            const siteData = siteDoc.data();
            return res.json({
              id: siteDoc.id,
              ...siteData
            });
          }
        }
        // Se não achou o documento real, retorna published_sites mesmo
        return res.json({
          id: pubDoc.id,
          ...pubData
        });
      } else {
        console.warn(`[PUBLIC] Documento não encontrado em 'published_sites' para id: ${slug}`);
      }
    }
    return res.status(404).json({ error: 'Site not found or not published', slug });
  } catch (error) {
    console.error('Error fetching public site:', error);
    res.status(500).json({ error: 'Failed to fetch site', details: error.message });
  }
});

// POST /api/sites/:siteId/publish - Publica o site (atualiza campo content e isPublished)
router.post('/:siteId/publish', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content (HTML) is required' });
    }
    // Buscar dados do site para pegar slug e userId
    const siteDoc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .doc(req.params.siteId)
      .get();
    if (!siteDoc.exists) {
      return res.status(404).json({ error: 'Site not found' });
    }
    const siteData = siteDoc.data();
    if (!siteData.slug) {
      return res.status(400).json({ error: 'Site slug is missing' });
    }

    // Atualizar documento do usuário
    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .doc(req.params.siteId)
      .set({
        content,
        isPublished: true,
        publishedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

    // Sempre criar/atualizar published_sites
    await admin.firestore()
      .collection('published_sites')
      .doc(req.params.siteId)
      .set({
        siteId: req.params.siteId,
        userId: req.user.uid,
        slug: siteData.slug,
        name: siteData.name || siteData.title || '',
        content,
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        active: true,
        views: 0
      }, { merge: true });

    res.json({ message: 'Site published successfully', slug: siteData.slug });
  } catch (error) {
    console.error('Error publishing site:', error);
    res.status(500).json({ error: 'Failed to publish site' });
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
