import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { LogOut, User, Settings, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title = "BECE 2026 Prediction Platform" }) => {
  const { user, logout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const getRoleIcon = () => {
    return isAdmin ? <Shield size={16} /> : <GraduationCap size={16} />;
  };

  const getRoleColor = () => {
    return isAdmin ? 'warning' : 'success';
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Role Chip */}
            <Chip
              icon={getRoleIcon()}
              label={user.role.toUpperCase()}
              size="small"
              color={getRoleColor()}
              variant="filled"
              sx={{ color: 'white', fontWeight: 'bold' }}
            />

            {/* User Menu */}
            <Button
              onClick={handleMenuOpen}
              sx={{ 
                color: 'white',
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Avatar
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'secondary.main',
                  fontSize: '0.875rem'
                }}
              >
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Avatar>
              <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  {user.fullName}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1.2 }}>
                  {user.email}
                </Typography>
              </Box>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  minWidth: 220,
                  mt: 1
                }
              }}
            >
              <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {user.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    icon={getRoleIcon()}
                    label={user.role.toUpperCase()}
                    size="small"
                    color={getRoleColor()}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <User size={18} />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <Settings size={18} />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <LogOut size={18} color="currentColor" />
                </ListItemIcon>
                <ListItemText>Sign Out</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
