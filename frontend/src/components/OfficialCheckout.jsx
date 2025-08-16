import React, { useState } from 'react';
import { Box, Button, Dialog, Typography, Alert } from '@mui/material';
import PlanUpgradeFlow from './PlanUpgradeFlow';

const OfficialCheckout = ({
  plan = 'free',
  valor = 0,
  metodoPagamento = 'pix',
  userId = '',
  name = '',
  email = '',
  cpf = ''
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      gap={2}
    >
      <Typography variant="h4" fontWeight="bold" mb={2} color="primary">
        Checkout Oficial MercadoPago
      </Typography>
      <Typography variant="body1" mb={4}>
        Escolha o plano e método de pagamento para ativar seu acesso.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => setOpen(true)}
        sx={{ px: 4, py: 2, borderRadius: 2 }}
      >
        Iniciar Checkout
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <Box p={3}>
          <PlanUpgradeFlow
            plan={plan}
            valor={valor}
            metodoPagamento={metodoPagamento}
            userId={userId}
            name={name}
            email={email}
            cpf={cpf}
            onSuccess={() => setOpen(false)}
            onError={() => setOpen(false)}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default OfficialCheckout;
