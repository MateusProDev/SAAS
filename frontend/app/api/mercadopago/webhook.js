import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// MercadoPago Webhook: Recebe notificações de pagamento
export async function POST(req) {
  try {
    const body = await req.json();
    // MercadoPago envia o 'id' do pagamento
    const paymentId = body.data?.id || body.id;
    if (!paymentId) {
      return new Response(JSON.stringify({ message: 'ID do pagamento ausente' }), { status: 200 });
    }

    // Buscar detalhes do pagamento na API MercadoPago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    const payment = await mpRes.json();

    // Verifica se o pagamento foi aprovado
    if (payment.status === 'approved') {
      const userId = payment.metadata?.userId;
      const plan = payment.metadata?.plan;
      if (userId && plan) {
        const db = getFirestore();
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { plan });
        return new Response(JSON.stringify({ message: 'Plano atualizado com sucesso' }), { status: 200 });
      }
    }
    // Se não aprovado ou sem dados, apenas retorna OK
    return new Response(JSON.stringify({ message: 'Pagamento não aprovado ou dados insuficientes' }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: 'Erro no webhook', error: err.message }), { status: 200 });
  }
}
