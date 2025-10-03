import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Alert,
  Paper
} from '@mui/material';
import { UserPlus, Shield } from 'lucide-react';

interface InitialSetupProps {
  onSetupComplete: (adminData: {
    email: string;
    password: string;
    fullName: string;
    username: string;
  }) => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ onSetupComplete }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.email?.includes('@')) {
      newErrors.push('Valid email address is required');
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }
    if (!formData.fullName.trim()) {
      newErrors.push('Full name is required');
    }
    if (!formData.username.trim()) {
      newErrors.push('Username is required');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSetupComplete({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      username: formData.username
    });

    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'primary.main',
        backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
      }}
    >
      <Paper elevation={10} sx={{ maxWidth: 500, width: '100%', mx: 2 }}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 2, 
                mb: 2 
              }}>
                <Shield size={32} color="#1976d2" />
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  BECE 2026
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                Initial Admin Setup
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create the first administrator account to begin using the platform
              </Typography>
            </Box>

            {errors.length > 0 && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.map((error, index) => (
                  <div key={index}>• {error}</div>
                ))}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => { handleInputChange('fullName', e.target.value); }}
                margin="normal"
                required
                placeholder="e.g., Dr. Kwame Asante"
              />

              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => { handleInputChange('username', e.target.value); }}
                margin="normal"
                required
                placeholder="e.g., admin"
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => { handleInputChange('email', e.target.value); }}
                margin="normal"
                required
                placeholder="e.g., admin@bece.edu.gh"
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => { handleInputChange('password', e.target.value); }}
                margin="normal"
                required
                helperText="Minimum 6 characters"
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => { handleInputChange('confirmPassword', e.target.value); }}
                margin="normal"
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<UserPlus size={20} />}
                sx={{ mt: 3, py: 1.5 }}
              >
                {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
              </Button>
            </form>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
              <Typography variant="caption" color="info.main" fontWeight="bold">
                Security Note:
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                This admin account will have full access to manage the platform, including user access codes, questions, and predictions.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};

export default InitialSetup;
