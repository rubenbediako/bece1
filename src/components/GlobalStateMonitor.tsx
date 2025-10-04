import React, { useState } from 'react';
import {
  Box,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Wifi,
  WifiOff,
  Sync,
  CheckCircle,
  Error,
  CloudSync,
  Storage,
  Info,
  Download,
  Verified
} from '@mui/icons-material';
import { useGlobalState } from '../contexts/GlobalStateContext';

const GlobalStateMonitor: React.FC = () => {
  const {
    isOnline,
    syncStatus,
    lastSync,
    loading,
    error,
    forceSync,
    getGlobalState,
    exportData,
    verifyDataIntegrity
  } = useGlobalState();
  
  const [showDetails, setShowDetails] = useState(false);
  const [globalStateInfo, setGlobalStateInfo] = useState<any>(null);
  const [integrityResult, setIntegrityResult] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const getSyncStatusColor = () => {
    if (!isOnline) return 'default';
    switch (syncStatus) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'syncing': return 'warning';
      default: return 'default';
    }
  };

  const getSyncStatusIcon = () => {
    if (!isOnline) return <WifiOff />;
    switch (syncStatus) {
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      case 'syncing': return <Sync className="animate-spin" />;
      default: return <CloudSync />;
    }
  };

  const getSyncStatusText = () => {
    if (!isOnline) return 'Offline';
    switch (syncStatus) {
      case 'success': return 'Synced';
      case 'error': return 'Sync Error';
      case 'syncing': return 'Syncing...';
      default: return 'Ready';
    }
  };

  const handleShowDetails = async () => {
    try {
      const stateInfo = await getGlobalState();
      setGlobalStateInfo(stateInfo);
      setShowDetails(true);
    } catch (err) {
      console.error('Failed to get global state:', err);
    }
  };

  const handleForceSync = async () => {
    try {
      await forceSync();
      if (showDetails) {
        const stateInfo = await getGlobalState();
        setGlobalStateInfo(stateInfo);
      }
    } catch (err) {
      console.error('Force sync failed:', err);
    }
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const exportedData = await exportData();
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(exportedData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bece-2026-data-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    try {
      setIsVerifying(true);
      const result = await verifyDataIntegrity();
      setIntegrityResult(result);
    } catch (err) {
      console.error('Integrity check failed:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <Chip
          icon={<Sync className="animate-spin" />}
          label="Initializing..."
          color="warning"
          variant="outlined"
        />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <Tooltip title={`Click for details • Last sync: ${lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never'}`}>
          <Chip
            icon={getSyncStatusIcon()}
            label={getSyncStatusText()}
            color={getSyncStatusColor()}
            variant="outlined"
            onClick={handleShowDetails}
            sx={{ 
              cursor: 'pointer',
              '&:hover': { boxShadow: 2 }
            }}
          />
        </Tooltip>
        {!isOnline && (
          <Chip
            icon={<WifiOff />}
            label="Offline Mode"
            color="warning"
            size="small"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      {/* Details Dialog */}
      <Dialog 
        open={showDetails} 
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Storage />
          Global Data State
          {syncStatus === 'syncing' && <LinearProgress sx={{ flexGrow: 1, ml: 2 }} />}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {globalStateInfo && (
            <Grid container spacing={2}>
              {/* Connection Status */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isOnline ? <Wifi color="success" /> : <WifiOff color="error" />}
                      Connection Status
                    </Typography>
                    <Typography color={isOnline ? 'success.main' : 'error.main'}>
                      {isOnline ? 'Online - Real-time sync enabled' : 'Offline - Local data only'}
                    </Typography>
                    {lastSync && (
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Last sync: {new Date(lastSync).toLocaleString()}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Data Summary */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Storage />
                      Data Summary
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Subjects" 
                          secondary={globalStateInfo.totalRecords.subjects} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Questions" 
                          secondary={globalStateInfo.totalRecords.questions} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="AI Answers" 
                          secondary={globalStateInfo.totalRecords.aiAnswers} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Podcasts" 
                          secondary={globalStateInfo.totalRecords.podcasts} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Data Integrity */}
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Verified />
                        Data Integrity
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={handleVerifyIntegrity}
                        disabled={isVerifying}
                        startIcon={isVerifying ? <Sync className="animate-spin" /> : <Verified />}
                      >
                        {isVerifying ? 'Checking...' : 'Check Integrity'}
                      </Button>
                    </Box>

                    {integrityResult && (
                      <Alert 
                        severity={integrityResult.isValid ? 'success' : 'warning'} 
                        sx={{ mt: 2 }}
                      >
                        {integrityResult.isValid 
                          ? 'All data is consistent and valid' 
                          : `Found ${integrityResult.issues.length} integrity issues`
                        }
                        {!integrityResult.isValid && (
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Issues: {integrityResult.issues.slice(0, 3).join(', ')}
                            {integrityResult.issues.length > 3 && '...'}
                          </Typography>
                        )}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Global Sync Info */}
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Info />
                      Global Sync Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      This app maintains consistent data across all devices and locations using 
                      Vercel KV global database. All information is automatically synchronized 
                      and persisted forever.
                    </Typography>
                    <Typography variant="caption" display="block">
                      Data Version: {globalStateInfo.dataVersion}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Global Sync: Every 30 seconds when online
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={handleExportData}
            disabled={isExporting}
            startIcon={isExporting ? <Sync className="animate-spin" /> : <Download />}
          >
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
          <Button 
            onClick={handleForceSync}
            disabled={!isOnline || syncStatus === 'syncing'}
            startIcon={<CloudSync />}
          >
            Force Sync
          </Button>
          <Button onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GlobalStateMonitor;
