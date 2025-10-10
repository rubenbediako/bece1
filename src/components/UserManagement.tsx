import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Avatar,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Person,
  School,
  AdminPanelSettings,
  Visibility,
  VisibilityOff,
  Save,
  Cancel,
  CheckCircle,
  Block
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const UserManagement: React.FC = () => {
  const { getAllUsers, createUser, updateUser, deleteUser, user: currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState(getAllUsers());
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student' as 'admin' | 'student' | 'teacher',
    school: '',
    grade: '',
    subjects: [] as string[]
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'student',
      school: '',
      grade: '',
      subjects: []
    });
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '', // Don't populate password for security
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      school: user.school || '',
      grade: user.grade || '',
      subjects: user.subjects || []
    });
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleSaveUser = async () => {
    setLoading(true);
    setError('');

    try {
      let result;
      if (editingUser) {
        // Update user (don't include password if empty)
        const updateData: any = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          school: formData.school,
          grade: formData.grade,
          subjects: formData.subjects
        };
        
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        result = await updateUser(editingUser.id, updateData);
      } else {
        // Create new user
        if (!formData.password) {
          setError('Password is required for new users');
          setLoading(false);
          return;
        }
        
        result = await createUser({
          email: formData.email,
          password: formData.password,
          username: formData.email.split('@')[0], // Generate username from email
          fullName: `${formData.firstName} ${formData.lastName}`,
          role: formData.role
        });
      }

      if (result) {
        setUsers(getAllUsers());
        setOpenDialog(false);
        setSuccess(editingUser ? 'User updated successfully' : 'User created successfully');
      } else {
        setError('Operation failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      setLoading(true);
      try {
        const result = await deleteUser(userId);
        if (result) {
          setUsers(getAllUsers());
          setSuccess('User deleted successfully');
        } else {
          setError('Failed to delete user');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'error';
      case 'teacher': return 'warning';
      case 'student': return 'success';
      default: return 'default';
    }
  };

  const getRoleIcon = (role: string): React.ReactElement => {
    switch (role) {
      case 'admin': return <AdminPanelSettings />;
      case 'teacher': return <School />;
      case 'student': return <Person />;
      default: return <Person />;
    }
  };

  const filteredUsers = users.filter(user => {
    switch (tabValue) {
      case 1: return user.role === 'admin';
      case 2: return user.role === 'teacher';
      case 3: return user.role === 'student';
      default: return true;
    }
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          👥 User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddUser}
          disabled={loading}
        >
          Add New User
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* User Statistics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              {users.length}
            </Typography>
            <Typography variant="h6">Total Users</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="error.main" fontWeight="bold">
              {users.filter(u => u.role === 'admin').length}
            </Typography>
            <Typography variant="h6">Admins</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="warning.main" fontWeight="bold">
              {users.filter(u => u.role === 'teacher').length}
            </Typography>
            <Typography variant="h6">Teachers</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h3" color="success.main" fontWeight="bold">
              {users.filter(u => u.role === 'student').length}
            </Typography>
            <Typography variant="h6">Students</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* User Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`All Users (${users.length})`} />
          <Tab label={`Admins (${users.filter(u => u.role === 'admin').length})`} />
          <Tab label={`Teachers (${users.filter(u => u.role === 'teacher').length})`} />
          <Tab label={`Students (${users.filter(u => u.role === 'student').length})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <UserTable 
          users={filteredUsers} 
          currentUser={currentUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          getRoleColor={getRoleColor}
          getRoleIcon={getRoleIcon}
          loading={loading}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <UserTable 
          users={filteredUsers} 
          currentUser={currentUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          getRoleColor={getRoleColor}
          getRoleIcon={getRoleIcon}
          loading={loading}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <UserTable 
          users={filteredUsers} 
          currentUser={currentUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          getRoleColor={getRoleColor}
          getRoleIcon={getRoleIcon}
          loading={loading}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <UserTable 
          users={filteredUsers} 
          currentUser={currentUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          getRoleColor={getRoleColor}
          getRoleIcon={getRoleIcon}
          loading={loading}
        />
      </TabPanel>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                fullWidth
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              />
              <TextField
                label="Last Name"
                fullWidth
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </Box>
            
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!!editingUser}
            />
            
            <Box sx={{ position: 'relative' }}>
              <TextField
                label={editingUser ? "New Password (leave blank to keep current)" : "Password"}
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              />
              <IconButton
                sx={{ position: 'absolute', right: 8, top: 8 }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>
            
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="School"
              fullWidth
              value={formData.school}
              onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
            />
            
            {formData.role === 'student' && (
              <TextField
                label="Grade"
                fullWidth
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                placeholder="e.g., JHS 3"
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveUser} 
            variant="contained" 
            startIcon={<Save />}
            disabled={loading}
          >
            {loading ? 'Saving...' : (editingUser ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Separate UserTable component for reusability
const UserTable: React.FC<{
  users: any[];
  currentUser: any;
  onEdit: (user: any) => void;
  onDelete: (userId: string, userName: string) => void;
  getRoleColor: (role: string) => any;
  getRoleIcon: (role: string) => React.ReactElement;
  loading: boolean;
}> = ({ users, currentUser, onEdit, onDelete, getRoleColor, getRoleIcon, loading }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell><strong>User</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Role</strong></TableCell>
            <TableCell><strong>School</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Created</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: getRoleColor(user.role) + '.main' }}>
                    {getRoleIcon(user.role)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {user.fullName || `${user.firstName} ${user.lastName}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {user.id}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip 
                  label={user.role}
                  color={getRoleColor(user.role)}
                  size="small"
                  icon={getRoleIcon(user.role)}
                />
              </TableCell>
              <TableCell>{user.school || '-'}</TableCell>
              <TableCell>
                <Chip 
                  label={user.isActive ? 'Active' : 'Inactive'}
                  color={user.isActive ? 'success' : 'default'}
                  size="small"
                  icon={user.isActive ? <CheckCircle /> : <Block />}
                />
              </TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    size="small" 
                    onClick={() => onEdit(user)}
                    color="primary"
                    disabled={loading}
                  >
                    <Edit />
                  </IconButton>
                  {user.id !== currentUser?.id && (
                    <IconButton 
                      size="small" 
                      onClick={() => onDelete(user.id, user.fullName || `${user.firstName} ${user.lastName}`)}
                      color="error"
                      disabled={loading}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserManagement;
