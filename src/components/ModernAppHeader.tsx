import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Badge,
  Divider,
  Stack,
} from '@mui/material';
import {
  NotificationsOutlined,
  SettingsOutlined,
  LogoutOutlined,
  PersonOutlined,
  DashboardOutlined,
  MenuBookOutlined,
  TrendingUpOutlined,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const ModernAppHeader: React.FC = () => {
  const { logout, user, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e2e8f0',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              width: 40,
              height: 40,
            }}>
              🎓
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}>
                BECE 2026
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                lineHeight: 1,
              }}>
                AI Learning Platform
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Center - Status Indicators */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={<TrendingUpOutlined sx={{ fontSize: 16 }} />}
              label="Live Sync"
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: '#059669',
                color: '#059669',
                '& .MuiChip-icon': { color: '#059669' },
              }}
            />
            {isAdmin && (
              <Chip
                icon={<DashboardOutlined sx={{ fontSize: 16 }} />}
                label="Admin Mode"
                size="small"
                sx={{ 
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  color: 'white',
                }}
              />
            )}
          </Stack>
        </motion.div>

        {/* Right side - User actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Notifications */}
            <IconButton 
              size="small"
              sx={{ 
                '&:hover': { 
                  background: 'rgba(37, 99, 235, 0.1)',
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsOutlined sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>

            {/* Settings */}
            <IconButton 
              size="small"
              sx={{ 
                '&:hover': { 
                  background: 'rgba(37, 99, 235, 0.1)',
                },
              }}
            >
              <SettingsOutlined sx={{ fontSize: 20 }} />
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* User Menu */}
            <Button
              onClick={handleMenuOpen}
              startIcon={
                <Avatar sx={{ 
                  width: 32, 
                  height: 32,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  fontSize: '0.875rem',
                }}>
                  {user?.fullName?.charAt(0) || 'U'}
                </Avatar>
              }
              sx={{ 
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': { 
                  background: 'rgba(37, 99, 235, 0.05)',
                },
              }}
            >
              <Box sx={{ textAlign: 'left', ml: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1 }}>
                  {user?.fullName || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1 }}>
                  {isAdmin ? 'Administrator' : 'Student'}
                </Typography>
              </Box>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                },
              }}
            >
              <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                <PersonOutlined sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Profile Settings
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Manage your account
                  </Typography>
                </Box>
              </MenuItem>
              
              <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                <MenuBookOutlined sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Learning Progress
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    View your stats
                  </Typography>
                </Box>
              </MenuItem>

              <Divider sx={{ my: 1 }} />
              
              <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#dc2626' }}>
                <LogoutOutlined sx={{ mr: 2, fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Sign Out
                </Typography>
              </MenuItem>
            </Menu>
          </Stack>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default ModernAppHeader;
