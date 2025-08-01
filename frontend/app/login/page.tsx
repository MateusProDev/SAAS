"use client";
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../../src/utils/firebase';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/dashboard');
    } catch (err: any) {
      setError('Email ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['login-root']}>
      <div className={styles['login-glow']} />
      
      <div className={styles['login-container']}>
        <img 
          src="/window.svg" 
          alt="MabelSoftware Logo" 
          className={styles['login-logo']} 
        />
        <h1 className={styles['login-title']}>Acesse sua conta</h1>
        
        <form onSubmit={handleLogin} className={styles['login-form']}>
          <div className={styles['login-field']}>
            <label className={styles['login-label']}>
              📧 Email
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className={styles['login-input']}
              placeholder="seu@email.com"
            />
          </div>
          
          <div className={styles['login-field']}>
            <label className={styles['login-label']}>
              🔒 Senha
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className={styles['login-input']}
              placeholder="Sua senha"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className={styles['login-submit']}
          >
            {loading ? '⏳ Entrando...' : '🚀 Entrar'}
          </button>
          
          {error && (
            <div className={styles['login-error']}>
              ❌ {error}
            </div>
          )}
        </form>
        
        <p className={styles['login-footer']}>
          Não tem conta? <Link href="/register">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
