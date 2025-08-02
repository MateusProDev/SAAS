import React, { useState } from 'react';

interface ComercialTemplateProps {
  site: {
    name?: string;
    title?: string;
    description?: string;
    businessName?: string;
    address?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    services?: Array<{
      id?: string;
      name: string;
      description: string;
      price?: string;
    }>;
    products?: Array<{
      id: string;
      name: string;
      description: string;
      price: string;
      image?: string;
      category?: string;
    }>;
    testimonials?: Array<{
      id: string;
      name: string;
      text: string;
      rating: number;
    }>;
    settings?: {
      primaryColor?: string;
      secondaryColor?: string;
      fontFamily?: string;
    };
  };
}

export function ComercialTemplate({ site }: ComercialTemplateProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  const primaryColor = site.settings?.primaryColor || '#0052cc';
  const secondaryColor = site.settings?.secondaryColor || '#0066ff';
  const fontFamily = site.settings?.fontFamily || 'Segoe UI, Arial, sans-serif';
  const whatsapp = site.whatsapp || '';

  const products = site.products || [];
  const services = site.services || [];
  const testimonials = site.testimonials || [
    { id: '1', name: 'João Silva', text: 'Excelente atendimento e produtos de qualidade!', rating: 5 },
    { id: '2', name: 'Maria Santos', text: 'Recomendo a todos, empresa séria e confiável.', rating: 5 },
    { id: '3', name: 'Pedro Costa', text: 'Melhor experiência de compra que já tive.', rating: 5 }
  ];

  const categories = products.length > 0 
    ? ['todos', ...Array.from(new Set(products.map(p => p.category || 'geral')))]
    : ['todos'];
  
  const filteredProducts = selectedCategory === 'todos' 
    ? products 
    : products.filter(p => (p.category || 'geral') === selectedCategory);

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
          .products-grid { grid-template-columns: 1fr !important; }
          .category-filters { flex-wrap: wrap; gap: 10px; }
        }
        .product-card:hover { transform: translateY(-5px); }
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
          background: ${secondaryColor}; 
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
            {(products.length > 0 || services.length > 0) && (
              <a href="#products" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>
                {products.length > 0 ? 'Produtos' : 'Serviços'}
              </a>
            )}
            <a href="#testimonials" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Depoimentos</a>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Contato</a>
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp}`} 
                className="btn-primary"
                style={{ textDecoration: 'none' }}
              >
                Comprar
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
        textAlign: 'center',
        position: 'relative' as const,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute' as const,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80') center/cover`,
          opacity: 0.2
        }}></div>
        <div className="container" style={{ position: 'relative' as const, zIndex: 1 }}>
          <h1 style={{
            fontSize: '48px',
            marginBottom: '20px',
            fontWeight: 'bold',
            lineHeight: '1.2'
          }}>
            {site.name || site.title}
          </h1>
          <p style={{
            fontSize: '20px',
            marginBottom: '30px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 30px'
          }}>
            Qualidade e excelência em produtos e serviços comerciais
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
              Entre em Contato
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
                Sobre Nossa Empresa
              </h2>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#666',
                marginBottom: '30px'
              }}>
                {site.description || site.businessName || 'Somos uma empresa comprometida com a excelência no atendimento e na qualidade dos nossos produtos e serviços. Nossa missão é superar as expectativas dos nossos clientes através de soluções inovadoras e personalizadas.'}
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
                  }}>15+</div>
                  <div style={{ color: '#666' }}>Anos no Mercado</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: primaryColor,
                    marginBottom: '5px'
                  }}>1000+</div>
                  <div style={{ color: '#666' }}>Clientes Atendidos</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: primaryColor,
                    marginBottom: '5px'
                  }}>100%</div>
                  <div style={{ color: '#666' }}>Satisfação</div>
                </div>
              </div>
            </div>
            <div style={{
              background: `url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
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
                  <div style={{ fontSize: '64px', marginBottom: '10px' }}>🏪</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Excelência Comercial</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products/Services Section */}
      {(products.length > 0 || services.length > 0) && (
        <section id="products" className="section">
          <div className="container">
            <h2 style={{
              fontSize: '36px',
              textAlign: 'center',
              marginBottom: '20px',
              color: primaryColor,
              fontWeight: 'bold'
            }}>
              {products.length > 0 ? 'Nossos Produtos' : 'Nossos Serviços'}
            </h2>
            <p style={{
              textAlign: 'center',
              color: '#666',
              marginBottom: '40px',
              fontSize: '18px'
            }}>
              {products.length > 0 
                ? 'Conheça nossa linha completa de produtos de qualidade'
                : 'Oferecemos os melhores serviços com qualidade e profissionalismo'
              }
            </p>

            {/* Category Filters for Products */}
            {products.length > 0 && categories.length > 1 && (
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
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            )}
            
            <div className="products-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {/* Products */}
              {products.length > 0 && filteredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="product-card"
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
                    background: product.image ? 
                      `url(${product.image}) center/cover` : 
                      index % 6 === 0 ? 
                      "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                      index % 6 === 1 ?
                      "url('https://images.unsplash.com/photo-1556742049-0af7e9b87251?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                      index % 6 === 2 ?
                      "url('https://images.unsplash.com/photo-1560472355-536de3962739?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                      index % 6 === 3 ?
                      "url('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                      index % 6 === 4 ?
                      "url('https://images.unsplash.com/photo-1556742111-f6d745c462cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                      "url('https://images.unsplash.com/photo-1556742502-ec7c3e7e0e52?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '48px',
                    position: 'relative' as const
                  }}>
                    {!product.image && (
                      <div style={{
                        position: 'absolute' as const,
                        top: '10px',
                        right: '10px',
                        background: primaryColor,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>
                        {product.category === 'eletrônicos' ? '📱' :
                         product.category === 'roupas' ? '👕' :
                         product.category === 'casa' ? '🏠' :
                         product.category === 'esporte' ? '⚽' :
                         product.category === 'livros' ? '📚' :
                         product.category === 'beleza' ? '💄' :
                         index % 6 === 0 ? '📦' : 
                         index % 6 === 1 ? '🛍️' : 
                         index % 6 === 2 ? '🎯' : 
                         index % 6 === 3 ? '💎' : 
                         index % 6 === 4 ? '🎨' : '✨'}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '25px' }}>
                    {product.category && (
                      <div style={{
                        background: primaryColor + '15',
                        color: primaryColor,
                        padding: '6px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '15px'
                      }}>
                        <span>
                          {product.category === 'eletrônicos' ? '📱' :
                           product.category === 'roupas' ? '👕' :
                           product.category === 'casa' ? '🏠' :
                           product.category === 'esporte' ? '⚽' :
                           product.category === 'livros' ? '📚' :
                           product.category === 'beleza' ? '💄' : '🏷️'}
                        </span>
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </div>
                    )}
                    <h3 style={{
                      fontSize: '22px',
                      marginBottom: '10px',
                      color: primaryColor
                    }}>
                      {product.name}
                    </h3>
                    <p style={{
                      color: '#666',
                      marginBottom: '20px',
                      lineHeight: '1.6'
                    }}>
                      {product.description}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: secondaryColor
                      }}>
                        {product.price}
                      </div>
                      {whatsapp && (
                        <a 
                          href={`https://wa.me/${whatsapp}?text=Olá! Tenho interesse no produto: ${product.name}`}
                          className="btn-primary"
                          style={{ textDecoration: 'none', fontSize: '14px', padding: '8px 16px' }}
                        >
                          Comprar
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Services */}
              {products.length === 0 && services.map((service, idx) => (
                <div 
                  key={service.id || idx}
                  className="product-card"
                  style={{
                    background: 'white',
                    padding: '0',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    border: `2px solid ${primaryColor}20`,
                    transition: 'all 0.3s',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: idx % 6 === 0 ? 
                      "url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                      idx % 6 === 1 ?
                      "url('https://images.unsplash.com/photo-1507003211169-0a1dd7093c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                      idx % 6 === 2 ?
                      "url('https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                      idx % 6 === 3 ?
                      "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                      idx % 6 === 4 ?
                      "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                      "url('https://images.unsplash.com/photo-1586953208448-3804458bfd22?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover",
                    position: 'relative' as const,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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
                      {idx % 8 === 0 ? '🏢' : 
                       idx % 8 === 1 ? '📊' : 
                       idx % 8 === 2 ? '💼' : 
                       idx % 8 === 3 ? '🎯' : 
                       idx % 8 === 4 ? '🛠️' : 
                       idx % 8 === 5 ? '📈' : 
                       idx % 8 === 6 ? '💡' : '🤝'}
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
      )}

      {/* Testimonials Section */}
      <section id="testimonials" className="section" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center',
            marginBottom: '20px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            O Que Nossos Clientes Dizem
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '50px',
            fontSize: '18px'
          }}>
            Depoimentos reais de clientes satisfeitos
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
            textAlign: 'center',
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
                      width: '100%',
                      textAlign: 'center',
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
                Empresa focada em produtos e serviços de alta qualidade
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Links Rápidos</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#home" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Início</a>
                <a href="#about" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Sobre</a>
                <a href="#products" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>
                  {products.length > 0 ? 'Produtos' : 'Serviços'}
                </a>
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
