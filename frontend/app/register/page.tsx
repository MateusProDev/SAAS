
"use client";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/utils/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './register.module.css';

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
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/dashboard');
    } catch (err: any) {
      console.error('Erro de registro:', err);
      let errorMessage = 'Erro ao criar conta.';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email já está em uso.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
          break;
        default:
          errorMessage = 'Erro ao criar conta. Tente novamente.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['register-root']}>
      <div className={styles['register-glow']} />
      
      <div className={styles['register-container']}>
        <img 
          src="/window.svg" 
          alt="MabelSoftware Logo" 
          className={styles['register-logo']} 
        />
        <h1 className={styles['register-title']}>Criar nova conta</h1>
        
        <form onSubmit={handleRegister} className={styles['register-form']}>
          <div className={styles['register-field']}>
            <label className={styles['register-label']}>
              📧 Email
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className={styles['register-input']}
              placeholder="seu@email.com"
            />
          </div>
          
          <div className={styles['register-field']}>
            <label className={styles['register-label']}>
              🔒 Senha
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className={styles['register-input']}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className={styles['register-submit']}
          >
            {loading ? '⏳ Criando conta...' : '✨ Criar conta'}
          </button>
          
          {error && (
            <div className={styles['register-error']}>
              ❌ {error}
            </div>
          )}
        </form>
        
        <p className={styles['register-footer']}>
          Já tem conta? <Link href="/login">Fazer login</Link>
        </p>
      </div>
    </div>
  );
}
