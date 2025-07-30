import React from "react";

export function AgenciaViagemTemplate({ site }: { site: any }) {
  return (
    <div style={{
      fontFamily: 'Montserrat, Arial, sans-serif',
      background: 'linear-gradient(135deg, #00c3ff 0%, #ffff1c 100%)',
      color: '#222',
      minHeight: '100vh',
      margin: 0
    }}>
      <header style={{ background: '#00c3ff', color: '#fff', padding: '32px 0', textAlign: 'center', borderBottom: '4px solid #ffff1c' }}>
        <h1 style={{ fontSize: 44 }}>{site.name || site.title}</h1>
        <p style={{ fontSize: 20 }}>{site.description || 'Sua próxima viagem começa aqui!'}</p>
      </header>
      <main style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px #0002', padding: 32 }}>
        <h2 style={{ color: '#00c3ff' }}>Destinos Populares</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24 }}>
          {(site.destinos || [
            { nome: 'Paris', descricao: 'A cidade do amor e da luz.' },
            { nome: 'Rio de Janeiro', descricao: 'Praias, samba e alegria.' },
            { nome: 'Tóquio', descricao: 'Tecnologia e tradição.' }
          ]).map((dest: any, idx: number) => (
            <div key={idx} style={{ flex: '1 1 250px', background: '#e0f7fa', borderRadius: 8, padding: 16, minWidth: 200 }}>
              <b>{dest.nome}</b><br />{dest.descricao}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40 }}>
          <h3 style={{ color: '#00c3ff' }}>Contato</h3>
          <p><b>Endereço:</b> {site.address}</p>
          <p><b>Email:</b> {site.email}</p>
          <p><b>Telefone:</b> {site.phone}</p>
        </div>
      </main>
      <footer style={{ background: '#00c3ff', color: '#fff', textAlign: 'center', padding: '16px 0', marginTop: 40 }}>
        &copy; {new Date().getFullYear()} {site.name || site.title} - Agência de Viagens
      </footer>
    </div>
  );
}
