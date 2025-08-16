
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const plan = searchParams.get('plan');
  if (!userId || !plan) {
    return new Response(JSON.stringify({ error: 'Parâmetros ausentes' }), { status: 400 });
  }
  try {
    const db = getFirestore();
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    let update = { plan };
    if (!snap.exists()) {
      await setDoc(userRef, update);
    } else {
      await updateDoc(userRef, update);
    }
    // Redireciona para dashboard
    return Response.redirect('/dashboard');
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
