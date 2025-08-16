import React, { useState } from 'react';
import { Box, Button, Dialog } from '@mui/material';
import MercadoPagoCheckout from '../MercadoPagoCheckout/MercadoPagoCheckout';

const PlanUpgradeFlow = ({ plan, valor, metodoPagamento, userId, name, email, cpf }) => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cria preferência no backend e abre modal
  const handlePagar = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId, name, email, cpf, method: metodoPagamento })
      });
      const data = await res.json();
      if (data.id) {
        setPreferenceId(data.id);
        setModalOpen(true);
      } else {
        setError(data.message || 'Erro ao criar preferência MercadoPago');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handlePagar} disabled={loading}>
        {loading ? 'Processando...' : 'Pagar e Ativar'}
      </Button>
      {error && <Box color="error.main" mt={2}>{error}</Box>}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <MercadoPagoCheckout
          preferenceId={preferenceId}
          metodoPagamento={metodoPagamento}
          valor={valor}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => setModalOpen(false)}
          onError={err => setError(err?.message || 'Erro no pagamento')}
        />
      </Dialog>
    </Box>
  );
};

export default PlanUpgradeFlow;
