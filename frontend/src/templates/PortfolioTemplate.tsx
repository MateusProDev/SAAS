// Função utilitária para determinar se uma cor é clara ou escura
function isColorDark(hex: string) {
  if (!hex) return false;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  if (c.length !== 6) return false;
  const r = parseInt(c.substr(0,2),16);
  const g = parseInt(c.substr(2,2),16);
  const b = parseInt(c.substr(4,2),16);
  // Perceptual luminance
  const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
  return luminance < 0.5;
}
import React, { useState } from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaGithub, 
  FaYoutube, 
  FaTiktok, 
  FaWhatsapp 
} from 'react-icons/fa';

interface PortfolioTemplateProps {
  site: {
    name?: string;
    title?: string;
    description?: string;
    businessName?: string;
    address?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    personalInfo?: {
      name?: string;
      fullName?: string;
      subtitle?: string;
      email?: string;
      phone?: string;
      location?: string;
      whatsapp?: string;
    };
    portfolioData?: {
      personalInfo?: {
        name?: string;
        fullName?: string;
        subtitle?: string;
        email?: string;
        phone?: string;
        location?: string;
        whatsapp?: string;
      };
      about?: {
        description?: string;
      };
      hero?: {
        staticDescription?: string;
        useStaticDescription?: boolean;
      };
      stats?: {
        projects?: string;
        experience?: string;
        satisfaction?: string;
      };
      footer?: {
        description?: string;
        socialLinks?: {
          facebook?: string;
          twitter?: string;
          instagram?: string;
          linkedin?: string;
          github?: string;
          youtube?: string;
          tiktok?: string;
          whatsapp?: string;
        };
      };
      projects?: Array<any>;
      skills?: {
        technical?: string[];
        tools?: string[];
      };
      theme?: {
        primaryColor?: string;
        secondaryColor?: string;
        headingColor?: string;
        textColor?: string;
        buttonTextColor?: string;
        fontFamily?: string;
      };
    };
    about?: {
      text: string;
      skills?: string[];
      experience?: Array<{
        title: string;
        company: string;
        period: string;
        description: string;
      }>;
    };
    portfolio?: Array<{
      id: string;
      title: string;
      description: string;
      image?: string;
      category: string;
      technologies?: string[];
      link?: string;
    }>;
    services?: Array<{
      id: string;
      name: string;
      description: string;
      price?: string;
      icon?: string;
    }>;
    testimonials?: Array<{
      id: string;
      name: string;
      text: string;
      rating: number;
      position?: string;
      company?: string;
    }>;
    settings?: {
      primaryColor?: string;
      secondaryColor?: string;
      fontFamily?: string;
    };
  };
}

export function PortfolioTemplate({ site }: PortfolioTemplateProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');

  // Sempre priorizar dados do portfolioData
  const pd = site.portfolioData || {};
  const displayName = (pd.personalInfo?.name && pd.personalInfo?.name.trim() !== '' ? pd.personalInfo?.name : (site.name || site.title || 'Portfolio'));
  const displaySubtitle = pd.personalInfo?.subtitle || 'Desenvolvedor Full Stack';
  const displayDescription = pd.about?.description || site.description || 'Desenvolvedor apaixonado por tecnologia';
  const heroDescription = pd.hero?.useStaticDescription ? pd.hero?.staticDescription : displayDescription;
  const stats = {
    projects: pd.stats?.projects || '50+',
    experience: pd.stats?.experience || '5+',
    satisfaction: pd.stats?.satisfaction || '100%'
  };
  const footerData = {
    description: pd.footer?.description || 'Desenvolvedor especializado em soluções web modernas e design inovador',
    socialLinks: pd.footer?.socialLinks || {}
  };
  const primaryColor = pd.theme?.primaryColor || ((pd as any).settings?.primaryColor) || site.settings?.primaryColor || '#667eea';
  const secondaryColor = pd.theme?.secondaryColor || ((pd as any).settings?.secondaryColor) || site.settings?.secondaryColor || '#764ba2';
  const headingColor = pd.theme?.headingColor || '#111';
  const textColor = pd.theme?.textColor || '#222';
  const buttonTextColor = pd.theme?.buttonTextColor || '#fff';
  const fontFamily = pd.theme?.fontFamily || ((pd as any).settings?.fontFamily) || site.settings?.fontFamily || 'Inter, sans-serif';
  const whatsapp = pd.personalInfo?.whatsapp || site.whatsapp || '';

  // Contraste automático para blocos
  const autoTextOn = (bg: string, fallback: string = '#222') => isColorDark(bg) ? '#fff' : '#111';

  // Exibir apenas dados reais do usuário; se não houver, exibe exemplos para manter o visual completo
  const exampleProjects = [
    {
      id: '1',
      title: 'E-commerce Website',
      description: 'Loja virtual moderna com sistema de pagamento integrado',
      category: 'web',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
    },
    {
      id: '2',
      title: 'Mobile App Design',
      description: 'Interface para aplicativo de delivery com UX otimizada',
      category: 'design',
      technologies: ['Figma', 'UI/UX', 'Prototyping']
    },
    {
      id: '3',
      title: 'Brand Identity',
      description: 'Identidade visual completa para startup de tecnologia',
      category: 'branding',
      technologies: ['Illustrator', 'Photoshop', 'Brand Strategy']
    }
  ];
  const exampleServices = [
    {
      id: '1',
      name: 'Desenvolvimento Web',
      description: 'Sites e aplicações web modernas e responsivas',
      price: 'A partir de R$ 2.500',
      icon: '💻'
    },
    {
      id: '2',
      name: 'Design UI/UX',
      description: 'Interfaces intuitivas e experiências memoráveis',
      price: 'A partir de R$ 1.500',
      icon: '🎨'
    },
    {
      id: '3',
      name: 'Consultoria Digital',
      description: 'Estratégias digitais para seu negócio crescer',
      price: 'A partir de R$ 800',
      icon: '💡'
    }
  ];
  const exampleTestimonials = [
    {
      id: '1',
      name: 'Carlos Mendes',
      text: 'Trabalho excepcional! Superou todas as expectativas.',
      rating: 5,
      position: 'CEO',
      company: 'TechStart'
    },
    {
      id: '2',
      name: 'Ana Santos',
      text: 'Profissional dedicado e com excelente qualidade técnica.',
      rating: 5,
      position: 'Diretora de Marketing',
      company: 'InnovaCorp'
    },
    {
      id: '3',
      name: 'Roberto Lima',
      text: 'Entrega rápida e resultado final impecável.',
      rating: 5,
      position: 'Gerente de Projetos',
      company: 'DigitalFlow'
    }
  ];
  const exampleSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'UI/UX Design', 
    'Figma', 'Photoshop', 'Git', 'MongoDB', 'SQL'
  ];
  const exampleExperience = [
    {
      title: 'Senior Developer',
      company: 'Tech Solutions',
      period: '2021 - Presente',
      description: 'Liderança técnica em projetos web complexos'
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      period: '2019 - 2021',
      description: 'Desenvolvimento de aplicações web e mobile'
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Agency',
      period: '2017 - 2019',
      description: 'Criação de interfaces modernas e responsivas'
    }
  ];

  const portfolio = Array.isArray(pd.projects) && pd.projects.length > 0 ? pd.projects : exampleProjects;
  const services = Array.isArray((pd as any).services) && (pd as any).services.length > 0 ? (pd as any).services : exampleServices;
  const testimonials = Array.isArray((pd as any).testimonials) && (pd as any).testimonials.length > 0 ? (pd as any).testimonials : exampleTestimonials;
  const categories = ['todos', ...Array.from(new Set(portfolio.map((p: {category: string}) => p.category)))];
  const filteredPortfolio = selectedCategory === 'todos' ? portfolio : portfolio.filter((p: {category: string}) => p.category === selectedCategory);
  const skills = Array.isArray(pd.skills?.technical) && pd.skills.technical.length > 0 ? pd.skills.technical : exampleSkills;
  const experience = Array.isArray((pd as any).experience) && (pd as any).experience.length > 0 ? (pd as any).experience : exampleExperience;

  return (
    <div style={{ fontFamily, margin: 0, padding: 0, boxSizing: 'border-box', background: 'linear-gradient(120deg, #f8f9fa 0%, #e9eafc 100%)' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: linear-gradient(120deg, #f8f9fa 0%, #e9eafc 100%); }
        .hamburger { display: none; flex-direction: column; cursor: pointer; }
        .hamburger div { width: 28px; height: 4px; background: white; margin: 4px 0; border-radius: 2px; transition: 0.3s; }
        .nav-menu { display: flex; gap: 36px; }
        .nav-menu a { font-size: 17px; letter-spacing: 0.5px; }
        @media (max-width: 900px) {
          .container { padding: 0 18px; }
          .nav-menu { gap: 18px; }
        }
        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .nav-menu { 
            display: ${isMenuOpen ? 'flex' : 'none'}; 
            flex-direction: column; 
            position: absolute; 
            top: 100%; 
            left: 0; 
            width: 100vw; 
            min-width: 0;
            background: ${primaryColor}; 
            z-index: 1000;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          }
          .nav-menu a { 
            padding: 18px 24px; 
            border-bottom: 1px solid rgba(255,255,255,0.08); 
            font-size: 18px;
          }
          .container { padding: 0 8px; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .hero h1 { font-size: 32px !important; }
          .portfolio-grid { grid-template-columns: 1fr !important; }
          .skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .portfolio-card {
          background: white;
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          padding: 32px 28px;
          margin-bottom: 24px;
          transition: box-shadow 0.3s, transform 0.3s;
          min-width: 0;
        }
        .portfolio-card:hover {
          box-shadow: 0 16px 48px rgba(0,0,0,0.16);
          transform: translateY(-6px) scale(1.03);
        }
        .service-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 6px 24px rgba(0,0,0,0.08);
          padding: 28px 22px;
          margin-bottom: 18px;
          transition: box-shadow 0.3s, transform 0.3s;
          min-width: 0;
        }
        .service-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.13);
          transform: translateY(-4px) scale(1.02);
        }
        .btn-primary { 
          background: linear-gradient(90deg, ${primaryColor} 60%, ${secondaryColor} 100%); 
          color: white; 
          border: none; 
          padding: 14px 32px; 
          border-radius: 8px; 
          cursor: pointer; 
          font-weight: 600;
          font-size: 18px;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
          transition: all 0.3s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary:hover { 
          background: linear-gradient(90deg, ${secondaryColor} 60%, ${primaryColor} 100%); 
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 6px 18px rgba(0,0,0,0.10);
        }
        .btn-category {
          background: white;
          border: 2px solid ${primaryColor};
          color: ${primaryColor};
          padding: 10px 22px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 8px;
        }
        .btn-category.active, .btn-category:hover {
          background: ${primaryColor};
          color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }
        .section { padding: 90px 20px; }
        .container { max-width: 1200px; margin: 0 auto; padding-left: 12px; padding-right: 12px; }
        .testimonial-card {
          background: white;
          padding: 36px 28px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          text-align: center;
          transition: box-shadow 0.3s, transform 0.3s;
          min-width: 0;
        }
        .testimonial-card:hover { box-shadow: 0 16px 48px rgba(0,0,0,0.16); transform: translateY(-6px) scale(1.03); }
        .skill-tag {
          background: ${primaryColor}22;
          color: ${primaryColor};
          padding: 10px 18px;
          border-radius: 22px;
          font-size: 15px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          min-width: 0;
        }
        .grid-2 { min-width: 0; }
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
            {displayName}
          </div>
          
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <div className="nav-menu" style={{
            listStyle: 'none',
            gap: '30px',
            alignItems: 'left',
            flexDirection: isMenuOpen ? 'column' : 'row',
            padding: isMenuOpen ? '32px 0 0 0' : '0'
          }}>
            <a href="#home" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 8 }}>
              🏠 Início
            </a>
            <a href="#about" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 8 }}>
              👤 Sobre
            </a>
            <a href="#portfolio" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 8 }}>
              💼 Portfólio
            </a>
            <a href="#services" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 8 }}>
              🛠️ Serviços
            </a>
            <a href="#testimonials" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 8 }}>
              ⭐ Depoimentos
            </a>
            <a href="#contact" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 8 }}>
              ✉️ Contato
            </a>
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp}`} 
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                💬 Contratar
              </a>
            )}
            {/* Ícones das redes sociais no menu mobile */}
            {isMenuOpen && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '32px', flexWrap: 'wrap' }}>
                {footerData.socialLinks.facebook && (
                  <a href={footerData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.9 }}>
                    <FaFacebook />
                  </a>
                )}
                {footerData.socialLinks.twitter && (
                  <a href={footerData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.9 }}>
                    <FaTwitter />
                  </a>
                )}
                {footerData.socialLinks.instagram && (
                  <a href={footerData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.9 }}>
                    <FaInstagram />
                  </a>
                )}
                {footerData.socialLinks.linkedin && (
                  <a href={footerData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.9 }}>
                    <FaLinkedin />
                  </a>
                )}
                {footerData.socialLinks.github && (
                  <a href={footerData.socialLinks.github} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.9 }}>
                    <FaGithub />
                  </a>
                )}
                {footerData.socialLinks.youtube && (
                  <a href={footerData.socialLinks.youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.9 }}>
                    <FaYoutube />
                  </a>
                )}
                {footerData.socialLinks.tiktok && (
                  <a href={footerData.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.9 }}>
                    <FaTiktok />
                  </a>
                )}
                {footerData.socialLinks.whatsapp && (
                  <a href={`https://wa.me/${footerData.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.9 }}>
                    <FaWhatsapp />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero" style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        color: autoTextOn(primaryColor),
        padding: '120px 20px 80px',
        textAlign: 'center',
        position: 'relative' as const,
        overflow: 'hidden'
      }}>
          {/* Removido o nome principal (displayName) da hero */}
          <h2 style={{
            fontSize: '24px',
            marginBottom: '20px',
            fontWeight: '500',
            opacity: 0.95,
            color: autoTextOn(primaryColor)
          }}>
            {displaySubtitle}
          </h2>
          <p style={{
            fontSize: '20px',
            marginBottom: '30px',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto 30px',
            color: autoTextOn(primaryColor)
          }}>
            {heroDescription}
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {whatsapp && (
              <a 
                href={`https://wa.me/${whatsapp}`}
                className="btn-primary"
                style={{
                  fontSize: '18px',
                  padding: '15px 30px',
                  borderRadius: '8px',
                  color: buttonTextColor
                }}
              >
                Conversar
              </a>
            )}
            <a 
              href="#portfolio"
              style={{
                fontSize: '18px',
                padding: '15px 30px',
                borderRadius: '8px',
                background: 'transparent',
                color: buttonTextColor,
                border: `2px solid ${buttonTextColor}`,
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              Ver Portfólio
            </a>
          </div>
  </section>

      {/* About Section */}
  <section id="about" className="section" style={{ background: '#f8f9fa', color: autoTextOn('#f8f9fa') }}>
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
                color: autoTextOn('#f8f9fa'),
                fontWeight: 'bold'
              }}>
                Sobre Mim
              </h2>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: autoTextOn('#f8f9fa'),
                marginBottom: '30px'
              }}>
                {displayDescription}
              </p>
              
              {/* Skills */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  fontSize: '20px',
                  marginBottom: '15px',
                  color: primaryColor
                }}>
                  Tecnologias & Habilidades
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {skills.map((skill, index) => {
                    const skillIcons: { [key: string]: string } = {
                      'React': '⚛️',
                      'JavaScript': '🟨',
                      'TypeScript': '🔷',
                      'Node.js': '🟢',
                      'Python': '🐍',
                      'HTML': '🌐',
                      'CSS': '🎨',
                      'Next.js': '▲',
                      'Vue': '💚',
                      'Angular': '🔺',
                      'PHP': '🐘',
                      'Laravel': '🔴',
                      'MySQL': '🗄️',
                      'MongoDB': '🍃',
                      'PostgreSQL': '🐘',
                      'AWS': '☁️',
                      'Docker': '🐳',
                      'Git': '🌿',
                      'Figma': '🎨',
                      'Photoshop': '🎨',
                      'Design': '🎨',
                      'UX/UI': '📱',
                      'Mobile': '📱',
                      'API': '🔌',
                      'GraphQL': '🔗'
                    };
                    const icon = skillIcons[skill] || '🔧';
                    return (
                      <span 
                        key={index} 
                        className="skill-tag"
                        style={{
                          background: primaryColor + '20',
                          color: primaryColor,
                          padding: '8px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          margin: '4px'
                        }}
                      >
                        <span>{icon}</span>
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

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
                  }}>{stats.projects}</div>
                  <div style={{ color: '#666' }}>Projetos</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: primaryColor,
                    marginBottom: '5px'
                  }}>{stats.experience}</div>
                  <div style={{ color: '#666' }}>Anos de Experiência</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: primaryColor,
                    marginBottom: '5px'
                  }}>{stats.satisfaction}</div>
                  <div style={{ color: '#666' }}>Satisfação</div>
                </div>
              </div>
            </div>
            <div style={{
              background: `url('https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80') center/cover`,
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
                  <div style={{ fontSize: '64px', marginBottom: '10px' }}>👨‍💻</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Desenvolvedor Apaixonado</div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Timeline */}
          <div style={{ marginTop: '80px' }}>
            <h3 style={{
              fontSize: '28px',
              marginBottom: '40px',
              color: primaryColor,
              textAlign: 'center'
            }}>
              Experiência Profissional
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}>
              {experience.map((exp: any, index: number) => (
                <div key={index} style={{
                  background: 'white',
                  padding: '25px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  borderLeft: `4px solid ${primaryColor}`
                }}>
                  <h4 style={{
                    fontSize: '18px',
                    marginBottom: '5px',
                    color: primaryColor
                  }}>
                    {exp.title}
                  </h4>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#333'
                  }}>
                    {exp.company}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '10px'
                  }}>
                    {exp.period}
                  </div>
                  <p style={{
                    color: '#666',
                    lineHeight: '1.6'
                  }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
  <section id="portfolio" className="section" style={{ background: 'white', color: autoTextOn('white') }}>
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center',
            marginBottom: '20px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            Meu Portfólio
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '40px',
            fontSize: '18px'
          }}>
            Alguns dos projetos que desenvolvi recentemente
          </p>

          {/* Category Filters */}
          <div style={{
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
                 category === 'web' ? 'Web' :
                 category === 'design' ? 'Design' :
                 category === 'branding' ? 'Branding' :
                 category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="portfolio-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {filteredPortfolio.map((project, index) => (
              <div 
                key={project.id}
                className="portfolio-card"
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
                  background: project.image ? 
                    `url(${project.image}) center/cover` : 
                    project.category === 'web' ? 
                    "url('https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    project.category === 'design' ? 
                    "url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    project.category === 'branding' ? 
                    "url('https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    index % 8 === 0 ? 
                    "url('https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    index % 8 === 1 ? 
                    "url('https://images.unsplash.com/photo-1507003211169-0a1dd7093c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    index % 8 === 2 ? 
                    "url('https://images.unsplash.com/photo-1551033406-611b90b38c05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    index % 8 === 3 ? 
                    "url('https://images.unsplash.com/photo-1498050108023-c5e6f46462be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    index % 8 === 4 ? 
                    "url('https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    index % 8 === 5 ? 
                    "url('https://images.unsplash.com/photo-1551650975-87deedd99c7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    index % 8 === 6 ? 
                    "url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    "url('https://images.unsplash.com/photo-1533709752211-b219446e91d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '48px',
                  position: 'relative' as const
                }}>
                  {!project.image && (
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
                      {project.category === 'web' ? '💻' :
                       project.category === 'design' ? '🎨' :
                       project.category === 'branding' ? '🎯' : '📱'}
                    </div>
                  )}
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{
                    fontSize: '22px',
                    marginBottom: '10px',
                    color: primaryColor
                  }}>
                    {project.title}
                  </h3>
                  <p style={{
                    color: '#666',
                    marginBottom: '15px',
                    lineHeight: '1.6'
                  }}>
                    {project.description}
                  </p>
                  {project.technologies && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '20px'
                    }}>
                      {project.technologies.map((tech: string, techIndex: number) => {
                        const techIcons: { [key: string]: string } = {
                          'React': '⚛️',
                          'JavaScript': '🟨',
                          'TypeScript': '🔷',
                          'Node.js': '🟢',
                          'Python': '🐍',
                          'HTML': '🌐',
                          'CSS': '🎨',
                          'Next.js': '▲',
                          'Vue': '💚',
                          'Angular': '🔺',
                          'PHP': '🐘',
                          'Laravel': '🔴',
                          'MySQL': '🗄️',
                          'MongoDB': '🍃',
                          'PostgreSQL': '🐘',
                          'AWS': '☁️',
                          'Docker': '🐳',
                          'Git': '🌿',
                          'Figma': '🎨',
                          'Photoshop': '🎨'
                        };
                        const icon = techIcons[tech] || '🔧';
                        return (
                          <span
                            key={techIndex}
                            style={{
                              background: `${primaryColor}15`,
                              color: primaryColor,
                              padding: '4px 8px',
                              borderRadius: '10px',
                              fontSize: '12px',
                              fontWeight: '500',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>{icon}</span>
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  {project.link && (
                    <a 
                      href={project.link}
                      className="btn-primary"
                      style={{
                        textDecoration: 'none',
                        fontSize: '14px',
                        padding: '8px 16px'
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver Projeto
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
  <section id="services" className="section" style={{ background: '#f8f9fa', color: autoTextOn('#f8f9fa') }}>
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center',
            marginBottom: '20px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            Meus Serviços
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '50px',
            fontSize: '18px'
          }}>
            Como posso ajudar seu projeto a se destacar
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {services.map((service: any, index: number) => (
              <div 
                key={service.id}
                className="service-card"
                style={{
                  background: 'white',
                  padding: '0',
                  borderRadius: '15px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '200px',
                  background: index === 0 ? 
                    "url('https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    index === 1 ? 
                    "url('https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    index === 2 ?
                    "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover" :
                    "url('https://images.unsplash.com/photo-1533709752211-b219446e91d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80') center/cover",
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
                    {service.icon || (index % 8 === 0 ? '💻' : 
                                     index % 8 === 1 ? '🎨' : 
                                     index % 8 === 2 ? '📱' : 
                                     index % 8 === 3 ? '🎯' : 
                                     index % 8 === 4 ? '⚡' : 
                                     index % 8 === 5 ? '🛠️' : 
                                     index % 8 === 6 ? '📊' : '🚀')}
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
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: secondaryColor,
                      marginBottom: '20px'
                    }}>
                      {service.price}
                    </div>
                  )}
                  {whatsapp && (
                    <a 
                      href={`https://wa.me/${whatsapp}?text=Olá! Tenho interesse no serviço: ${service.name}`}
                      className="btn-primary"
                      style={{
                        textDecoration: 'none',
                        fontSize: '14px',
                        padding: '10px 20px'
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

      {/* Testimonials Section */}
  <section id="testimonials" className="section" style={{ background: 'white', color: autoTextOn('white') }}>
        <div className="container">
          <h2 style={{
            fontSize: '36px',
            textAlign: 'center',
            marginBottom: '20px',
            color: primaryColor,
            fontWeight: 'bold'
          }}>
            O Que Dizem Sobre Meu Trabalho
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '50px',
            fontSize: '18px'
          }}>
            Feedback de clientes que confiaram em meu trabalho
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            {testimonials.map((testimonial: any) => (
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
                {testimonial.position && testimonial.company && (
                  <div style={{
                    fontSize: '14px',
                    color: '#999',
                    marginTop: '5px'
                  }}>
                    {testimonial.position} - {testimonial.company}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
  <section id="contact" className="section" style={{ background: '#f8f9fa', color: autoTextOn('#f8f9fa') }}>
        <div className="container">
          {/* Vamos Trabalhar Juntos - chamada principal */}
          <div style={{
            background: '#fff',
            borderRadius: '15px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            margin: '0 0 40px 0',
            padding: '32px',
            maxWidth: '700px',
            textAlign: 'center',
            color: textColor,
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <h2 style={{
              fontSize: '36px',
              textAlign: 'center',
              marginBottom: '20px',
              color: primaryColor,
              fontWeight: 'bold'
            }}>Vamos Trabalhar Juntos</h2>
            <p style={{
              fontSize: '18px',
              color: '#666',
              marginBottom: '10px',
              lineHeight: '1.7'
            }}>
              Se você busca parceria, colaboração ou deseja contratar meus serviços, estou disponível para novos projetos e desafios.<br/>
              Entre em contato e vamos transformar ideias em realidade!
            </p>
          </div>
          
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
                        <div style={{ fontWeight: 'bold', color: '#333' }}>Localização</div>
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
                    💬 Conversar Agora
                  </a>
                )}
              </div>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              height: '400px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              textAlign: 'center',
              padding: '20px',
              position: 'relative' as const,
              backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              <div style={{
                position: 'absolute' as const,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${primaryColor}CC, ${secondaryColor}CC)`,
                borderRadius: '15px'
              }}></div>
              <div style={{ position: 'relative' as const, zIndex: 1 }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🚀</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
                  Bem-vindo ao meu portfólio!
                </div>
                <div style={{ opacity: 0.9 }}>
                  Aqui você encontra minha trajetória, conquistas e projetos.<br/>
                  Fique à vontade para conhecer meu trabalho e entrar em contato.
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
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>{displayName}</h3>
              <p style={{ opacity: 0.8, lineHeight: '1.6' }}>
                {footerData.description}
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Links Rápidos</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="#home" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Início</a>
                <a href="#about" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Sobre</a>
                <a href="#portfolio" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Portfólio</a>
                <a href="#services" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Serviços</a>
                <a href="#contact" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Contato</a>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '15px' }}>Redes Sociais</h4>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                {footerData.socialLinks.facebook && (
                  <a href={footerData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.8, transition: 'opacity 0.3s' }}>
                    <FaFacebook />
                  </a>
                )}
                {footerData.socialLinks.twitter && (
                  <a href={footerData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.8, transition: 'opacity 0.3s' }}>
                    <FaTwitter />
                  </a>
                )}
                {footerData.socialLinks.instagram && (
                  <a href={footerData.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.8, transition: 'opacity 0.3s' }}>
                    <FaInstagram />
                  </a>
                )}
                {footerData.socialLinks.linkedin && (
                  <a href={footerData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.8, transition: 'opacity 0.3s' }}>
                    <FaLinkedin />
                  </a>
                )}
                {footerData.socialLinks.github && (
                  <a href={footerData.socialLinks.github} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.8, transition: 'opacity 0.3s' }}>
                    <FaGithub />
                  </a>
                )}
                {footerData.socialLinks.youtube && (
                  <a href={footerData.socialLinks.youtube} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.8, transition: 'opacity 0.3s' }}>
                    <FaYoutube />
                  </a>
                )}
                {footerData.socialLinks.tiktok && (
                  <a href={footerData.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.8, transition: 'opacity 0.3s' }}>
                    <FaTiktok />
                  </a>
                )}
                {footerData.socialLinks.whatsapp && (
                  <a href={`https://wa.me/${footerData.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontSize: '24px', opacity: 0.8, transition: 'opacity 0.3s' }}>
                    <FaWhatsapp />
                  </a>
                )}
                {/* Fallback para quando não há redes sociais configuradas */}
                {!Object.values(footerData.socialLinks).some(link => link) && (
                  <>
                    <span style={{ color: 'white', fontSize: '24px', opacity: 0.5 }}>📧</span>
                    <span style={{ color: 'white', fontSize: '24px', opacity: 0.5 }}>💼</span>
                    <span style={{ color: 'white', fontSize: '24px', opacity: 0.5 }}>�</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '20px',
            opacity: 0.8
          }}>
            © {new Date().getFullYear()} {displayName}. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
