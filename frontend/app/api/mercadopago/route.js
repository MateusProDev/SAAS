import { MercadoPagoConfig } from 'mercadopago';

export async function POST(req) {
  console.log('--- [DEBUG] MercadoPago POST /api/mercadopago ---');
  console.log('Access Token:', process.env.MERCADOPAGO_ACCESS_TOKEN);
  const body = await req.json();
  console.log('Body recebido:', body);
  const { plan, userId, name, email, cpf, method } = body;
  let price = 0;
  if (plan === 'basic') price = 29.9;
  if (plan === 'pro') price = 99.9;
  console.log('Dados recebidos:', { plan, userId, name, email, cpf, method, price });

  if (!plan || !userId || !name || !email || !cpf) {
    console.error('[MercadoPago] Parâmetros ausentes:', { plan, userId, name, email, cpf });
    return new Response(JSON.stringify({ id: null, pix_qr: null, message: '[DEBUG] Parâmetros ausentes', debug: { plan, userId, name, email, cpf } }), { status: 200 });
  }

  const preference = { 
    items: [
      {
        title: `Plano ${plan.toUpperCase()} - SaaS` ,
        quantity: 1,
        unit_price: price,
        currency_id: 'BRL',
      },
    ],
    payer: {
      name,
      email,
      identification: {
        type: 'CPF',
        number: cpf
      }
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

  console.log('Preference criada:', preference);

  try {
    const mp = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });
    console.log('Instância MercadoPagoConfig criada');
    const response = await mp.preference.create(preference);
    console.log('Resposta da API Mercado Pago:', response);
    const pixInfo = response.point_of_interaction?.transaction_data?.qr_code || null;
    if (!response.id) {
      console.error('[MercadoPago] Falha ao criar preferência:', response);
      return new Response(JSON.stringify({ id: null, pix_qr: null, message: '[DEBUG] Falha ao criar preferência', debug: response }), { status: 200 });
    }
    return new Response(JSON.stringify({ id: response.id, pix_qr: pixInfo, debug: response }), { status: 200 });
  } catch (err) {
    console.error('[MercadoPago] Erro na integração:', err);
    return new Response(JSON.stringify({ id: null, pix_qr: null, message: '[DEBUG] Erro na integração', debug: err }), { status: 200 });
  }
}
