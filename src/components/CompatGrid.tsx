// Temporary compatibility wrapper for MUI Grid v7
import React from 'react';
import { Box } from '@mui/material';

interface GridProps {
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  spacing?: number;
  children: React.ReactNode;
  key?: string | number;
  [key: string]: any;
}

export const CompatGrid: React.FC<GridProps> = ({ 
  container, 
  item, 
  xs, 
  sm, 
  md, 
  lg, 
  spacing, 
  children, 
  ...props 
}) => {
  if (container) {
    return (
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: sm ? `repeat(${12/sm}, 1fr)` : 'repeat(1, 1fr)',
            md: md ? `repeat(${12/md}, 1fr)` : 'repeat(1, 1fr)',
            lg: lg ? `repeat(${12/lg}, 1fr)` : 'repeat(1, 1fr)'
          },
          gap: spacing || 2
        }}
        {...props}
      >
        {children}
      </Box>
    );
  }
  
  return <Box {...props}>{children}</Box>;
};
