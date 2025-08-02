import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";

export function useFirebaseAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Só inicializa no lado do cliente
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const { auth } = await import("../utils/firebase");
        if (auth) {
          const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
          });
          return unsubscribe;
        }
      } catch (error) {
        console.error('Erro ao inicializar Firebase Auth:', error);
        setLoading(false);
      }
    };

    const unsubscribePromise = initAuth();
    
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, []);

  return { user, loading };
}
