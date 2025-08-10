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

    // Dados default do usuário
    const userData = {
      uid: userRecord.uid,
      email,
      displayName: displayName || '',
      plan: 'free',
      maxSites: 2,
      currentSites: 1,
      customDomain: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Dados default do site inicial
    const siteId = admin.firestore().collection('users').doc().id;
    const siteData = {
      title: 'Meu Primeiro Site',
      template: 'portfolio',
      published: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      portfolioData: {
        personalInfo: {
          name: displayName || '',
          email: email,
          phone: '',
          title: 'Desenvolvedor Full Stack',
          subtitle: 'Desenvolvedor apaixonado por tecnologia',
          location: 'São Paulo, Brasil',
          whatsapp: ''
        },
        about: {
          description: 'Desenvolvedor apaixonado por tecnologia e inovação.'
        },
        skills: {
          technical: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
          tools: ['Git', 'Docker', 'VS Code'],
          languages: ['Português', 'Inglês'],
          soft: ['Comunicação', 'Trabalho em equipe', 'Liderança']
        },
        projects: [],
        services: [],
        experience: [],
        education: [],
        certifications: [],
        testimonials: [],
        theme: {
          primaryColor: '#667eea',
          secondaryColor: '#764ba2',
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#ffffff',
          textColor: '#333333',
          layout: 'modern'
        },
        settings: {
          showContactForm: true,
          showSocialLinks: true,
          allowDownloadResume: false,
          enableAnalytics: false,
          showSections: {
            about: true,
            skills: true,
            projects: true,
            experience: true,
            education: false,
            certifications: false,
            services: false,
            testimonials: false,
            contact: true
          }
        },
        seo: {
          title: 'Meu Portfólio',
          description: 'Portfólio profissional - Desenvolvedor Full Stack',
          keywords: ['desenvolvedor', 'portfolio', 'web developer']
        }
      }
    };

    // Batch para criar usuário e site inicial juntos
    const batch = admin.firestore().batch();
    const userRef = admin.firestore().collection('users').doc(userRecord.uid);
    const siteRef = userRef.collection('sites').doc(siteId);
    batch.set(userRef, userData);
    batch.set(siteRef, siteData);
    await batch.commit();

    res.status(201).json({ 
      message: 'User created successfully',
      uid: userRecord.uid,
      siteId
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
