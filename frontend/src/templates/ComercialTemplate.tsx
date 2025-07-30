import React from "react";

export function ComercialTemplate({ site }: { site: any }) {
  return (
    <div style={{
      fontFamily: 'Segoe UI, Arial, sans-serif',
      background: '#f5f6fa',
      color: '#222',
      minHeight: '100vh',
      margin: 0
    }}>
      <header style={{ background: '#0052cc', color: '#fff', padding: '32px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 44 }}>{site.name || site.title}</h1>
        <p style={{ fontSize: 20 }}>{site.description}</p>
      </header>
      <main style={{ maxWidth: 800, margin: '40px auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px #0002', padding: 32 }}>
        <h2 style={{ color: '#0052cc' }}>Sobre a Empresa</h2>
        <p>{site.businessName || 'Empresa comercial de referência no mercado.'}</p>
        <div style={{ marginTop: 32 }}>
          <h3 style={{ color: '#0052cc' }}>Serviços</h3>
          {site.services && site.services.length > 0 ? (
            site.services.map((srv: any, idx: number) => (
              <div key={idx} style={{ background: '#e6f0ff', color: '#222', padding: 16, borderRadius: 6, marginBottom: 12 }}>
                <b>{srv.name}</b><br />{srv.description}
              </div>
            ))
          ) : (
            <div style={{ color: '#888' }}>Nenhum serviço cadastrado.</div>
          )}
        </div>
        <div style={{ marginTop: 32 }}>
          <h3 style={{ color: '#0052cc' }}>Contato</h3>
          <p><b>Endereço:</b> {site.address}</p>
          <p><b>Email:</b> {site.email}</p>
          <p><b>Telefone:</b> {site.phone}</p>
        </div>
      </main>
      <footer style={{ background: '#0052cc', color: '#fff', textAlign: 'center', padding: '16px 0', marginTop: 40 }}>
        &copy; {new Date().getFullYear()} {site.name || site.title} - Todos os direitos reservados.
      </footer>
    </div>
  );
}
