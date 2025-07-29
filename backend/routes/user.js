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

// GET /api/user/profile - Buscar perfil do usuário
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Contar sites atuais
    const sitesSnapshot = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .get();

    const userProfile = {
      ...userDoc.data(),
      currentSites: sitesSnapshot.size
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/user/profile - Criar perfil do usuário
router.post('/profile', verifyToken, async (req, res) => {
  try {
    const { email, displayName } = req.body;
    
    const userProfile = {
      uid: req.user.uid,
      email: email || req.user.email,
      displayName: displayName || req.user.name || '',
      plan: 'free',
      maxSites: 2,
      currentSites: 0,
      customDomain: false,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    };

    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .set(userProfile);

    res.json(userProfile);
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/user/profile - Atualizar perfil do usuário
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.Timestamp.now()
    };

    // Remover campos que não devem ser atualizados diretamente
    delete updateData.uid;
    delete updateData.createdAt;
    delete updateData.plan; // Plano só pode ser alterado via upgrade

    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .update(updateData);

    // Buscar perfil atualizado
    const updatedDoc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .get();

    res.json(updatedDoc.data());
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/user/upgrade-plan - Fazer upgrade do plano
router.post('/upgrade-plan', verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;

    if (!['free', 'pro'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const planConfig = {
      free: {
        maxSites: 2,
        customDomain: false
      },
      pro: {
        maxSites: -1, // Ilimitado
        customDomain: true
      }
    };

    const updateData = {
      plan,
      maxSites: planConfig[plan].maxSites,
      customDomain: planConfig[plan].customDomain,
      updatedAt: admin.firestore.Timestamp.now()
    };

    // Se for upgrade para PRO, definir data de expiração (30 dias)
    if (plan === 'pro') {
      const activeUntil = new Date();
      activeUntil.setDate(activeUntil.getDate() + 30);
      updateData.activeUntil = admin.firestore.Timestamp.fromDate(activeUntil);
    }

    await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .update(updateData);

    // Buscar perfil atualizado
    const updatedDoc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .get();

    // Contar sites atuais
    const sitesSnapshot = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .get();

    const userProfile = {
      ...updatedDoc.data(),
      currentSites: sitesSnapshot.size
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Error upgrading plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/user/usage - Buscar uso atual (sites, storage, etc)
router.get('/usage', verifyToken, async (req, res) => {
  try {
    // Contar sites
    const sitesSnapshot = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .collection('sites')
      .get();

    // Buscar perfil para limites
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.user.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const userProfile = userDoc.data();

    const usage = {
      sites: {
        current: sitesSnapshot.size,
        max: userProfile.maxSites,
        percentage: userProfile.maxSites === -1 ? 0 : (sitesSnapshot.size / userProfile.maxSites) * 100
      },
      plan: userProfile.plan,
      customDomain: userProfile.customDomain,
      activeUntil: userProfile.activeUntil
    };

    res.json(usage);
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
