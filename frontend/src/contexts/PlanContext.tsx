"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebaseAuthUser } from '../hooks/useFirebaseAuthUser';

export type PlanType = 'free' | 'basic' | 'pro';

export interface PlanInfo {
  plan: PlanType;
  trialEndsAt?: number | null;
  isTrialActive: boolean;
  upgrade: (newPlan: PlanType) => Promise<void>;
  downgrade: (newPlan: PlanType) => Promise<void>;
  refresh: () => Promise<void>;
}

const PlanContext = createContext<PlanInfo | undefined>(undefined);

export const usePlan = () => {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
};

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useFirebaseAuthUser();
  const [plan, setPlan] = useState<PlanType>('free');
  const [trialEndsAt, setTrialEndsAt] = useState<number | null>(null);
  const [isTrialActive, setIsTrialActive] = useState(false);

  // Carrega plano do Firestore
  const refresh = async () => {
    if (!user?.uid) return;
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      setPlan(data.plan || 'free');
      setTrialEndsAt(data.trialEndsAt || null);
      setIsTrialActive(data.plan === 'pro' && data.trialEndsAt && Date.now() < data.trialEndsAt);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [user?.uid]);

  // Upgrade de plano
  const upgrade = async (newPlan: PlanType) => {
    if (!user?.uid) return;
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
    let update: any = { plan: newPlan };
    if (newPlan === 'pro') {
      update.trialEndsAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 dias grátis
    }
    await updateDoc(userRef, update);
    await refresh();
  };

  // Downgrade de plano
  const downgrade = async (newPlan: PlanType) => {
    if (!user?.uid) return;
    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { plan: newPlan, trialEndsAt: null });
    await refresh();
  };

  return (
    <PlanContext.Provider value={{ plan, trialEndsAt, isTrialActive, upgrade, downgrade, refresh }}>
      {children}
    </PlanContext.Provider>
  );
};
