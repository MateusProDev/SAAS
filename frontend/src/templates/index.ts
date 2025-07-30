// Templates disponíveis para popular o Firestore
export const templates = [
  {
    id: 'barbearia',
    name: 'Barbearia',
    description: 'Template profissional para barbearias, com agendamento e serviços.',
    features: ['Agendamento online', 'Lista de serviços', 'Contato rápido'],
    previewImage: '',
    html: `<div style="font-family: Arial, sans-serif; background: #1A1A1A; color: #fff; min-height: 100vh; margin: 0"><div style="background: #8B4513; padding: 32px 0; text-align: center"><h1 style="color: #FFD700; font-size: 48px">{{name}}</h1><p style="font-size: 20px">{{description}}</p></div><div style="max-width: 700px; margin: 40px auto; background: #222; border-radius: 8px; box-shadow: 0 2px 8px #0005; padding: 32px"><h2 style="color: #FFD700">Sobre a Barbearia</h2><p>Tradição, estilo e atendimento de qualidade. Venha conhecer nossos serviços!</p><div style="margin-top: 32px"><h3 style="color: #FFD700">Serviços</h3>{{services}}</div><div style="margin-top: 32px"><h3 style="color: #FFD700">Contato</h3><p><b>Endereço:</b> {{address}}</p><p><b>Email:</b> {{email}}</p><p><b>Telefone:</b> {{phone}}</p></div></div><div style="background: #8B4513; color: #fff; text-align: center; padding: 16px 0; margin-top: 40px">&copy; {{year}} {{name}} - Todos os direitos reservados.</div></div>`
  },
  {
    id: 'comercial',
    name: 'Comercial',
    description: 'Template versátil para empresas e negócios locais.',
    features: ['Página institucional', 'Seção de produtos/serviços', 'Formulário de contato'],
    previewImage: '',
    html: `<div style="font-family: Segoe UI, Arial, sans-serif; background: #f5f6fa; color: #222; min-height: 100vh; margin: 0"><header style="background: #0052cc; color: #fff; padding: 32px 0; text-align: center"><h1 style="font-size: 44px">{{name}}</h1><p style="font-size: 20px">{{description}}</p></header><main style="max-width: 800px; margin: 40px auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 12px #0002; padding: 32px"><h2 style="color: #0052cc">Sobre a Empresa</h2><p>{{businessName}}</p><div style="margin-top: 32px"><h3 style="color: #0052cc">Serviços</h3>{{services}}</div><div style="margin-top: 32px"><h3 style="color: #0052cc">Contato</h3><p><b>Endereço:</b> {{address}}</p><p><b>Email:</b> {{email}}</p><p><b>Telefone:</b> {{phone}}</p></div></main><footer style="background: #0052cc; color: #fff; text-align: center; padding: 16px 0; margin-top: 40px">&copy; {{year}} {{name}} - Todos os direitos reservados.</footer></div>`
  },
  {
    id: 'agencia',
    name: 'Agência de Viagem',
    description: 'Template moderno para agências de turismo e viagens.',
    features: ['Pacotes de viagem', 'Galeria de fotos', 'Solicitação de orçamento'],
    previewImage: '',
    html: `<div style="font-family: Montserrat, Arial, sans-serif; background: linear-gradient(135deg, #00c3ff 0%, #ffff1c 100%); color: #222; min-height: 100vh; margin: 0"><header style="background: #00c3ff; color: #fff; padding: 32px 0; text-align: center; border-bottom: 4px solid #ffff1c"><h1 style="font-size: 44px">{{name}}</h1><p style="font-size: 20px">{{description}}</p></header><main style="max-width: 900px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 16px #0002; padding: 32px"><h2 style="color: #00c3ff">Destinos Populares</h2><div style="display: flex; flex-wrap: wrap; gap: 24px; margin-top: 24px">{{destinos}}</div><div style="margin-top: 40px"><h3 style="color: #00c3ff">Contato</h3><p><b>Endereço:</b> {{address}}</p><p><b>Email:</b> {{email}}</p><p><b>Telefone:</b> {{phone}}</p></div></main><footer style="background: #00c3ff; color: #fff; text-align: center; padding: 16px 0; margin-top: 40px">&copy; {{year}} {{name}} - Agência de Viagens</footer></div>`
  }
];
