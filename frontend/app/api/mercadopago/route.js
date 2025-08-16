

import { MercadoPagoConfig } from 'mercadopago';

export async function POST(req) {
  const body = await req.json();
  const { plan, userId, name, email, cpf, method } = body;
  if (!plan || !userId || !name || !email || !cpf) {
    return new Response(JSON.stringify({ error: 'Parâmetros ausentes', debug: { plan, userId, name, email, cpf } }), { status: 400 });
  }
  const prices = { basic: 29.9, pro: 99.9 };
  const price = prices[plan];
  if (!price) {
    return new Response(JSON.stringify({ error: 'Plano inválido' }), { status: 400 });
  }
  const preference = {
    items: [{
      title: `Plano ${plan.toUpperCase()} - SaaS`,
      quantity: 1,
      unit_price: price,
      currency_id: 'BRL',
    }],
    payer: {
      name,
      email,
      identification: { type: 'CPF', number: cpf }
    },
    payment_methods: {
      excluded_payment_types: [],
      default_payment_method_id: method === 'pix' ? 'pix' : undefined,
    },
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_API_URL}/api/mercadopago/success?userId=${userId}&plan=${plan}`,
      failure: `${process.env.NEXT_PUBLIC_API_URL}/upgrade`,
      pending: `${process.env.NEXT_PUBLIC_API_URL}/upgrade`,
    },
    auto_return: 'approved',
    metadata: { userId, plan, method },
  };
  try {
    const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
    const response = await mp.preference.create({ body: preference });
    const pixInfo = response.point_of_interaction?.transaction_data?.qr_code || null;
    if (!response.id) {
      return new Response(JSON.stringify({ id: null, pix_qr: null, message: 'Falha ao criar preferência', debug: response }), { status: 500 });
    }
    return new Response(JSON.stringify({ id: response.id, pix_qr: pixInfo, init_point: response.init_point, debug: response }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, debug: err }), { status: 500 });
  }
}
