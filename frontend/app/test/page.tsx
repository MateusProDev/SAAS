"use client";
import React, { useState } from 'react';

export default function TestPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const testFirebase = async () => {
    try {
      // Importação dinâmica para testar
      const { initializeApp } = await import('firebase/app');
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
      
      const firebaseConfig = {
        apiKey: "AIzaSyD89wDyY436a-BVrnzVLYZbDpR19gR91Og",
        authDomain: "turflow.firebaseapp.com",
        projectId: "turflow",
        storageBucket: "turflow.firebasestorage.app",
        messagingSenderId: "283639909947",
        appId: "1:283639909947:web:52506c5b1df8b18889d61e"
      };

      const app = initializeApp(firebaseConfig);
      const auth = getAuth(app);
      
      setMessage('Firebase inicializado com sucesso!');
      console.log('Firebase Auth:', auth);
      
      if (email && password) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('Login realizado com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro:', error);
      setMessage(`Erro: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste Firebase Auth</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: '10px', padding: '8px' }}
        />
        <button onClick={testFirebase} style={{ padding: '8px 16px' }}>
          Testar Firebase
        </button>
      </div>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: message.includes('Erro') ? '#ffebee' : '#e8f5e8',
          border: `1px solid ${message.includes('Erro') ? '#f44336' : '#4caf50'}`,
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}
