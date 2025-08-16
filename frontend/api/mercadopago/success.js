// API Route para finalizar upgrade após pagamento Mercado Pago
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const { userId, plan } = req.query;
  if (!userId || !plan) return res.status(400).end();
  try {
    const db = getFirestore();
    const userRef = doc(db, 'users', userId);
    let update = { plan };
    if (plan === 'pro') {
      update.trialEndsAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    }
    await updateDoc(userRef, update);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
