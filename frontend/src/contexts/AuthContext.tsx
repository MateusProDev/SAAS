import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  type User
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, displayName?: string) => Promise<any>;
  signup: (email: string, password: string, displayName?: string) => Promise<any>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
  loading: boolean;
  error: string;
  setError: (error: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      setError('');
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Salvar token no localStorage
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      return result;
    } catch (error: any) {
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  // Função de registro
  const register = async (email: string, password: string, displayName?: string) => {
    try {
      setError('');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar perfil com nome
      if (displayName) {
        await updateProfile(result.user, {
          displayName: displayName
        });
      }
      
      // Salvar token no localStorage
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      return result;
    } catch (error: any) {
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Função para obter token atualizado
  const getToken = async (): Promise<string | null> => {
    if (user) {
      const token = await user.getIdToken(true);
      localStorage.setItem('authToken', token);
      return token;
    }
    return null;
  };

  // Listener para mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Atualizar token
        const token = await user.getIdToken();
        localStorage.setItem('authToken', token);
      } else {
        setUser(null);
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Função para converter códigos de erro em mensagens amigáveis
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/email-already-in-use':
        return 'Email já está em uso';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde';
      default:
        return 'Erro de autenticação';
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    signup: register, // Alias para register
    logout,
    getToken,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
