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

// GET /api/auth/verify - Verificar se o token é válido
router.get('/verify', verifyToken, (req, res) => {
  res.json({ 
    valid: true, 
    user: {
      uid: req.user.uid,
      email: req.user.email,
      email_verified: req.user.email_verified
    }
  });
});

// POST /api/auth/register - Registrar novo usuário (opcional - pode ser feito no frontend)
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      emailVerified: false
    });

    // Criar documento inicial no Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      plan: 'free', // Para futuras implementações de planos
      sitesCount: 0
    });

    res.status(201).json({ 
      message: 'User created successfully',
      uid: userRecord.uid 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      error: 'Registration failed',
      message: error.message 
    });
  }
});

module.exports = router;
