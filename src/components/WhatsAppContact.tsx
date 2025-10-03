import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface WhatsAppContactProps {
  variant?: 'compact' | 'full';
  message?: string;
  showTitle?: boolean;
}

const WhatsAppContact: React.FC<WhatsAppContactProps> = ({ 
  variant = 'compact',
  message = 'Hi! I need help with BECE 2026 Prediction Platform',
  showTitle = true
}) => {
  const phoneNumber = '233540456149'; // Ghana country code + 054045614
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  if (variant === 'compact') {
    return (
      <Box sx={{ 
        p: 2, 
        bgcolor: 'rgba(37, 211, 102, 0.1)', 
        border: 1, 
        borderColor: 'rgba(37, 211, 102, 0.3)',
        borderRadius: 2,
        textAlign: 'center'
      }}>
        {showTitle && (
          <Typography variant="subtitle2" sx={{ color: '#25D366', fontWeight: 'bold', mb: 1 }}>
            📱 WhatsApp Support
          </Typography>
        )}
        <Typography variant="h6" sx={{ color: '#25D366', fontWeight: 'bold', mb: 1 }}>
          054045614
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ 
            bgcolor: '#25D366', 
            '&:hover': { bgcolor: '#128C7E' },
            color: 'white'
          }}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 Contact Us
        </Button>
      </Box>
    );
  }

  return (
    <Paper sx={{ 
      p: 3, 
      bgcolor: 'rgba(37, 211, 102, 0.1)', 
      border: 1, 
      borderColor: 'rgba(37, 211, 102, 0.3)',
      textAlign: 'center'
    }}>
      <Typography variant="h5" sx={{ color: '#25D366', fontWeight: 'bold', mb: 2 }}>
        📱 Get Instant Support
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Need access codes or have questions? Message us on WhatsApp for instant help!
      </Typography>
      <Typography variant="h4" sx={{ color: '#25D366', fontWeight: 'bold', mb: 3 }}>
        054045614
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{ 
          bgcolor: '#25D366', 
          '&:hover': { bgcolor: '#128C7E' },
          color: 'white',
          px: 4,
          py: 1.5
        }}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        💬 Start WhatsApp Chat
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        Available 24/7 for instant access codes and technical support
      </Typography>
    </Paper>
  );
};

export default WhatsAppContact;
