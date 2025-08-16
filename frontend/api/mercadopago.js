// API Route para criar preferência Mercado Pago (Vercel Serverless)
import mercadopago from 'mercadopago';

mercadopago.configurations.setAccessToken(process.env.MERCADOPAGO_ACCESS_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { plan, userId } = req.body;
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
  // Se PIX disponível, retorna link/qr_code
  const pixInfo = response.body.point_of_interaction?.transaction_data?.qr_code || null;
  res.status(200).json({ id: response.body.id, pix_qr: pixInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
