"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./saas-landing.module.css";
import { FaRocket, FaMagic, FaMobileAlt, FaUserShield, FaRegSmile, FaCheckCircle, FaRegLightbulb, FaRegStar, FaArrowRight, FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { MdOutlineDesignServices, MdOutlineSupportAgent } from "react-icons/md";
import CarouselClient from "../src/components/CarouselClient";

export default function Home() {
  const [openMenu, setOpenMenu] = useState(false);
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
            <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80" alt="Exemplo de site gerado" style={{ borderRadius: 16, boxShadow: "0 4px 32px #0002", maxWidth: "100%", height: "auto" }} />
          </div>
        </section>

        {/* Carrossel de Templates */}
        <section className={styles["home-section"]} id="templates">
          <h2 className={styles["home-section-title"]}><span className={styles["icon-title"]}><FaMagic /></span>Templates Profissionais</h2>
          <CarouselClient>
            <div className={styles["home-template-card"] + " " + styles["home-template-card-agencia"]}>
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Agência de Turismo" style={{ borderRadius: 12, marginBottom: 12 }} />
              <h3><span className={styles["icon-left"]}><MdOutlineDesignServices /></span>Agência de Turismo</h3>
              <p>Divulgue pacotes, destinos e conquiste clientes com um site visualmente atraente e dinâmico.</p>
            </div>
            <div className={styles["home-template-card"] + " " + styles["home-template-card-barbearia"]}>
              <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80" alt="Barbearia" style={{ borderRadius: 12, marginBottom: 12 }} />
              <h3><span className={styles["icon-left"]}><MdOutlineDesignServices /></span>Barbearia</h3>
              <p>Mostre serviços, horários, equipe e conquiste clientes com um site estiloso e prático.</p>
            </div>
            <div className={styles["home-template-card"] + " " + styles["home-template-card-comercial"]}>
              <img src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80" alt="Site Comercial" style={{ borderRadius: 12, marginBottom: 12 }} />
              <h3><span className={styles["icon-left"]}><MdOutlineDesignServices /></span>Site Comercial</h3>
              <p>Venda produtos, divulgue promoções e aumente seu faturamento com um site profissional.</p>
            </div>
            <div className={styles["home-template-card"]}>
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" alt="Landing Page" style={{ borderRadius: 12, marginBottom: 12 }} />
              <h3><span className={styles["icon-left"]}><MdOutlineDesignServices /></span>Landing Page</h3>
              <p>Capte leads e promova produtos ou eventos com páginas de alta conversão.</p>
            </div>
          </CarouselClient>
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

        {/* Benefícios extras */}
        <section className={styles["home-benefits-section"]}>
          <h2 className={styles["home-section-title"]}><span className={styles["icon-title"]}><FaRegLightbulb /></span>Por que escolher nosso SaaS?</h2>
          <div className={styles["home-benefits-grid"]}>
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
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles["home-section"]} id="faq">
          <h2 className={styles["home-section-title"]}><span className={styles["icon-title"]}><FaRegLightbulb /></span>Dúvidas Frequentes</h2>
          <div style={{ maxWidth: 800, margin: "0 auto", color: "#4a4e69", fontSize: 18, lineHeight: 1.7 }}>
            <details style={{ marginBottom: 12 }}>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>Preciso saber programar?</summary>
              <div>Não! O editor é 100% visual e intuitivo.</div>
            </details>
            <details style={{ marginBottom: 12 }}>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>Posso usar domínio próprio?</summary>
              <div>Sim, planos pagos permitem domínio personalizado.</div>
            </details>
            <details style={{ marginBottom: 12 }}>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>Tem suporte?</summary>
              <div>Sim, suporte por email, chat e WhatsApp para todos os planos.</div>
            </details>
            <details style={{ marginBottom: 12 }}>
              <summary style={{ cursor: "pointer", fontWeight: 700 }}>Posso migrar de plano?</summary>
              <div>Pode mudar de plano a qualquer momento, sem burocracia.</div>
            </details>
          </div>
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
