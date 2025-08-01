"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./saas-landing-improved.module.css";
import { FaRocket, FaMagic, FaMobileAlt, FaUserShield, FaRegSmile, FaCheckCircle, FaRegLightbulb, FaRegStar, FaArrowRight, FaWhatsapp, FaInstagram, FaFacebookF, FaChartLine } from "react-icons/fa";
import { MdOutlineDesignServices, MdOutlineSupportAgent } from "react-icons/md";
import FAQSection from "../src/components/FAQSection";

export default function Home() {
  const [openMenu, setOpenMenu] = useState(false);
  const [isMouseOverTemplates, setIsMouseOverTemplates] = useState(false);
  const [isMouseOverBenefits, setIsMouseOverBenefits] = useState(false);

  // Animação moderna de scroll para templates e benefícios
  React.useEffect(() => {
    const handleScroll = () => {
      // Templates Container
      const templatesContainer = document.getElementById('templates-container');
      if (templatesContainer && !isMouseOverTemplates) {
        const rect = templatesContainer.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          templatesContainer.setAttribute('data-scroll', 'active');
          const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
          const maxScroll = templatesContainer.scrollWidth - templatesContainer.clientWidth;
          const targetScroll = Math.max(0, Math.min(maxScroll, scrollProgress * maxScroll * 0.3));
          
          templatesContainer.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        } else {
          templatesContainer.setAttribute('data-scroll', 'inactive');
        }
      }

      // Benefits Container
      const benefitsContainer = document.getElementById('benefits-container');
      if (benefitsContainer && !isMouseOverBenefits) {
        const rect = benefitsContainer.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          benefitsContainer.setAttribute('data-scroll', 'active');
          const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
          const maxScroll = benefitsContainer.scrollWidth - benefitsContainer.clientWidth;
          const targetScroll = Math.max(0, Math.min(maxScroll, scrollProgress * maxScroll * 0.3));
          
          benefitsContainer.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
          });
        } else {
          benefitsContainer.setAttribute('data-scroll', 'inactive');
        }
      }
    };

    const handleTemplatesMouseEnter = () => setIsMouseOverTemplates(true);
    const handleTemplatesMouseLeave = () => setIsMouseOverTemplates(false);
    const handleBenefitsMouseEnter = () => setIsMouseOverBenefits(true);
    const handleBenefitsMouseLeave = () => setIsMouseOverBenefits(false);

    // Só adiciona o listener em telas grandes
    if (window.innerWidth > 768) {
      const templatesContainer = document.getElementById('templates-container');
      const benefitsContainer = document.getElementById('benefits-container');
      
      window.addEventListener('scroll', handleScroll);
      
      if (templatesContainer) {
        templatesContainer.addEventListener('mouseenter', handleTemplatesMouseEnter);
        templatesContainer.addEventListener('mouseleave', handleTemplatesMouseLeave);
      }
      
      if (benefitsContainer) {
        benefitsContainer.addEventListener('mouseenter', handleBenefitsMouseEnter);
        benefitsContainer.addEventListener('mouseleave', handleBenefitsMouseLeave);
      }
      
      handleScroll(); // Executar uma vez na montagem
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      const templatesContainer = document.getElementById('templates-container');
      const benefitsContainer = document.getElementById('benefits-container');
      
      if (templatesContainer) {
        templatesContainer.removeEventListener('mouseenter', handleTemplatesMouseEnter);
        templatesContainer.removeEventListener('mouseleave', handleTemplatesMouseLeave);
      }
      
      if (benefitsContainer) {
        benefitsContainer.removeEventListener('mouseenter', handleBenefitsMouseEnter);
        benefitsContainer.removeEventListener('mouseleave', handleBenefitsMouseLeave);
      }
    };
  }, [isMouseOverTemplates, isMouseOverBenefits]);
  return (
    <div className={styles["home-root"]}>
      {/* Overlay do menu mobile */}
      {openMenu && <div className={styles["home-navbar-overlay"]} onClick={() => setOpenMenu(false)} />}
      {/* Navbar */}
      <nav className={styles["home-navbar"]}>
        <div className={styles["home-navbar-logo"]}>
          <img src="/window.svg" alt="Logo" style={{ height: 32 }} />
          <span className={styles["home-navbar-title"]}>SaaS Website Builder</span>
        </div>
        <button
          className={openMenu ? styles["home-navbar-toggle"] + " open" : styles["home-navbar-toggle"]}
          aria-label={openMenu ? "Fechar menu" : "Abrir menu"}
          aria-expanded={openMenu}
          aria-controls="main-menu"
          onClick={() => setOpenMenu((v) => !v)}
          tabIndex={0}
        >
          <span className="sr-only">Menu</span>
          <span className={styles["home-navbar-toggle-bar"]}></span>
          <span className={styles["home-navbar-toggle-bar"]}></span>
          <span className={styles["home-navbar-toggle-bar"]}></span>
        </button>
        <div
          className={
            styles["home-navbar-links"] +
            (openMenu ? " " + styles["home-navbar-links-open"] : "")
          }
          id="main-menu"
        >
          <Link href="#templates" tabIndex={0}><span className={styles["icon-left"]}><FaMagic /></span>Templates</Link>
          <Link href="#planos" tabIndex={0}><span className={styles["icon-left"]}><FaRegStar /></span>Planos</Link>
          <Link href="#faq" tabIndex={0}><span className={styles["icon-left"]}><FaRegLightbulb /></span>FAQ</Link>
          <Link href="/login" tabIndex={0}><span className={styles["icon-left"]}><FaUserShield /></span>Entrar</Link>
          <Link href="/register" tabIndex={0}><span className={styles["icon-left"]}><FaRocket /></span>Criar Conta</Link>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className={styles["home-hero-content"]}>
          <div className={styles["home-hero-text"]}>
            <h1 className={styles["home-hero-title"]}>
              <span className={styles["icon-hero"]}><FaRocket /></span>
              Monte seu site profissional em minutos
            </h1>
            <p className={styles["home-hero-sub"]}>
              O <b>SaaS Website Builder</b> é a plataforma mais rápida e fácil para criar sites incríveis para negócios, barbearias, agências e muito mais.<br />
              <span style={{ color: "#9f86c0", fontWeight: 600 }}>Sem código. Sem complicação. 100% responsivo.</span>
            </p>
            <ul className={styles["home-hero-benefits"]}>
              <li><span className={styles["icon-check"]}><FaCheckCircle /></span>Templates prontos para vários nichos</li>
              <li><span className={styles["icon-check"]}><FaCheckCircle /></span>Editor visual fácil de usar</li>
              <li><span className={styles["icon-check"]}><FaCheckCircle /></span>Hospedagem instantânea e gratuita</li>
              <li><span className={styles["icon-check"]}><FaCheckCircle /></span>Domínio personalizado</li>
              <li><span className={styles["icon-check"]}><FaCheckCircle /></span>Gerencie todos os seus sites em um só lugar</li>
            </ul>
            <div className={styles["home-hero-cta"]}>
              <Link href="/register"><span className={styles["icon-left"]}><FaRocket /></span>Comece agora</Link>
              <Link href="/login" className={styles["secondary"]}><span className={styles["icon-left"]}><FaUserShield /></span>Entrar</Link>
            </div>
          </div>
          <div className={styles["home-hero-img"]}>
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" alt="Website Builder Dashboard" style={{ borderRadius: 16, boxShadow: "0 4px 32px #0002", maxWidth: "100%", height: "auto" }} />
          </div>
        </section>

        {/* Templates com Scroll Horizontal Moderno */}
        <section className={styles["home-section"]} id="templates">
          <h2 className={styles["home-section-title"]}><span className={styles["icon-title"]}><FaMagic /></span>Templates Profissionais</h2>
          <div className={styles["templates-container"]} id="templates-container">
            <div className={styles["templates-scroll-wrapper"]}>
              <div className={styles["home-template-card"] + " " + styles["home-template-card-agencia"]}>
                <img src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80" alt="Agência de Turismo" style={{ borderRadius: 12, marginBottom: 12 }} />
                <h3><span className={styles["icon-left"]}><MdOutlineDesignServices /></span>Agência de Turismo</h3>
                <p>Divulgue pacotes, destinos e conquiste clientes com um site visualmente atraente e dinâmico.</p>
              </div>
              <div className={styles["home-template-card"] + " " + styles["home-template-card-barbearia"]}>
                <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80" alt="Barbearia" style={{ borderRadius: 12, marginBottom: 12 }} />
                <h3><span className={styles["icon-left"]}><MdOutlineDesignServices /></span>Barbearia</h3>
                <p>Mostre serviços, horários, equipe e conquiste clientes com um site estiloso e prático.</p>
              </div>
              <div className={styles["home-template-card"] + " " + styles["home-template-card-comercial"]}>
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80" alt="Site Comercial" style={{ borderRadius: 12, marginBottom: 12 }} />
                <h3><span className={styles["icon-left"]}><MdOutlineDesignServices /></span>Site Comercial</h3>
                <p>Venda produtos, divulgue promoções e aumente seu faturamento com um site profissional.</p>
              </div>
              <div className={styles["home-template-card"]}>
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" alt="Landing Page" style={{ borderRadius: 12, marginBottom: 12 }} />
                <h3><span className={styles["icon-left"]}><MdOutlineDesignServices /></span>Landing Page</h3>
                <p>Capte leads e promova produtos ou eventos com páginas de alta conversão.</p>
              </div>
              <div className={styles["home-template-card"] + " " + styles["home-template-card-agencia"]}>
                <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=400&q=80" alt="E-commerce" style={{ borderRadius: 12, marginBottom: 12 }} />
                <h3><span className={styles["icon-left"]}><MdOutlineDesignServices /></span>E-commerce</h3>
                <p>Venda online com carrinho, pagamentos e gestão completa de produtos.</p>
              </div>
              <div className={styles["home-template-card"] + " " + styles["home-template-card-comercial"]}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" alt="Portfólio" style={{ borderRadius: 12, marginBottom: 12 }} />
                <h3><span className={styles["icon-left"]}><MdOutlineDesignServices /></span>Portfólio</h3>
                <p>Mostre seus trabalhos e conquiste novos clientes com um portfólio impressionante.</p>
              </div>
            </div>
          </div>
          <div className={styles["home-section-cta"]}>
            <Link href="/register">Quero meu site agora <span className={styles["icon-right"]}><FaArrowRight /></span></Link>
          </div>
        </section>

        {/* Planos Section */}
        <section className={styles["home-section"]} id="planos">
          <h2 className={styles["home-section-title"]}><span className={styles["icon-title"]}><FaRegStar /></span>Planos para todos os perfis</h2>
          <div className={styles["home-templates-grid"]} style={{ maxWidth: 800 }}>
            <div className={styles["home-template-card"]}>
              <h3><span className={styles["icon-left"]}><FaRegSmile /></span>Grátis</h3>
              <p>1 site, domínio .saas.app, templates básicos, suporte padrão.</p>
            </div>
            <div className={styles["home-template-card"]}>
              <h3><span className={styles["icon-left"]}><FaRocket /></span>Pro</h3>
              <p>Até 10 sites, domínio personalizado, templates premium, analytics, suporte prioritário.</p>
            </div>
            <div className={styles["home-template-card"]}>
              <h3><span className={styles["icon-left"]}><FaRegStar /></span>Agência</h3>
              <p>Sites ilimitados, recursos avançados, white-label, integrações e suporte dedicado.</p>
            </div>
          </div>
          <div className={styles["home-section-cta"]}>
            <Link href="/register">Testar grátis <span className={styles["icon-right"]}><FaArrowRight /></span></Link>
          </div>
        </section>

        {/* Benefícios extras com Scroll Horizontal */}
        <section className={styles["home-benefits-section"]}>
          <h2 className={styles["home-section-title"]}><span className={styles["icon-title"]}><FaRegLightbulb /></span>Por que escolher nosso SaaS?</h2>
          <div className={styles["templates-container"]} id="benefits-container">
            <div className={styles["templates-scroll-wrapper"]}>
              <div className={styles["home-benefit-card"]}>
                <span className={styles["icon-benefit"]}><FaMobileAlt /></span>
                <h4>100% Responsivo</h4>
                <p>Seu site perfeito em qualquer dispositivo, sem esforço.</p>
              </div>
              <div className={styles["home-benefit-card"]}>
                <span className={styles["icon-benefit"]}><FaMagic /></span>
                <h4>Editor Visual</h4>
                <p>Arraste, solte e publique. Simples assim.</p>
              </div>
              <div className={styles["home-benefit-card"]}>
                <span className={styles["icon-benefit"]}><MdOutlineSupportAgent /></span>
                <h4>Suporte Premium</h4>
                <p>Equipe pronta para ajudar por chat, email e WhatsApp.</p>
              </div>
              <div className={styles["home-benefit-card"]}>
                <span className={styles["icon-benefit"]}><FaUserShield /></span>
                <h4>Segurança</h4>
                <p>Infraestrutura robusta, backups automáticos e proteção de dados.</p>
              </div>
              <div className={styles["home-benefit-card"]}>
                <span className={styles["icon-benefit"]}><FaRocket /></span>
                <h4>Performance</h4>
                <p>Sites ultra-rápidos com CDN global e otimização automática.</p>
              </div>
              <div className={styles["home-benefit-card"]}>
                <span className={styles["icon-benefit"]}><FaChartLine /></span>
                <h4>Analytics</h4>
                <p>Acompanhe visitantes, conversões e performance em tempo real.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles["home-section"]} id="faq">
          <h2 className={styles["home-section-title"]}><span className={styles["icon-title"]}><FaRegLightbulb /></span>Dúvidas Frequentes</h2>
          <FAQSection 
            faqItems={[
              {
                question: "Preciso saber programar?",
                answer: "Não! O editor é 100% visual e intuitivo."
              },
              {
                question: "Posso usar domínio próprio?",
                answer: "Sim, planos pagos permitem domínio personalizado."
              },
              {
                question: "Tem suporte?",
                answer: "Sim, suporte por email, chat e WhatsApp para todos os planos."
              },
              {
                question: "Posso migrar de plano?",
                answer: "Pode mudar de plano a qualquer momento, sem burocracia."
              }
            ]}
            itemClassName={styles["home-faq-item"]}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className={styles["home-footer"]}>
        <div className={styles["home-footer-social"]}>
          <a href="https://wa.me/5599999999999" target="_blank" rel="noopener" aria-label="WhatsApp" className={styles["home-footer-social-whatsapp"]} tabIndex={0}><FaWhatsapp /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram" className={styles["home-footer-social-instagram"]} tabIndex={0}><FaInstagram /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook" className={styles["home-footer-social-facebook"]} tabIndex={0}><FaFacebookF /></a>
        </div>
        &copy; {new Date().getFullYear()} SaaS Website Builder. Todos os direitos reservados.
      </footer>
    </div>
  );
}
