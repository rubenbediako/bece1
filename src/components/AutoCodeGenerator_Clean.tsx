import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Divider,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  IconButton
} from '@mui/material';
import { Send, Phone, Code, Settings, MessageCircle, Copy, History, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface GeneratedCode {
  code: string;
  timestamp: Date;
  phoneNumber: string;
  sent: boolean;
}

const AutoCodeGenerator: React.FC = () => {
  const { 
    generateAndSendCode, 
    getCurrentAccessCode, 
    autoGenerateCodes, 
    setAutoGenerateCodes,
    sendCodeToWhatsApp 
  } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('0540456414'); // Pre-filled target number
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastGeneratedCode, setLastGeneratedCode] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [codeHistory, setCodeHistory] = useState<GeneratedCode[]>([]);

  // Auto-generate code on component mount for immediate use
  useEffect(() => {
    const autoCode = getCurrentAccessCode();
    setLastGeneratedCode(autoCode);
  }, [getCurrentAccessCode]);

  // Quick generate code for the specific user (0540456414)
  const handleQuickGenerate = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const newCode = generateAndSendCode('0540456414');
      const newCodeEntry: GeneratedCode = {
        code: newCode,
        timestamp: new Date(),
        phoneNumber: '0540456414',
        sent: true
      };
      
      setLastGeneratedCode(newCode);
      setCodeHistory(prev => [newCodeEntry, ...prev.slice(0, 9)]); // Keep last 10 codes
      setSuccess(true);
      
      // Auto-hide success message
      setTimeout(() => { setSuccess(false); }, 5000);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAndSend = async () => {
    if (!phoneNumber.trim()) {
      alert('Please enter a phone number');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Format phone number for WhatsApp (remove spaces, add country code if needed)
      let formattedNumber = phoneNumber.replace(/\s+/g, '');
      if (formattedNumber.startsWith('0')) {
        formattedNumber = '233' + formattedNumber.substring(1);
      }
      if (!formattedNumber.startsWith('233')) {
        formattedNumber = '233' + formattedNumber;
      }

      const newCode = generateAndSendCode(formattedNumber);
      const newCodeEntry: GeneratedCode = {
        code: newCode,
        timestamp: new Date(),
        phoneNumber: phoneNumber,
        sent: true
      };
      
      setLastGeneratedCode(newCode);
      setCodeHistory(prev => [newCodeEntry, ...prev.slice(0, 9)]);
      setSuccess(true);
      
      setTimeout(() => { setSuccess(false); }, 5000);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCurrentCode = () => {
    if (!phoneNumber.trim()) {
      alert('Please enter a phone number');
      return;
    }

    let formattedNumber = phoneNumber.replace(/\s+/g, '');
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '233' + formattedNumber.substring(1);
    }
    if (!formattedNumber.startsWith('233')) {
      formattedNumber = '233' + formattedNumber;
    }

    const message = customMessage || `🎓 BECE 2026 Platform Access Code\n\nYour access code: ${getCurrentAccessCode()}\n\nUse this code to login to the BECE 2026 Prediction Platform.\n\nNeed help? Reply to this message!`;
    sendCodeToWhatsApp(formattedNumber, message);
    setSuccess(true);
    setTimeout(() => { setSuccess(false); }, 3000);
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <MessageCircle size={24} color="#25D366" />
          <Typography variant="h6">
            🤖 Automatic Code Generator & WhatsApp Sender
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Automatically generate access codes and send them directly to users via WhatsApp
        </Typography>

        {/* Quick Action for Target User */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50', border: 1, borderColor: 'primary.200' }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <User size={20} />
            Quick Code for Target User (0540456414)
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <Button
              variant="contained"
              size="large"
              onClick={handleQuickGenerate}
              disabled={loading}
              startIcon={<Code size={20} />}
              sx={{ 
                bgcolor: '#25D366', 
                '&:hover': { bgcolor: '#128C7E' },
                py: 1.5,
                flex: 1
              }}
            >
              {loading ? 'Generating...' : 'Generate & Send to 0540456414'}
            </Button>
            
            {lastGeneratedCode && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Latest Code:
                </Typography>
                <Chip 
                  label={lastGeneratedCode} 
                  color="primary" 
                  size="small"
                  onClick={() => { copyCodeToClipboard(lastGeneratedCode); }}
                  icon={<Copy size={16} />}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>
            )}
          </Stack>
        </Paper>

        {/* Auto-generation toggle */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={autoGenerateCodes}
                onChange={(e) => { setAutoGenerateCodes(e.target.checked); }}
                color="primary"
              />
            }
            label="Enable automatic code generation for new requests"
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            When enabled, new codes will be generated automatically when requested
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Phone number input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            📱 Send Code to WhatsApp
          </Typography>
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => { setPhoneNumber(e.target.value); }}
            placeholder="0540456414"
            helperText="Enter Ghana phone number (e.g., 0540456414)"
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, color: 'text.secondary' }}>
                  <Phone size={20} />
                </Box>
              )
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Custom Message (Optional)"
            value={customMessage}
            onChange={(e) => { setCustomMessage(e.target.value); }}
            placeholder="Custom message to send with the code..."
            helperText="Leave empty to use default message"
            sx={{ mb: 2 }}
          />
        </Box>

        {/* Action buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleGenerateAndSend}
            disabled={loading}
            startIcon={<Code size={20} />}
            sx={{ 
              bgcolor: '#25D366', 
              '&:hover': { bgcolor: '#128C7E' }
            }}
          >
            {loading ? 'Generating...' : 'Generate New Code & Send'}
          </Button>

          <Button
            variant="outlined"
            onClick={handleSendCurrentCode}
            startIcon={<Send size={20} />}
            sx={{ 
              borderColor: '#25D366', 
              color: '#25D366',
              '&:hover': { 
                borderColor: '#128C7E', 
                color: '#128C7E',
                bgcolor: 'rgba(37, 211, 102, 0.1)'
              }
            }}
          >
            Send Current Code
          </Button>

          <Button
            variant="text"
            onClick={() => { setShowDialog(true); }}
            startIcon={<Settings size={20} />}
          >
            Settings
          </Button>
        </Stack>

        {/* Success message */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>Success!</strong> Code sent to WhatsApp: {phoneNumber}
            {lastGeneratedCode && (
              <Box sx={{ mt: 1 }}>
                <Chip 
                  label={`New Code: ${lastGeneratedCode}`} 
                  size="small" 
                  color="success" 
                  variant="outlined" 
                />
              </Box>
            )}
          </Alert>
        )}

        {/* Code History */}
        {codeHistory.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History size={16} />
              Recent Codes Generated
            </Typography>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              {codeHistory.map((entry, index) => (
                <Paper key={index} sx={{ p: 2, mb: 1, bgcolor: 'grey.50' }}>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                      {entry.code}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {entry.phoneNumber}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {entry.timestamp.toLocaleTimeString()}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => { copyCodeToClipboard(entry.code); }}
                      title="Copy code"
                    >
                      <Copy size={16} />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Box>
        )}

        {/* Current code display */}
        <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1, border: 1, borderColor: 'primary.200' }}>
          <Typography variant="caption" color="primary.main">
            Current Active Code:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontFamily="monospace" color="primary.main">
              {getCurrentAccessCode()}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => { copyCodeToClipboard(getCurrentAccessCode()); }}
              sx={{ color: 'primary.main' }}
            >
              <Copy size={16} />
            </IconButton>
          </Box>
        </Box>

        {/* Settings Dialog */}
        <Dialog open={showDialog} onClose={() => { setShowDialog(false); }} maxWidth="sm" fullWidth>
          <DialogTitle>Auto-Code Generator Settings</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={autoGenerateCodes}
                    onChange={(e) => { setAutoGenerateCodes(e.target.checked); }}
                  />
                }
                label="Auto-generate codes on request"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                When enabled, new access codes will be automatically generated and sent when users request them via WhatsApp.
              </Typography>

              <TextField
                fullWidth
                label="Default Phone Number"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value); }}
                helperText="Default number for quick code sending"
                sx={{ mb: 2 }}
              />

              <Alert severity="info">
                <strong>WhatsApp Integration:</strong>
                <br />
                • Codes are sent via WhatsApp Web/App
                <br />
                • Phone numbers should be in Ghana format (0540456414)
                <br />
                • Messages include platform branding and instructions
                <br />
                • Recipients can reply directly for support
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setShowDialog(false); }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AutoCodeGenerator;
