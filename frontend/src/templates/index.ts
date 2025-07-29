// Templates HTML prontos para seleção

export const templates = [
  {
    id: 'comercial',
    name: 'Comercial Padrão',
    thumbnail: '/logo192.png', // Substitua por miniatura real depois
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .header { background: #2C3E50; color: #fff; padding: 32px 0; text-align: center; }
    .container { max-width: 800px; margin: 40px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 32px; }
    h1 { color: #2C3E50; }
    .services { margin-top: 32px; }
    .service { background: #3498DB; color: #fff; padding: 16px; border-radius: 6px; margin-bottom: 12px; }
    .footer { background: #2C3E50; color: #fff; text-align: center; padding: 16px 0; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{title}}</h1>
    <p>{{description}}</p>
  </div>
  <div class="container">
    <h2>Sobre Nós</h2>
    <p>Somos uma empresa dedicada a oferecer soluções inovadoras para o seu negócio. Conte conosco para impulsionar seus resultados!</p>
    <div class="services">
      <h3>Serviços</h3>
      <div class="service">Consultoria Empresarial</div>
      <div class="service">Desenvolvimento de Sistemas</div>
      <div class="service">Suporte Técnico Especializado</div>
    </div>
  </div>
  <div class="footer">
    &copy; {{year}} {{title}} - Todos os direitos reservados.
  </div>
</body>
</html>`
  },
  {
    id: 'barbearia',
    name: 'Barbearia',
    thumbnail: '/logo512.png',
    html: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <style>
    body { font-family: Arial, sans-serif; background: #1A1A1A; color: #fff; margin: 0; }
    .header { background: #8B4513; padding: 32px 0; text-align: center; }
    .container { max-width: 700px; margin: 40px auto; background: #222; border-radius: 8px; box-shadow: 0 2px 8px #0005; padding: 32px; }
    h1 { color: #FFD700; }
    .services { margin-top: 32px; }
    .service { background: #D2691E; color: #fff; padding: 16px; border-radius: 6px; margin-bottom: 12px; }
    .footer { background: #8B4513; color: #fff; text-align: center; padding: 16px 0; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{title}}</h1>
    <p>{{description}}</p>
  </div>
  <div class="container">
    <h2>Sobre a Barbearia</h2>
    <p>Tradição, estilo e atendimento de qualidade. Venha conhecer nossos serviços!</p>
    <div class="services">
      <h3>Serviços</h3>
      <div class="service">Corte Tradicional</div>
      <div class="service">Barba</div>
      <div class="service">Corte + Barba</div>
    </div>
  </div>
  <div class="footer">
    &copy; {{year}} {{title}} - Todos os direitos reservados.
  </div>
</body>
</html>`
  }
];
