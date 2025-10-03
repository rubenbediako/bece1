import React, { useState } from 'react';
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
  FormControl,
  FormLabel,
  RadioGroup,
  Radio
} from '@mui/material';
import { Send, Phone, Code, Settings, MessageCircle, MessageSquare, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AutoCodeGenerator: React.FC = () => {
  const { 
    generateAndSendCode, 
    getCurrentAccessCode, 
    autoGenerateCodes, 
    setAutoGenerateCodes,
    sendCodeToWhatsApp,
    sendCodeViaSMS,
    sendCodeViaBoth,
    generateCodeForUser
  } = useAuth();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastGeneratedCode, setLastGeneratedCode] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'whatsapp' | 'sms' | 'both'>('whatsapp');

  const handleGenerateForAdmin = async () => {
    if (!phoneNumber.trim()) {
      alert('Please enter the user\'s phone number');
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const newCode = generateCodeForUser(phoneNumber, deliveryMethod);
      setLastGeneratedCode(newCode);
      setSuccess(true);
      
      setTimeout(() => { setSuccess(false); }, 5000);
    } catch (error) {
      console.error('Error generating code for admin:', error);
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
      // Format phone number for delivery
      let formattedNumber = phoneNumber.replace(/\s+/g, '');
      if (formattedNumber.startsWith('0')) {
        formattedNumber = '233' + formattedNumber.substring(1);
      }
      if (!formattedNumber.startsWith('233')) {
        formattedNumber = '233' + formattedNumber;
      }

      const newCode = generateAndSendCode(formattedNumber, deliveryMethod);
      setLastGeneratedCode(newCode);
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
    
    // Send via selected method
    switch (deliveryMethod) {
      case 'sms':
        sendCodeViaSMS(formattedNumber, message);
        break;
      case 'both':
        sendCodeViaBoth(formattedNumber, message);
        break;
      default:
        sendCodeToWhatsApp(formattedNumber, message);
        break;
    }
    
    setSuccess(true);
    setTimeout(() => { setSuccess(false); }, 3000);
  };

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case 'sms':
        return <MessageSquare size={20} />;
      case 'both':
        return <Smartphone size={20} />;
      default:
        return <MessageCircle size={20} />;
    }
  };

  const getDeliveryColor = (method: string) => {
    switch (method) {
      case 'sms':
        return '#2196F3';
      case 'both':
        return '#9C27B0';
      default:
        return '#25D366';
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <MessageCircle size={24} color="#25D366" />
          <Typography variant="h6">
            🤖 Automatic Code Generator & Multi-Channel Sender
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Generate access codes and send them via WhatsApp, SMS, or both. Admin notifications sent to +233540456414.
        </Typography>

        {/* Admin notification info */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.50', borderRadius: 1, border: 1, borderColor: 'primary.200' }}>
          <Typography variant="subtitle2" color="primary.main" gutterBottom>
            📱 Admin WhatsApp: +233540456414
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • <strong>Generate for Admin:</strong> Sends code to user + admin notification
            <br />
            • <strong>Send Direct:</strong> Sends code only to specified user
            <br />
            • <strong>Send Current:</strong> Shares existing active code
            <br />
            • <strong>Delivery Methods:</strong> WhatsApp, SMS, or Both
          </Typography>
        </Box>

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

        {/* Delivery method selection */}
        <Box sx={{ mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 1 }}>
              📤 Delivery Method
            </FormLabel>
            <RadioGroup
              row
              value={deliveryMethod}
              onChange={(e) => { setDeliveryMethod(e.target.value as 'whatsapp' | 'sms' | 'both'); }}
            >
              <FormControlLabel
                value="whatsapp"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MessageCircle size={16} color="#25D366" />
                    WhatsApp
                  </Box>
                }
              />
              <FormControlLabel
                value="sms"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MessageSquare size={16} color="#2196F3" />
                    SMS
                  </Box>
                }
              />
              <FormControlLabel
                value="both"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Smartphone size={16} color="#9C27B0" />
                    Both
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Phone number input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            📱 Recipient Information
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
            onClick={handleGenerateForAdmin}
            disabled={loading}
            startIcon={<Code size={20} />}
            sx={{ 
              bgcolor: '#1976d2', 
              '&:hover': { bgcolor: '#1565c0' }
            }}
          >
            {loading ? 'Generating...' : 'Generate for Admin (+233540456414)'}
          </Button>

          <Button
            variant="contained"
            onClick={handleGenerateAndSend}
            disabled={loading}
            startIcon={getDeliveryIcon(deliveryMethod)}
            sx={{ 
              bgcolor: getDeliveryColor(deliveryMethod), 
              '&:hover': { 
                bgcolor: deliveryMethod === 'sms' ? '#1976d2' : 
                         deliveryMethod === 'both' ? '#7B1FA2' : '#128C7E' 
              }
            }}
          >
            {loading ? 'Sending...' : `Send via ${deliveryMethod.charAt(0).toUpperCase() + deliveryMethod.slice(1)}`}
          </Button>

          <Button
            variant="outlined"
            onClick={handleSendCurrentCode}
            startIcon={<Send size={20} />}
            sx={{ 
              borderColor: getDeliveryColor(deliveryMethod), 
              color: getDeliveryColor(deliveryMethod),
              '&:hover': { 
                borderColor: getDeliveryColor(deliveryMethod), 
                bgcolor: `${getDeliveryColor(deliveryMethod)}10`
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
            <strong>Success!</strong> Code sent via {deliveryMethod}!
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                📱 User: {phoneNumber}
                <br />
                📤 Method: {deliveryMethod.charAt(0).toUpperCase() + deliveryMethod.slice(1)}
                <br />
                📱 Admin notification: +233540456414
              </Typography>
              {lastGeneratedCode && (
                <Chip 
                  label={`Code: ${lastGeneratedCode}`} 
                  size="small" 
                  color="success" 
                  variant="outlined" 
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Alert>
        )}

        {/* Current code display */}
        <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1, border: 1, borderColor: 'primary.200' }}>
          <Typography variant="caption" color="primary.main">
            Current Active Code:
          </Typography>
          <Typography variant="h6" fontFamily="monospace" color="primary.main">
            {getCurrentAccessCode()}
          </Typography>
        </Box>

        {/* Settings Dialog */}
        <Dialog open={showDialog} onClose={() => { setShowDialog(false); }} maxWidth="sm" fullWidth>
          <DialogTitle>Multi-Channel Code Generator Settings</DialogTitle>
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
                When enabled, new access codes will be automatically generated and sent when users request them.
              </Typography>

              <TextField
                fullWidth
                label="Default Phone Number"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value); }}
                helperText="Default number for quick code sending"
                sx={{ mb: 2 }}
              />

              <Typography variant="subtitle2" gutterBottom>
                Default Delivery Method:
              </Typography>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <RadioGroup
                  value={deliveryMethod}
                  onChange={(e) => { setDeliveryMethod(e.target.value as 'whatsapp' | 'sms' | 'both'); }}
                >
                  <FormControlLabel value="whatsapp" control={<Radio />} label="WhatsApp" />
                  <FormControlLabel value="sms" control={<Radio />} label="SMS" />
                  <FormControlLabel value="both" control={<Radio />} label="Both (WhatsApp + SMS)" />
                </RadioGroup>
              </FormControl>

              <Alert severity="info">
                <strong>Multi-Channel Integration:</strong>
                <br />
                • <strong>WhatsApp:</strong> Opens WhatsApp Web/App with pre-filled message
                <br />
                • <strong>SMS:</strong> Opens device SMS app with pre-filled message
                <br />
                • <strong>Both:</strong> Opens both WhatsApp and SMS sequentially
                <br />
                • Phone numbers auto-formatted to Ghana format (+233)
                <br />
                • Admin notifications always sent via WhatsApp to +233540456414
              </Alert>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="success.main" gutterBottom>
                  📱 Admin Contact: +233540456414
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All code generation activities are logged and admin is notified via WhatsApp for tracking and support purposes.
                </Typography>
              </Box>
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
