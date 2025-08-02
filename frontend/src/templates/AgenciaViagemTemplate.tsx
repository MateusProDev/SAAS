import React, { useState } from 'react';

interface AgenciaViagemTemplateProps {
  site: {
    name?: string;
    title?: string;
    description?: string;
    businessName?: string;
    address?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    destinos?: Array<{
      nome: string;
      descricao: string;
    }>;
    packages?: Array<{
      id: string;
      name: string;
      description: string;
      price: string;
      duration: string;
      destination: string;
      image?: string;
      category?: string;
    }>;
    destinations?: Array<{
      id: string;
      name: string;
      description: string;
      image?: string;
      highlights: string[];
    }>;
    testimonials?: Array<{
      id: string;
      name: string;
      text: string;
      rating: number;
      destination?: string;
    }>;
    settings?: {
      primaryColor?: string;
      secondaryColor?: string;
      fontFamily?: string;
    };
  };
}

export function AgenciaViagemTemplate({ site }: AgenciaViagemTemplateProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const primaryColor = site.settings?.primaryColor || '#00c3ff';
  const secondaryColor = site.settings?.secondaryColor || '#ffff1c';
  const fontFamily = site.settings?.fontFamily || 'Montserrat, Arial, sans-serif';
  const whatsapp = site.whatsapp || '';

  const packages = site.packages || [
    {
      id: '1',
      name: 'Pacote Europa Clássica',
      description: 'Conheça as principais capitais europeias em uma viagem inesquecível',
      price: 'R$ 8.500',
      duration: '15 dias',
      destination: 'Europa',
      category: 'internacional'
    },
    {
      id: '2', 
      name: 'Nordeste Completo',
      description: 'Praias paradisíacas e cultura rica do nordeste brasileiro',
      price: 'R$ 2.800',
      duration: '7 dias',
      destination: 'Nordeste',
      category: 'nacional'
    },
    {
      id: '3',
      name: 'Aventura na Amazônia',
      description: 'Explore a maior floresta tropical do mundo',
      price: 'R$ 3.200',
      duration: '5 dias',
      destination: 'Amazônia',
      category: 'aventura'
    }
  ];

  const destinations = site.destinations || site.destinos?.map((dest, index) => ({
    id: String(index),
    name: dest.nome,
    description: dest.descricao,
    highlights: ['Pontos turísticos', 'Cultura local', 'Gastronomia', 'Experiências únicas']
  })) || [
    {
      id: '1',
      name: 'Paris, França',
      description: 'A cidade luz te espera com seus encantos únicos',
      highlights: ['Torre Eiffel', 'Louvre', 'Arco do Triunfo', 'Champs-Élysées']
    },
    {
      id: '2',
      name: 'Rio de Janeiro, Brasil',
      description: 'Cidade maravilhosa com praias deslumbrantes',
      highlights: ['Cristo Redentor', 'Pão de Açúcar', 'Copacabana', 'Santa Teresa']
    },
    {
      id: '3',
      name: 'Tóquio, Japão',
      description: 'Fusão perfeita entre tradição e modernidade',
      highlights: ['Shibuya', 'Templos históricos', 'Gastronomia', 'Tecnologia']
    }
  ];

  const testimonials = site.testimonials || [
    {
      id: '1',
      name: 'Ana Carolina',
      text: 'Viagem perfeita! A agência cuidou de todos os detalhes.',
      rating: 5,
      destination: 'Europa'
    },
    {
      id: '2',
      name: 'Roberto Silva',
      text: 'Experiência única na Amazônia. Recomendo muito!',
      rating: 5,
      destination: 'Amazônia'
    },
    {
      id: '3',
      name: 'Fernanda Costa',
      text: 'As praias do nordeste foram ainda mais bonitas que nas fotos!',
      rating: 5,
      destination: 'Nordeste'
    }
  ];

  const categories = ['todos', ...Array.from(new Set(packages.map(p => p.category || 'geral')))];
  const filteredPackages = selectedCategory === 'todos' 
    ? packages 
    : packages.filter(p => (p.category || 'geral') === selectedCategory);

  return (
    <div style={{ fontFamily, margin: 0, padding: 0, boxSizing: 'border-box' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .hamburger { display: none; flex-direction: column; cursor: pointer; }
        .hamburger div { width: 25px; height: 3px; background: white; margin: 3px 0; transition: 0.3s; }
        .nav-menu { display: flex; }
        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .nav-menu { 
            display: ${isMenuOpen ? 'flex' : 'none'}; 
            flex-direction: column; 
            position: absolute; 
            top: 100%; 
            left: 0; 
            width: 100%; 
            background: ${primaryColor}; 
            z-index: 1000;
          }
          .nav-menu a { 
            padding: 15px 20px; 
            border-bottom: 1px solid rgba(255,255,255,0.1); 
          }
          .container { padding: 0 15px; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .hero h1 { font-size: 32px !important; }
          .packages-grid { grid-template-columns: 1fr !important; }
          .destinations-grid { grid-template-columns: 1fr !important; }
          .category-filters { flex-wrap: wrap; gap: 10px; }
        }
        .package-card:hover, .destination-card:hover { transform: translateY(-5px); }
        .btn-primary { 
          background: ${primaryColor}; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 6px; 
          cursor: pointer; 
          font-weight: bold;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary:hover { 
          background: ${secondaryColor === '#ffff1c' ? '#2E86AB' : secondaryColor}; 
          transform: translateY(-2px);
        }
        .btn-category {
          background: white;
          border: 2px solid ${primaryColor};
          color: ${primaryColor};
          padding: 8px 16px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }
        .btn-category.active, .btn-category:hover {
          background: ${primaryColor};
          color: white;
        }
        .section { padding: 80px 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .testimonial-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          text-align: center;
          transition: transform 0.3s;
        }
        .testimonial-card:hover { transform: translateY(-5px); }
      `}</style>

      {/* Navbar */}
      <nav style={{
        background: primaryColor,
        padding: '15px 0',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {site.name || site.title}
          </div>
          
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="nav-menu" style={{
            listStyle: 'none',
            gap: '30px',
            alignItems: 'center'
          }}>
            <a href="#home" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Início</a>
            <a href="#about" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Sobre</a>
            <a href="#packages" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Pacotes</a>
            <a href="#destinations" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Destinos</a>
            <a href="#testimonials" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Depoimentos</a>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Contato</a>
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp}`} 
                className="btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Reservar
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero" style={{
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '120px 20px 80px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '48px',
            marginBottom: '20px',
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}>
            {site.name || site.title || 'Realize a Viagem dos Seus Sonhos'}
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '30px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 30px'
          }}>
            Descubra destinos incríveis e viva experiências únicas ao redor do mundo
          </p>
          {whatsapp && (
            <a 
              href={`https://wa.me/${whatsapp}`}
              className="btn-primary"
              style={{
                fontSize: '18px',
                padding: '15px 30px',
                borderRadius: '8px'
              }}
            >
              Planejar Minha Viagem
            </a>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="grid-2" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{
                fontSize: '36px',
                marginBottom: '20px',
                color: primaryColor,
                fontWeight: 'bold'
              }}>
                Sobre Nossa Agência
              </h2>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#666',
                marginBottom: '30px'
              }}>
                {site.description || site.businessName || 'Há mais de 10 anos realizando sonhos e criando memórias inesquecíveis. Nossa paixão é proporcionar experiências únicas de viagem, cuidando de cada detalhe para que você só precise se preocupar em aproveitar cada momento.'}
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginTop: '30px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: primaryColor,
                    marginBottom: '5px'
                  }}>10+</div>
                  <div style={{ color: '#666' }}>Anos de Experiência</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: primaryColor,
                    marginBottom: '5px'
                  }}>5000+</div>
                  <div style={{ color: '#666' }}>Viajantes Felizes</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: primaryColor,
                    marginBottom: '5px'
                  }}>50+</div>
                  <div style={{ color: '#666' }}>Destinos</div>
                </div>
              </div>
            </div>
            <div style={{
              background: `url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
              height: '400px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '48px',
              position: 'relative' as const
            }}>
              <div style={{
                position: 'absolute' as const,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `${primaryColor}80`,
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{ fontSize: '64px', marginBottom: '10px' }}>✈️</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Sua Próxima Aventura</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="section">
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center',
            marginBottom: '20px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            Nossos Pacotes
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '40px',
            fontSize: '18px'
          }}>
            Pacotes especialmente selecionados para diferentes tipos de viajantes
          </p>

          {/* Category Filters */}
          <div className="category-filters" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '50px',
            flexWrap: 'wrap'
          }}>
            {categories.map((category) => (
              <button
                key={category}
                className={`btn-category ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'todos' ? 'Todos' : 
                 category === 'nacional' ? 'Nacional' :
                 category === 'internacional' ? 'Internacional' :
                 category === 'aventura' ? 'Aventura' :
                 category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="packages-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {filteredPackages.map((packageItem, index) => (
              <div 
                key={packageItem.id}
                className="package-card"
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  height: '220px',
                  background: packageItem.image ? 
                    `url(${packageItem.image}) center/cover` : 
                    "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '48px',
                  position: 'relative' as const
                }}>
                  {!packageItem.image && (
                    <div style={{
                      position: 'absolute' as const,
                      bottom: '15px',
                      left: '15px',
                      background: primaryColor,
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {index % 4 === 0 ? '🌍' : index % 4 === 1 ? '✈️' : index % 4 === 2 ? '🏖️' : '🎒'}
                    </div>
                  )}
                  <div style={{
                    position: 'absolute' as const,
                    top: '15px',
                    right: '15px',
                    background: 'rgba(255,255,255,0.9)',
                    color: primaryColor,
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {packageItem.duration}
                  </div>
                </div>
                <div style={{ padding: '25px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{
                      fontSize: '22px',
                      color: primaryColor,
                      margin: 0
                    }}>
                      {packageItem.name}
                    </h3>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: secondaryColor === '#ffff1c' ? '#2E86AB' : secondaryColor
                    }}>
                      {packageItem.price}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px',
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    <span style={{ marginRight: '10px' }}>📍</span>
                    {packageItem.destination}
                  </div>
                  <p style={{
                    color: '#666',
                    marginBottom: '20px',
                    lineHeight: '1.6'
                  }}>
                    {packageItem.description}
                  </p>
                  {whatsapp && (
                    <a 
                      href={`https://wa.me/${whatsapp}?text=Olá! Tenho interesse no pacote: ${packageItem.name}`}
                      className="btn-primary"
                      style={{
                        textDecoration: 'none',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '16px'
                      }}
                    >
                      Solicitar Orçamento
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section id="destinations" className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center',
            marginBottom: '20px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            Destinos Populares
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '50px',
            fontSize: '18px'
          }}>
            Conheça alguns dos destinos mais procurados pelos nossos clientes
          </p>
          
          <div className="destinations-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {destinations.map((destination, index) => (
              <div 
                key={destination.id}
                className="destination-card"
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  height: '200px',
                  background: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '48px',
                  position: 'relative' as const
                }}>
                  <div style={{
                    position: 'absolute' as const,
                    bottom: '15px',
                    right: '15px',
                    background: primaryColor,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {index % 8 === 0 ? '🏝️' : 
                     index % 8 === 1 ? '🏔️' : 
                     index % 8 === 2 ? '🏛️' : 
                     index % 8 === 3 ? '🌊' : 
                     index % 8 === 4 ? '🌴' : 
                     index % 8 === 5 ? '🗽' : 
                     index % 8 === 6 ? '🎭' : '🏰'}
                  </div>
                  <div style={{
                    position: 'absolute' as const,
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                    borderRadius: '0'
                  }}></div>
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{
                    fontSize: '22px',
                    marginBottom: '10px',
                    color: primaryColor
                  }}>
                    {destination.name}
                  </h3>
                  <p style={{
                    color: '#666',
                    marginBottom: '20px',
                    lineHeight: '1.6'
                  }}>
                    {destination.description}
                  </p>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      marginBottom: '10px',
                      color: primaryColor
                    }}>
                      Principais Atrações:
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {destination.highlights.map((highlight, idx) => {
                        const iconMap: { [key: string]: string } = {
                          'Torre Eiffel': '🗼',
                          'Louvre': '🏛️',
                          'Arco do Triunfo': '🏛️',
                          'Champs-Élysées': '🛍️',
                          'Cristo Redentor': '⛪',
                          'Pão de Açúcar': '🏔️',
                          'Copacabana': '🏖️',
                          'Santa Teresa': '🎨',
                          'Shibuya': '🌃',
                          'Templos históricos': '⛩️',
                          'Gastronomia': '🍣',
                          'Tecnologia': '🤖',
                          'Pontos turísticos': '📸',
                          'Cultura local': '🎭',
                          'Experiências únicas': '✨'
                        };
                        const icon = iconMap[highlight] || '🎯';
                        return (
                          <span
                            key={idx}
                            style={{
                              background: `${primaryColor}15`,
                              color: primaryColor,
                              padding: '6px 12px',
                              borderRadius: '15px',
                              fontSize: '13px',
                              fontWeight: '500',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <span>{icon}</span>
                            {highlight}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section">
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center',
            marginBottom: '20px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            O Que Nossos Viajantes Dizem
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '50px',
            fontSize: '18px'
          }}>
            Experiências reais de quem viajou conosco
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div style={{
                  color: '#ffc107',
                  fontSize: '20px',
                  marginBottom: '15px'
                }}>
                  {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                </div>
                <p style={{
                  fontStyle: 'italic',
                  color: '#666',
                  marginBottom: '20px',
                  lineHeight: '1.6'
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{
                  fontWeight: 'bold',
                  color: primaryColor
                }}>
                  {testimonial.name}
                </div>
                {testimonial.destination && (
                  <div style={{
                    fontSize: '14px',
                    color: '#999',
                    marginTop: '5px'
                  }}>
                    Viagem para {testimonial.destination}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center',
            marginBottom: '50px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            Planeje Sua Próxima Viagem
          </h2>
          
          <div className="grid-2" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }}>
                {site.phone && (
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: primaryColor,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        color: 'white'
                      }}>
                        📞
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#333' }}>Telefone</div>
                        <div style={{ color: '#666' }}>{site.phone}</div>
                      </div>
                    </div>
                  </div>
                )}

                {site.email && (
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: primaryColor,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        color: 'white'
                      }}>
                        ✉️
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#333' }}>Email</div>
                        <div style={{ color: '#666' }}>{site.email}</div>
                      </div>
                    </div>
                  </div>
                )}

                {site.address && (
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: primaryColor,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        color: 'white'
                      }}>
                        📍
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#333' }}>Endereço</div>
                        <div style={{ color: '#666' }}>{site.address}</div>
                      </div>
                    </div>
                  </div>
                )}

                {whatsapp && (
                  <a 
                    href={`https://wa.me/${whatsapp}`}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      fontSize: '16px'
                    }}
                  >
                    💬 Falar com Consultor
                  </a>
                )}
              </div>
            </div>

            <div style={{
              background: primaryColor,
              height: '400px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              textAlign: 'center',
              padding: '20px'
            }}>
              <div>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🕒</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                  Horário de Atendimento
                </div>
                <div>Segunda à Sexta: 8h às 18h</div>
                <div>Sábado: 8h às 14h</div>
                <div>Domingo: Fechado</div>
                <div style={{ marginTop: '20px', fontSize: '16px', opacity: 0.9 }}>
                  ✈️ Consultorias online 24h
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: primaryColor,
        color: 'white',
        padding: '40px 20px 20px',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginBottom: '30px'
          }}>
            <div>
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>{site.name || site.title}</h3>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                Agência especializada em viagens personalizadas e experiências inesquecíveis
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Links Rápidos</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#home" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Início</a>
                <a href="#about" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Sobre</a>
                <a href="#packages" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Pacotes</a>
                <a href="#destinations" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Destinos</a>
                <a href="#contact" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Contato</a>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Redes Sociais</h4>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <a href="#" style={{ color: 'white', fontSize: '24px' }}>📘</a>
                <a href="#" style={{ color: 'white', fontSize: '24px' }}>📷</a>
                <a href="#" style={{ color: 'white', fontSize: '24px' }}>💬</a>
              </div>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '20px',
            opacity: 0.8
          }}>
            © {new Date().getFullYear()} {site.name || site.title}. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
