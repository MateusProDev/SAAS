import React from 'react';
import { usePlan } from '../contexts/PlanContext';
import { useRouter } from 'next/navigation';

export const PlanGuard: React.FC<{ required: 'free' | 'basic' | 'pro', children: React.ReactNode }> = ({ required, children }) => {
  const { plan, isTrialActive } = usePlan();
  const router = useRouter();

  if (required === 'pro' && plan !== 'pro' && !isTrialActive) {
    router.replace('/upgrade');
    return null;
  }
  if (required === 'basic' && plan === 'free') {
    router.replace('/upgrade');
    return null;
  }
  return <>{children}</>;
};
