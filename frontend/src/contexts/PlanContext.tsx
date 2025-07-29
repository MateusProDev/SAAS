import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '../lib/api';

export interface UserPlan {
  plan: 'free' | 'pro';
  maxSites: number;
  customDomain: boolean;
  monthlyPrice: number;
  features: string[];
  activeUntil?: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  plan: 'free' | 'pro';
  maxSites: number;
  currentSites: number;
  customDomain: boolean;
  activeUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface PlanContextType {
  userProfile: UserProfile | null;
  plans: Record<string, UserPlan>;
  loading: boolean;
  error: string;
  canCreateSite: boolean;
  canUseCustomDomain: boolean;
  upgradeToProPlan: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
};

// Definição dos planos
export const PLANS: Record<string, UserPlan> = {
  free: {
    plan: 'free',
    maxSites: 2,
    customDomain: false,
    monthlyPrice: 0,
    features: [
      '2 sites inclusos',
      'Domínio padrão (.turflow.app)',
      'Editor HTML básico',
      'Suporte por email'
    ]
  },
  pro: {
    plan: 'pro',
    maxSites: -1, // Ilimitado
    customDomain: true,
    monthlyPrice: 49.99,
    features: [
      'Sites ilimitados',
      'Domínio personalizado',
      'Editor HTML avançado',
      'Upload de imagens',
      'Analytics básico',
      'Suporte prioritário',
      'Templates premium',
      'SEO otimizado'
    ]
  }
};

interface PlanProviderProps {
  children: ReactNode;
}

export const PlanProvider: React.FC<PlanProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const plans = PLANS;

  // Verificar se pode criar novo site
  const canCreateSite = userProfile 
    ? userProfile.plan === 'pro' || userProfile.currentSites < userProfile.maxSites
    : false;

  // Verificar se pode usar domínio personalizado
  const canUseCustomDomain = userProfile?.plan === 'pro' || false;

  // Buscar perfil do usuário
  const fetchUserProfile = async () => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Primeiro, tentar buscar o perfil existente
      const response = await api.get(`/user/profile`);
      setUserProfile(response.data);
    } catch (err: any) {
      // Se não existe, criar perfil padrão
      if (err.response?.status === 404) {
        try {
          const newProfile = {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || '',
            plan: 'free' as const,
            maxSites: PLANS.free.maxSites,
            currentSites: 0,
            customDomain: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          const createResponse = await api.post('/user/profile', newProfile);
          setUserProfile(createResponse.data);
        } catch (createErr) {
          console.error('Erro ao criar perfil:', createErr);
          setError('Erro ao criar perfil do usuário');
        }
      } else {
        console.error('Erro ao buscar perfil:', err);
        setError('Erro ao carregar perfil do usuário');
      }
    } finally {
      setLoading(false);
    }
  };

  // Atualizar para plano PRO
  const upgradeToProPlan = async () => {
    if (!user || !userProfile) return;

    try {
      setLoading(true);
      setError('');

      const response = await api.post('/user/upgrade-plan', {
        plan: 'pro'
      });

      setUserProfile(response.data);
      alert('Plano atualizado para PRO com sucesso!');
    } catch (err: any) {
      console.error('Erro ao atualizar plano:', err);
      setError('Erro ao atualizar plano');
      alert('Erro ao atualizar plano. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Atualizar perfil
  const refreshUserProfile = async () => {
    await fetchUserProfile();
  };

  // Buscar perfil quando usuário muda
  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const value: PlanContextType = {
    userProfile,
    plans,
    loading,
    error,
    canCreateSite,
    canUseCustomDomain,
    upgradeToProPlan,
    refreshUserProfile
  };

  return (
    <PlanContext.Provider value={value}>
      {children}
    </PlanContext.Provider>
  );
};
