
"use client";
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../src/utils/firebase';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/dashboard');
    } catch (err: any) {
      setError('Erro ao criar conta. Verifique o email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 60% 40%, #e0e7ff 0%, #f5f6fa 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow animation */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '-120px',
        width: 320,
        height: 320,
        background: 'radial-gradient(circle, #9f86c0 0%, #4a4e69 80%, transparent 100%)',
        opacity: 0.18,
        filter: 'blur(16px)',
        zIndex: 0,
        animation: 'floatGlow 7s ease-in-out infinite alternate'
      }} />
      <style>{`
        @keyframes floatGlow {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(40px) scale(1.08); }
        }
      `}</style>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 32px #0002',
        padding: 48,
        maxWidth: 400,
        width: '100%',
        zIndex: 1,
        position: 'relative',
        textAlign: 'center',
        border: '1px solid #e0e7ff'
      }}>
        <img src="/window.svg" alt="Logo" style={{ width: 48, height: 48, marginBottom: 10, filter: 'drop-shadow(0 2px 8px #9f86c0aa)' }} />
        <h1 style={{ color: '#4a4e69', fontSize: 28, marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>Crie sua conta</h1>
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ color: '#22223b', fontWeight: 600, fontSize: 15 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1px solid #e0e7ff', fontSize: 15, marginTop: 6, background: '#f8f9fa' }} />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ color: '#22223b', fontWeight: 600, fontSize: 15 }}>Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 7, border: '1px solid #e0e7ff', fontSize: 15, marginTop: 6, background: '#f8f9fa' }} />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%',
            background: 'linear-gradient(90deg, #9f86c0 0%, #4a4e69 100%)',
            color: '#fff',
            padding: '12px 0',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 17,
            boxShadow: '0 1px 4px #0001',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            marginBottom: 8,
            transition: 'opacity 0.2s'
          }}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
          {error && <div style={{ color: '#e63946', marginTop: 10, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        </form>
        <p style={{ color: '#888', fontSize: 15, marginTop: 18, textAlign: 'center' }}>
          Já tem conta? <Link href="/login" style={{ color: '#4a4e69', fontWeight: 600 }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}
