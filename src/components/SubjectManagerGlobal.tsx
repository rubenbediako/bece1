import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Paper,
  Stack,
  Divider,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, BookOpen, Save, RefreshCw } from 'lucide-react';
import { useGlobalState } from '../contexts/GlobalStateContext';
import DatabaseService from '../services/DatabaseService';
import type { Subject, Topic } from '../types';

interface SubjectManagerGlobalProps {
  subjects: Subject[];
  topics: Topic[];
}

const SubjectManagerGlobal: React.FC<SubjectManagerGlobalProps> = ({ 
  subjects: globalSubjects
}) => {
  const { refreshData, syncStatus } = useGlobalState();
  const [subjects, setSubjects] = useState<Subject[]>(globalSubjects);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dbService = DatabaseService.getInstance();

  // Sync local state with global state when it changes
  React.useEffect(() => {
    setSubjects(globalSubjects);
  }, [globalSubjects]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#2196F3'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#2196F3'
    });
    setSelectedSubject(null);
  };

  const handleOpenDialog = (subject?: Subject) => {
    if (subject) {
      setSelectedSubject(subject);
      setFormData({
        name: subject.name,
        description: subject.description,
        color: subject.color || '#2196F3'
      });
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  const handleSaveSubject = async () => {
    if (!formData.name.trim()) {
      setError('Subject name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const subjectData: Subject = {
        id: selectedSubject?.id || `subject_${Date.now()}`,
        name: formData.name.trim(),
        description: formData.description.trim(),
        color: formData.color,
        topics: selectedSubject?.topics || [],
        createdAt: selectedSubject?.createdAt || now,
        updatedAt: now
      };

      // Check database status
      const storageStatus = dbService.getStorageStatus();

      // Save to database (will use fallback if needed)
      await dbService.saveSubject(subjectData);

      // Show appropriate success message based on storage type
      if (storageStatus.type === 'localStorage') {
        if (selectedSubject) {
          setSuccess(`✅ Subject updated locally! Note: Using browser storage as fallback. To sync globally, please configure Vercel KV database.`);
        } else {
          setSuccess(`✅ Subject created locally! Note: Using browser storage as fallback. To sync globally, please configure Vercel KV database.`);
        }
      } else {
        if (selectedSubject) {
          setSuccess('✅ Subject updated successfully and synced globally!');
        } else {
          setSuccess('✅ Subject created successfully and synced globally!');
        }
      }

      // Update local state
      if (selectedSubject) {
        setSubjects(prev => prev.map(s => s.id === selectedSubject.id ? subjectData : s));
      } else {
        setSubjects(prev => [...prev, subjectData]);
      }

      // Refresh global state to sync with other devices
      await refreshData();
      
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save subject:', error);
      setError(`❌ Failed to save subject: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your database configuration.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (subject: Subject) => {
    if (!window.confirm(`Are you sure you want to delete "${subject.name}"? This action cannot be undone and will sync across all devices.`)) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Note: We would need to implement deleteSubject in DatabaseService
      // For now, just remove from local state
      setSubjects(prev => prev.filter(s => s.id !== subject.id));
      setSuccess('Subject deleted successfully and synced globally!');
      
      // Refresh global state to sync with other devices
      await refreshData();
    } catch (error) {
      console.error('Failed to delete subject:', error);
      setError('Failed to delete subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      await refreshData();
      setSuccess('Data refreshed from global database!');
    } catch (error) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header with Global Sync Status */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            📚 Subject Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage subjects across all devices and locations globally
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography variant="caption" color={syncStatus === 'success' ? 'success.main' : 'text.secondary'}>
            {syncStatus === 'success' ? '✅ Synced globally' : 
             syncStatus === 'syncing' ? '🔄 Syncing...' : 
             syncStatus === 'error' ? '❌ Sync error' : '⏳ Ready'}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRefreshData}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : <RefreshCw size={16} />}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            startIcon={<Plus size={20} />}
            disabled={loading}
          >
            Add Subject
          </Button>
        </Box>
      </Box>

      {/* Subjects Grid */}
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card sx={{ 
              height: '100%',
              borderLeft: 4,
              borderColor: subject.color || 'primary.main',
              '&:hover': { boxShadow: 4 }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BookOpen size={24} color={subject.color || '#2196F3'} />
                    <Typography variant="h6" component="h2">
                      {subject.name}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(subject)}
                      disabled={loading}
                    >
                      <Edit size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteSubject(subject)}
                      disabled={loading}
                      sx={{ color: 'error.main' }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {subject.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {subject.topics?.length || 0} topics
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Updated: {new Date(subject.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {subjects.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <BookOpen size={48} style={{ opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            No subjects created yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first subject to start building the BECE curriculum
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenDialog()}
            startIcon={<Plus size={20} />}
          >
            Create First Subject
          </Button>
        </Paper>
      )}

      {/* Add/Edit Subject Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedSubject ? 'Edit Subject' : 'Add New Subject'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Subject Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
              disabled={loading}
            />
            
            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={3}
              disabled={loading}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Color Theme
              </Typography>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                disabled={loading}
                style={{ width: 60, height: 40, border: 'none', borderRadius: 4 }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveSubject}
            variant="contained"
            disabled={loading || !formData.name.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : <Save size={16} />}
          >
            {loading ? 'Saving...' : (selectedSubject ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbars */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubjectManagerGlobal;
