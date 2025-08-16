import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const plan = searchParams.get('plan');
  if (!userId || !plan) return new Response(null, { status: 400 });
  try {
    const db = getFirestore();
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
  let update = { plan };
  // O trial só é ativado pelo botão do modal, não pelo pagamento
    if (!snap.exists()) {
      await setDoc(userRef, update);
    } else {
      await updateDoc(userRef, update);
    }
    return Response.redirect('/dashboard');
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
