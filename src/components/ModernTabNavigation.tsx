import React from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import {
  DashboardOutlined,
  SchoolOutlined,
  QuizOutlined,
  TrendingUpOutlined,
  PersonOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ModernTabNavigationProps {
  currentTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  isAdmin: boolean;
}

const ModernTabNavigation: React.FC<ModernTabNavigationProps> = ({
  currentTab,
  onTabChange,
  isAdmin,
}) => {
  const adminTabs = [
    {
      label: 'Dashboard',
      icon: <DashboardOutlined sx={{ fontSize: 20 }} />,
      description: 'Overview & Analytics',
      color: '#2563eb',
    },
    {
      label: 'Subjects',
      icon: <SchoolOutlined sx={{ fontSize: 20 }} />,
      description: 'Manage Subjects',
      color: '#059669',
    },
    {
      label: 'Questions',
      icon: <QuizOutlined sx={{ fontSize: 20 }} />,
      description: 'Question Bank',
      color: '#7c3aed',
    },
    {
      label: 'Predictions',
      icon: <TrendingUpOutlined sx={{ fontSize: 20 }} />,
      description: 'AI Predictions',
      color: '#dc2626',
    },
    {
      label: 'Student View',
      icon: <PersonOutlined sx={{ fontSize: 20 }} />,
      description: 'Preview Mode',
      color: '#ea580c',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid #e2e8f0',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {isAdmin ? 'Admin Dashboard' : 'Student Portal'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isAdmin ? 'Manage your BECE platform' : 'Master your BECE preparation'}
              </Typography>
            </Box>
            <Chip
              label={`${adminTabs.length} Modules`}
              size="small"
              variant="outlined"
              sx={{ 
                borderColor: '#2563eb',
                color: '#2563eb',
              }}
            />
          </Stack>

          <Tabs 
            value={currentTab} 
            onChange={onTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 1.5,
                background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 72,
                px: 3,
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  background: 'rgba(37, 99, 235, 0.05)',
                },
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  color: '#2563eb',
                },
              },
            }}
          >
            {adminTabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Stack alignItems="center" spacing={0.5}>
                      <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}>
                        <Box sx={{ 
                          color: currentTab === index ? tab.color : 'text.secondary',
                          transition: 'color 0.2s ease-in-out',
                        }}>
                          {tab.icon}
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: currentTab === index ? 600 : 500,
                            color: currentTab === index ? 'text.primary' : 'text.secondary',
                          }}
                        >
                          {tab.label}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          opacity: currentTab === index ? 1 : 0.7,
                        }}
                      >
                        {tab.description}
                      </Typography>
                    </Stack>
                  </motion.div>
                }
              />
            ))}
          </Tabs>
        </Box>
      </Paper>
    </Container>
  );
};

export default ModernTabNavigation;
