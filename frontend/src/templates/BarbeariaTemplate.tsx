import React from "react";

export function BarbeariaTemplate({ site }: { site: any }) {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      background: '#1A1A1A',
      color: '#fff',
      minHeight: '100vh',
      margin: 0
    }}>
      <div style={{ background: '#8B4513', padding: '32px 0', textAlign: 'center' }}>
        <h1 style={{ color: '#FFD700', fontSize: 48 }}>{site.name || site.title}</h1>
        <p style={{ fontSize: 20 }}>{site.description}</p>
      </div>
      <div style={{ maxWidth: 700, margin: '40px auto', background: '#222', borderRadius: 8, boxShadow: '0 2px 8px #0005', padding: 32 }}>
        <h2 style={{ color: '#FFD700' }}>Sobre a Barbearia</h2>
        <p>Tradição, estilo e atendimento de qualidade. Venha conhecer nossos serviços!</p>
        <div style={{ marginTop: 32 }}>
          <h3 style={{ color: '#FFD700' }}>Serviços</h3>
          {site.services && site.services.length > 0 ? (
            site.services.map((srv: any, idx: number) => (
              <div key={idx} style={{ background: '#D2691E', color: '#fff', padding: 16, borderRadius: 6, marginBottom: 12 }}>
                <b>{srv.name}</b><br />{srv.description}
              </div>
            ))
          ) : (
            <div style={{ color: '#ccc' }}>Nenhum serviço cadastrado.</div>
          )}
        </div>
        <div style={{ marginTop: 32 }}>
          <h3 style={{ color: '#FFD700' }}>Contato</h3>
          <p><b>Endereço:</b> {site.address}</p>
          <p><b>Email:</b> {site.email}</p>
          <p><b>Telefone:</b> {site.phone}</p>
        </div>
      </div>
      <div style={{ background: '#8B4513', color: '#fff', textAlign: 'center', padding: '16px 0', marginTop: 40 }}>
        &copy; {new Date().getFullYear()} {site.name || site.title} - Todos os direitos reservados.
      </div>
    </div>
  );
}
