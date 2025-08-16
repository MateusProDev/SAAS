import mercadopago from 'mercadopago';

mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_ACCESS_TOKEN);

export async function POST(req) {
  const body = await req.json();
  const { plan, userId } = body;
  let price = 0;
  if (plan === 'basic') price = 29.9;
  if (plan === 'pro') price = 99.9;

  const preference = { 
    items: [
      {
        title: `Plano ${plan.toUpperCase()} - SaaS` ,
        quantity: 1,
        unit_price: price,
        currency_id: 'BRL',
      },
    ],
    payment_methods: {
      excluded_payment_types: [],
      default_payment_method_id: 'pix',
    },
    back_urls: {
      success: `${process.env.NEXT_PUBLIC_API_URL}/api/mercadopago/success?userId=${userId}&plan=${plan}`,
      failure: `${process.env.NEXT_PUBLIC_API_URL}/upgrade`,
      pending: `${process.env.NEXT_PUBLIC_API_URL}/upgrade`,
    },
    auto_return: 'approved',
    metadata: { userId, plan },
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    const pixInfo = response.body.point_of_interaction?.transaction_data?.qr_code || null;
    return new Response(JSON.stringify({ id: response.body.id, pix_qr: pixInfo }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
