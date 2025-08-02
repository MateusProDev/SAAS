import React, { useState } from 'react';

interface BarbeariaTemplateProps {
  site: {
    name?: string;
    title?: string;
    description?: string;
    businessName?: string;
    address?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    hero?: {
      title: string;
      subtitle: string;
      buttonText: string;
      buttonUrl: string;
    };
    about?: {
      text: string;
    };
    services?: Array<{
      id?: string;
      name: string;
      description: string;
      price?: string;
    }>;
    contact?: {
      phone: string;
      email: string;
      address: string;
      whatsapp: string;
    };
    settings?: {
      primaryColor?: string;
      secondaryColor?: string;
      fontFamily?: string;
    };
    gallery?: Array<{
      id: string;
      url: string;
      alt: string;
    }>;
  };
}

export const BarbeariaTemplate: React.FC<BarbeariaTemplateProps> = ({ site }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Extract data with fallbacks
  const primaryColor = site.settings?.primaryColor || '#8B4513';
  const secondaryColor = site.settings?.secondaryColor || '#DAA520';
  const fontFamily = site.settings?.fontFamily || 'Inter, sans-serif';
  const whatsapp = site.whatsapp || site.contact?.whatsapp || '';

  const services = site.services || [
    {
      id: '1',
      name: 'Corte Tradicional',
      description: 'Corte clássico com acabamento perfeito',
      price: 'R$ 25,00'
    },
    {
      id: '2',
      name: 'Barba Completa',
      description: 'Aparar e modelar a barba com navalha',
      price: 'R$ 20,00'
    },
    {
      id: '3',
      name: 'Combo Completo',
      description: 'Corte + Barba + Acabamento',
      price: 'R$ 40,00'
    }
  ];

  const gallery = site.gallery || [
    { id: '1', url: '/images/gallery1.jpg', alt: 'Corte masculino' },
    { id: '2', url: '/images/gallery2.jpg', alt: 'Barba modelada' },
    { id: '3', url: '/images/gallery3.jpg', alt: 'Ambiente da barbearia' },
    { id: '4', url: '/images/gallery4.jpg', alt: 'Produtos profissionais' }
  ];

  const heroTitle = site.hero?.title || site.name || site.title || 'Barbearia Tradicional';
  const heroSubtitle = site.hero?.subtitle || 'Tradição, estilo e atendimento de qualidade';
  const aboutText = site.about?.text || site.description || site.businessName || 'Há mais de 10 anos oferecendo os melhores serviços de barbearia com tradição e qualidade. Nossa paixão é fazer você se sentir bem consigo mesmo.';

  const styles = {
    fontFamily,
    margin: 0,
    padding: 0,
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={styles}>
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
        }
        .service-card:hover { transform: translateY(-5px); }
        .btn-primary { 
          background: ${primaryColor}; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 6px; 
          cursor: pointer; 
          font-weight: bold;
          transition: all 0.3s;
        }
        .btn-primary:hover { 
          background: ${secondaryColor}; 
          transform: translateY(-2px);
        }
        .section { padding: 80px 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .gallery-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
          gap: 20px; 
        }
        .gallery-item { 
          border-radius: 12px; 
          overflow: hidden; 
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }
        .gallery-item:hover { transform: scale(1.05); }
        .gallery-item img { width: 100%; height: 200px; object-fit: cover; }
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
            <a href="#services" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Serviços</a>
            <a href="#gallery" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Galeria</a>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Contato</a>
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp}`} 
                className="btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Agendar
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero" style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        color: 'white',
        padding: '120px 20px 80px',
        textAlign: 'center' as const
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '48px',
            marginBottom: '20px',
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}>
            {heroTitle}
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '30px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 30px'
          }}>
            {heroSubtitle}
          </p>
          {whatsapp && (
            <a 
              href={`https://wa.me/${whatsapp}`}
              className="btn-primary"
              style={{
                textDecoration: 'none',
                fontSize: '18px',
                padding: '15px 30px',
                borderRadius: '8px',
                display: 'inline-block'
              }}
            >
              Agendar Horário
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
                Sobre Nossa Barbearia
              </h2>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#666',
                marginBottom: '30px'
              }}>
                {aboutText}
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginTop: '30px'
              }}>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: primaryColor,
                    marginBottom: '5px'
                  }}>10+</div>
                  <div style={{ color: '#666' }}>Anos de Experiência</div>
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: primaryColor,
                    marginBottom: '5px'
                  }}>500+</div>
                  <div style={{ color: '#666' }}>Clientes Satisfeitos</div>
                </div>
                <div style={{ textAlign: 'center' as const }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: primaryColor,
                    marginBottom: '5px'
                  }}>100%</div>
                  <div style={{ color: '#666' }}>Qualidade</div>
                </div>
              </div>
            </div>
            <div style={{
              background: `url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
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
                  <div style={{ fontSize: '64px', marginBottom: '10px' }}>💈</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Tradição & Qualidade</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center' as const,
            marginBottom: '20px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            Nossos Serviços
          </h2>
          <p style={{
            textAlign: 'center' as const,
            color: '#666',
            marginBottom: '50px',
            fontSize: '18px'
          }}>
            Oferecemos os melhores serviços com qualidade e profissionalismo
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {services.map((service, index) => (
              <div 
                key={service.id || index}
                className="service-card"
                style={{
                  background: 'white',
                  padding: '0',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  textAlign: 'center' as const,
                  border: `2px solid ${primaryColor}20`,
                  transition: 'all 0.3s',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: index === 0 ? 
                    `url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80') center/cover` :
                    index === 1 ?
                    `url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80') center/cover` :
                    `url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80') center/cover`,
                  position: 'relative' as const
                }}>
                  <div style={{
                    position: 'absolute' as const,
                    top: '15px',
                    right: '15px',
                    background: primaryColor,
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: 'white'
                  }}>
                    {index === 0 ? '✂️' : index === 1 ? '🪒' : index === 2 ? '💈' : '✨'}
                  </div>
                </div>
                <div style={{ padding: '20px 30px 30px' }}>
                  <h3 style={{
                    fontSize: '22px',
                    marginBottom: '10px',
                    color: primaryColor
                  }}>
                    {service.name}
                  </h3>
                  <p style={{
                    color: '#666',
                    marginBottom: '20px',
                    lineHeight: '1.6'
                  }}>
                    {service.description}
                  </p>
                  {service.price && (
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: secondaryColor
                    }}>
                      {service.price}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center' as const,
            marginBottom: '20px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            Nossa Galeria
          </h2>
          <p style={{
            textAlign: 'center' as const,
            color: '#666',
            marginBottom: '50px',
            fontSize: '18px'
          }}>
            Veja alguns dos nossos trabalhos
          </p>
          
          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <div key={image.id} className="gallery-item" style={{
                background: index === 0 ? 
                  "url('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80') center/cover" :
                  index === 1 ?
                  "url('https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80') center/cover" :
                  index === 2 ?
                  "url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80') center/cover" :
                  index === 3 ?
                  "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80') center/cover" :
                  index === 4 ?
                  "url('https://images.unsplash.com/photo-1560472355-b83f0fe24f56?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80') center/cover" :
                  "url('https://images.unsplash.com/photo-1564564295391-92289148413a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80') center/cover",
                height: '250px',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                color: 'white',
                position: 'relative' as const,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              >
                <div style={{
                  position: 'absolute' as const,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '20px'
                }}>
                  <div style={{
                    textAlign: 'center' as const,
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    {index === 0 ? 'Cortes Modernos' :
                     index === 1 ? 'Barba Profissional' :
                     index === 2 ? 'Estilo Clássico' :
                     index === 3 ? 'Ambiente Premium' :
                     index === 4 ? 'Produtos de Qualidade' :
                     'Resultado Impecável'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center' as const,
            marginBottom: '50px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            Entre em Contato
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
                      textDecoration: 'none',
                      display: 'inline-block',
                      width: '100%',
                      textAlign: 'center' as const,
                      fontSize: '16px'
                    }}
                  >
                    💬 Chamar no WhatsApp
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
              textAlign: 'center' as const,
              padding: '20px'
            }}>
              <div>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🗓️</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                  Horário de Funcionamento
                </div>
                <div>Segunda à Sexta: 8h às 18h</div>
                <div>Sábado: 8h às 16h</div>
                <div>Domingo: Fechado</div>
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
        textAlign: 'center' as const
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
                Barbearia especializada em cortes clássicos e modernos
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Links Rápidos</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#home" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Início</a>
                <a href="#about" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Sobre</a>
                <a href="#services" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Serviços</a>
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
};
