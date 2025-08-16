import { usePlan } from '../contexts/PlanContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function usePlanGuard(required: 'free' | 'basic' | 'pro') {
  const { plan, isTrialActive } = usePlan();
  const router = useRouter();

  useEffect(() => {
    if (required === 'pro' && plan !== 'pro' && !isTrialActive) {
      router.replace('/upgrade');
    }
    if (required === 'basic' && plan === 'free') {
      router.replace('/upgrade');
    }
  }, [plan, isTrialActive, required, router]);

  return { plan, isTrialActive };
}
