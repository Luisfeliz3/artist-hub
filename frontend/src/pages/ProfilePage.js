import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Avatar,
  TextField,
  Divider,
  Paper,
  Chip,
  Badge,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Select,
  Input,
  LinearProgress,
  CircularProgress,
  Alert,
  Snackbar,
  Fab,
  Tooltip,
  Stack,
  Rating,
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  CameraAlt,
  Person,
  People,
  ShoppingBag,
  Favorite,
  Star,
  Settings,
  CreditCard,
  Security,
  Notifications,
  Language,
  Palette,
  Delete,
  Block,
  RemoveCircle,
  Add,
  Mic,
  MoreVert,
  Email,
  Phone,
  LocationOn,
  Cake,
  CalendarToday,
  Link,
  Instagram,
  YouTube,
  Twitter,
  TikTok,
  DoNotDisturbOnOutlined,
  DirectionsBoat,
  Spotify,
  Soundcloud,
  Wallet,
  Receipt,
  History,
  Download,
  Share,
  QrCode,
  Verified,
  EmojiEvents,
  TrendingUp,
  BarChart,
  Timeline,
  AttachMoney,
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning,
  Info,
  Help,
  Logout,
  DeleteForever,
  CloudUpload,
  Image,
  AddAPhoto,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Redux
import {
  fetchUserProfile,
  updateProfile,
  uploadProfileImage,
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
  removeFollower,
  blockUser,
  fetchPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  updateAccountSettings,
  changePassword,
  fetchUserStats,
  fetchUserActivity,
  setActiveTab,
  toggleEditMode,
  updateLocalProfile,
  selectUserProfile,
  selectProfileLoading,
  selectFollowers,
  selectFollowing,
  selectPaymentMethods,
  selectUserStats,
  selectUserActivity,
  selectActiveTab,
  selectEditMode,
  deactivateAccount
} from '../redux/slices/profileSlice';

import { selectCurrentUser } from '../redux/slices/authSlice';

// Services
import api from '../services/api';

// Utils
import { generateAvatar } from '../utils/placeholderImages';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const fileInputRef = useRef(null);
  
  // State
  const [anchorEl, setAnchorEl] = useState(null);
  const [followMenuAnchor, setFollowMenuAnchor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [paymentData, setPaymentData] = useState({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    isDefault: false,
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    privacy: 'public',
    theme: 'dark',
    language: 'en',
    twoFactorAuth: false,
  });

  // Form
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm();

  // Redux selectors
  const currentUser = useSelector(selectCurrentUser);
  const userProfile = useSelector(selectUserProfile);
  const isLoading = useSelector(selectProfileLoading);
  const followers = useSelector(selectFollowers);
  const following = useSelector(selectFollowing);
  const paymentMethods = useSelector(selectPaymentMethods);
  const userStats = useSelector(selectUserStats);
  const userActivity = useSelector(selectUserActivity);
  const activeTab = useSelector(selectActiveTab);
  const editMode = useSelector(selectEditMode);


  // Check if viewing own profile
  const isOwnProfile = !userId || userId === currentUser?._id || userId === 'me';

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const profileUserId = userId || currentUser?._id;
      
      if (profileUserId) {
        await Promise.all([
          dispatch(fetchUserProfile(profileUserId)),
          dispatch(fetchFollowers(profileUserId)),
          dispatch(fetchFollowing(profileUserId)),
          dispatch(fetchUserStats(profileUserId)),
          dispatch(fetchUserActivity(profileUserId)),
        ]);
        
        if (isOwnProfile) {
          await dispatch(fetchPaymentMethods());
        }
      }
    };

    loadData();
  }, [dispatch, userId, currentUser, isOwnProfile]);

  // Reset form when profile loads
  useEffect(() => {
    if (userProfile && !editMode) {
      reset({
        username: userProfile.username || '',
        email: userProfile.email || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        website: userProfile.website || '',
        phone: userProfile.phone || '',
        birthday: userProfile.birthday || null,
        socialLinks: userProfile.socialLinks || {},
      });
    }
  }, [userProfile, editMode, reset]);

  // Handlers
  const handleTabChange = (event, newValue) => {
    dispatch(setActiveTab(newValue));
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFollowMenuClick = (event, user) => {
    event.stopPropagation();
    setSelectedUser(user);
    setFollowMenuAnchor(event.currentTarget);
  };

  const handleFollowMenuClose = () => {
    setFollowMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleEditToggle = () => {
    dispatch(toggleEditMode());
  };

  const handleSaveProfile = async (data) => {
    await dispatch(updateProfile(data));
  };

  const handleCancelEdit = () => {
    dispatch(editMode(false));
    reset();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      await dispatch(uploadProfileImage(file));
    }
  };

  const handleFollowUser = async (targetUserId) => {
    await dispatch(followUser(targetUserId));
  };

  const handleUnfollowUser = async (targetUserId) => {
    await dispatch(unfollowUser(targetUserId));
  };

  const handleRemoveFollower = async (followerId) => {
    await dispatch(removeFollower(followerId));
    setShowRemoveConfirm(false);
  };

  const handleBlockUser = async (userId) => {
    await dispatch(blockUser(userId));
    setShowBlockConfirm(false);
  };

  const handleAddPaymentMethod = async () => {
    await dispatch(addPaymentMethod(paymentData));
    setShowAddPayment(false);
    setPaymentData({
      type: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      nameOnCard: '',
      isDefault: false,
    });
  };

  const handleDeletePaymentMethod = async (methodId) => {
    await dispatch(deletePaymentMethod(methodId));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    await dispatch(changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    }));
    
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleUpdateSettings = async () => {
    await dispatch(updateAccountSettings(settings));
  };

  const handleDeactivateAccount = async () => {
    await dispatch(deactivateAccount('User requested deactivation'));
    setShowDeactivate(false);
    // Redirect to home or login
    navigate('/');
  };

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Render social links
  const renderSocialLinks = () => {
    const socialLinks = userProfile?.socialLinks || {};
    return (
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        {socialLinks.instagram && (
          <IconButton
            size="small"
            href={socialLinks.instagram}
            target="_blank"
            sx={{ color: '#E1306C' }}
          >
            <Instagram />
          </IconButton>
        )}
        {socialLinks.youtube && (
          <IconButton
            size="small"
            href={socialLinks.youtube}
            target="_blank"
            sx={{ color: '#FF0000' }}
          >
            <YouTube />
          </IconButton>
        )}
        {socialLinks.twitter && (
          <IconButton
            size="small"
            href={socialLinks.twitter}
            target="_blank"
            sx={{ color: '#1DA1F2' }}
          >
            <Twitter />
          </IconButton>
        )}
        {socialLinks.tiktok && (
          <IconButton
            size="small"
            href={socialLinks.tiktok}
            target="_blank"
            sx={{ color: '#000000' }}
          >
            <DoNotDisturbOnOutlined />
          </IconButton>
        )}
        {socialLinks.spotify && (
          <IconButton
            size="small"
            href={socialLinks.spotify}
            target="_blank"
            sx={{ color: '#1DB954' }}
          >
            <DoNotDisturbOnOutlined />
          </IconButton>
        )}
        {socialLinks.soundcloud && (
          <IconButton
            size="small"
            href={socialLinks.soundcloud}
            target="_blank"
            sx={{ color: '#FF7700' }}
          >
            <DoNotDisturbOnOutlined />
          </IconButton>
        )}
      </Stack>
    );
  };

  // Render stats cards
  const renderStats = () => {
    if (!userStats) return null;

    const stats = [
      {
        label: 'Followers',
        value: userStats.followers || 0,
        icon: <People />,
        color: '#8A2BE2',
        change: '+12%',
      },
      {
        label: 'Following',
        value: userStats.following || 0,
        icon: <Person />,
        color: '#00D4FF',
        change: '+5%',
      },
      {
        label: 'Orders',
        value: userStats.orders || 0,
        icon: <ShoppingBag />,
        color: '#00CC88',
        change: '+23%',
      },
      {
        label: 'Reviews',
        value: userStats.reviews || 0,
        icon: <Star />,
        color: '#FFAA00',
        rating: userStats.avgRating || 0,
      },
      {
        label: 'Engagement',
        value: `${userStats.engagement || 0}%`,
        icon: <TrendingUp />,
        color: '#FF4D4D',
        change: '+8%',
      },
      {
        label: 'Revenue',
        value: `$${userStats.revenue || 0}`,
        icon: <AttachMoney />,
        color: '#9C27B0',
        change: '+15%',
      },
    ];

    return (
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  p: 2,
                  textAlign: 'center',
                  background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `linear-gradient(45deg, ${stat.color}, ${stat.color}80)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h5" className="gradient-text">
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
                {stat.change && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      color: stat.change.startsWith('+') ? '#00CC88' : '#FF4D4D',
                    }}
                  >
                    {stat.change}
                  </Typography>
                )}
                {stat.rating && (
                  <Rating
                    value={stat.rating}
                    readOnly
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  };

  // Render payment methods
  const renderPaymentMethods = () => {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              <CreditCard sx={{ mr: 1, verticalAlign: 'middle' }} />
              Payment Methods
            </Typography>
            <Button
              startIcon={<Add />}
              onClick={() => setShowAddPayment(true)}
            >
              Add New
            </Button>
          </Box>

          {paymentMethods.length === 0 ? (
            <Alert severity="info">
              No payment methods added yet.
            </Alert>
          ) : (
            <List>
              {paymentMethods.map((method, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 1,
                    mb: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <CreditCard />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {method.type === 'card' ? 'Credit Card' : method.type}
                        </Typography>
                        {method.isDefault && (
                          <Chip label="Default" size="small" color="primary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {method.type === 'card' && `•••• ${method.last4} - Expires ${method.expiryDate}`}
                        {method.type === 'paypal' && method.email}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeletePaymentMethod(method._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render followers/following list
  const renderConnections = () => {
    const list = activeTab === 'followers' ? followers : following;
    const title = activeTab === 'followers' ? 'Followers' : 'Following';

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title} ({list.length})
          </Typography>
          <List>
            {list.length === 0 ? (
              <Alert severity="info">
                {activeTab === 'followers' 
                  ? 'No followers yet' 
                  : 'Not following anyone yet'}
              </Alert>
            ) : (
              list.map((user, index) => (
                <motion.div
                  key={user._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ListItem
                    button
                    onClick={() => navigate(`/profile/${user._id}`)}
                    sx={{
                      mb: 1,
                      borderRadius: 1,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          user.isVerified ? (
                            <Verified sx={{ fontSize: 12, color: '#00D4FF' }} />
                          ) : null
                        }
                      >
                        <Avatar src={user.profileImage} alt={user.username} />
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1">
                            {user.username}
                          </Typography>
                          {user.role === 'artist' && (
                            <Chip label="Artist" size="small" color="secondary" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {user.bio || 'No bio'}
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={(e) => handleFollowMenuClick(e, user)}
                      >
                        <MoreVert />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </motion.div>
              ))
            )}
          </List>
        </CardContent>
      </Card>
    );
  };

  // Render activity feed
  const renderActivity = () => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <List>
            {userActivity.slice(0, 10).map((activity, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {activity.type === 'purchase' && <ShoppingBag />}
                    {activity.type === 'follow' && <Person />}
                    {activity.type === 'like' && <Favorite />}
                    {activity.type === 'review' && <Star />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.description}
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {new Date(activity.timestamp).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  if (isLoading && !userProfile) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading profile...</Typography>
      </Container>
    );
  }

  if (!userProfile) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Alert severity="error">
          Profile not found
        </Alert>
      </Container>
    );
  }

  return (
    // <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: 4,
              mb: 4,
              background: 'linear-gradient(145deg, #1A1A2E 0%, #16213E 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
            }}
          >
            {/* Profile Image Section */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              <Box sx={{ position: 'relative' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Tooltip title={userProfile.isVerified ? 'Verified User' : 'Unverified'}>
                      {userProfile.isVerified ? (
                        <Verified sx={{ fontSize: 40, color: '#00D4FF' }} />
                      ) : (
                        <Warning sx={{ fontSize: 40, color: '#FFAA00' }} />
                      )}
                    </Tooltip>
                  }
                >
                  <Avatar
                    src={userProfile.profileImage}
                    sx={{
                      width: 150,
                      height: 150,
                      border: '4px solid',
                      borderColor: 'primary.main',
                    }}
                  />
                </Badge>
                
                {isOwnProfile && (
                  <Fab
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CameraAlt />
                  </Fab>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Box>

              {/* Profile Info */}
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h3" gutterBottom>
                      {userProfile.username}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {userProfile.email}
                    </Typography>
                    {userProfile.role === 'artist' && (
                      <Chip
                        label="Artist Account"
                        color="secondary"
                        icon={<Mic />}
                        sx={{ mb: 1 }}
                      />
                    )}
                    {userProfile.role === 'admin' && (
                      <Chip
                        label="Administrator"
                        color="error"
                        icon={<Security />}
                        sx={{ mb: 1 }}
                      />
                    )}
                  </Box>

                  {isOwnProfile && (
                    <Box>
                      <IconButton onClick={handleMenuClick}>
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleEditToggle}>
                          <Edit sx={{ mr: 1 }} />
                          Edit Profile
                        </MenuItem>
                        <MenuItem onClick={() => setShowChangePassword(true)}>
                          <Lock sx={{ mr: 1 }} />
                          Change Password
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/settings')}>
                          <Settings sx={{ mr: 1 }} />
                          Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => setShowDeactivate(true)} sx={{ color: 'error.main' }}>
                          <DeleteForever sx={{ mr: 1 }} />
                          Deactivate Account
                        </MenuItem>
                      </Menu>
                    </Box>
                  )}
                </Box>

                {editMode ? (
                  <form onSubmit={handleSubmit(handleSaveProfile)}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Username"
                          {...register('username', { required: 'Username is required' })}
                          error={!!errors.username}
                          helperText={errors.username?.message}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Bio"
                          multiline
                          rows={3}
                          {...register('bio')}
                          placeholder="Tell us about yourself..."
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Location"
                          {...register('location')}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOn />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="birthday"
                          control={control}
                          // render={({ field }) => (
                          //   <DatePicker
                          //     label="Birthday"
                          //     value={field.value}
                          //     onChange={field.onChange}
                          //     renderInput={(params) => (
                          //       <TextField
                          //         {...params}
                          //         fullWidth
                          //         InputProps={{
                          //           ...params.InputProps,
                          //           startAdornment: (
                          //             <InputAdornment position="start">
                          //               <Cake />
                          //             </InputAdornment>
                          //           ),
                          //         }}
                          //       />
                          //     )}
                          //   />
                          // )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={handleCancelEdit}
                            startIcon={<Cancel />}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Save />}
                          >
                            Save Changes
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                ) : (
                  <>
                    <Typography variant="body1" paragraph>
                      {userProfile.bio || 'No bio added yet.'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                      {userProfile.location && (
                        <Chip
                          icon={<LocationOn />}
                          label={userProfile.location}
                          variant="outlined"
                        />
                      )}
                      {userProfile.website && (
                        <Chip
                          icon={<Link />}
                          label="Website"
                          component="a"
                          href={userProfile.website}
                          target="_blank"
                          clickable
                          variant="outlined"
                        />
                      )}
                      {userProfile.birthday && (
                        <Chip
                          icon={<Cake />}
                          label={`Birthday: ${new Date(userProfile.birthday).toLocaleDateString()}`}
                          variant="outlined"
                        />
                      )}
                      <Chip
                        icon={<CalendarToday />}
                        label={`Joined: ${new Date(userProfile.createdAt).toLocaleDateString()}`}
                        variant="outlined"
                      />
                    </Box>

                    {renderSocialLinks()}

                    {/* Stats Overview */}
                    <Box sx={{ display: 'flex', gap: 3, mt: 3 }}>
                      <Tooltip title="Followers">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5">
                            {userStats?.followers || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Followers
                          </Typography>
                        </Box>
                      </Tooltip>
                      <Tooltip title="Following">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5">
                            {userStats?.following || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Following
                          </Typography>
                        </Box>
                      </Tooltip>
                      <Tooltip title="Posts">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5">
                            {userStats?.posts || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Posts
                          </Typography>
                        </Box>
                      </Tooltip>
                      <Tooltip title="Orders">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5">
                            {userStats?.orders || 0}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Orders
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  </>
                )}

                {/* Action Buttons */}
                {!isOwnProfile && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      startIcon={<Person />}
                      onClick={() => handleFollowUser(userProfile._id)}
                    >
                      Follow
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Email />}
                      onClick={() => navigate(`/messages/${userProfile._id}`)}
                    >
                      Message
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Block />}
                      onClick={() => {
                        setSelectedUser(userProfile);
                        setShowBlockConfirm(true);
                      }}
                    >
                      Block
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </motion.div>

        {/* Stats Section */}
        {renderStats()}

        {/* Main Content Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(45deg, #8A2BE2, #00D4FF)',
              },
            }}
          >
            <Tab label="Overview" value="overview" icon={<BarChart />} />
            <Tab label="Followers" value="followers" icon={<People />} />
            <Tab label="Following" value="following" icon={<Person />} />
            <Tab label="Activity" value="activity" icon={<Timeline />} />
            {isOwnProfile && <Tab label="Payments" value="payments" icon={<CreditCard />} />}
            {isOwnProfile && <Tab label="Settings" value="settings" icon={<Settings />} />}
            {isOwnProfile && <Tab label="Security" value="security" icon={<Security />} />}
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  {renderActivity()}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Quick Actions
                      </Typography>
                      <Stack spacing={2}>
                        {isOwnProfile && (
                          <>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<Edit />}
                              onClick={handleEditToggle}
                            >
                              Edit Profile
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<Wallet />}
                              onClick={() => navigate('/wallet')}
                            >
                              View Wallet
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<Receipt />}
                              onClick={() => navigate('/orders')}
                            >
                              My Orders
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<Favorite />}
                              onClick={() => navigate('/favorites')}
                            >
                              Favorites
                            </Button>
                          </>
                        )}
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Share />}
                          onClick={() => toast.success('Profile link copied!')}
                        >
                          Share Profile
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<QrCode />}
                          onClick={() => toast.info('QR Code generated')}
                        >
                          Show QR Code
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Achievements
                      </Typography>
                      <List>
                        {[
                          { title: 'First Purchase', icon: <ShoppingBag />, unlocked: true },
                          { title: 'Social Butterfly', icon: <People />, unlocked: true },
                          { title: 'Early Adopter', icon: <EmojiEvents />, unlocked: true },
                          { title: 'Power User', icon: <TrendingUp />, unlocked: false },
                          { title: 'Top Contributor', icon: <Star />, unlocked: false },
                        ].map((achievement, index) => (
                          <ListItem key={index}>
                            <ListItemAvatar>
                              <Avatar sx={{ 
                                bgcolor: achievement.unlocked ? 'primary.main' : 'grey.800',
                                color: achievement.unlocked ? 'white' : 'grey.500',
                              }}>
                                {achievement.icon}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={achievement.title}
                              secondary={achievement.unlocked ? 'Unlocked' : 'Locked'}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {activeTab === 'followers' && renderConnections()}
            {activeTab === 'following' && renderConnections()}
            {activeTab === 'activity' && renderActivity()}

            {activeTab === 'payments' && isOwnProfile && (
              <>
                {renderPaymentMethods()}
                
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Transaction History
                    </Typography>
                    <Alert severity="info">
                      Transaction history would appear here
                    </Alert>
                  </CardContent>
                </Card>
              </>
            )}

            {activeTab === 'settings' && isOwnProfile && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Account Settings
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <FormLabel component="legend">Notifications</FormLabel>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.emailNotifications}
                              onChange={(e) => setSettings({
                                ...settings,
                                emailNotifications: e.target.checked,
                              })}
                            />
                          }
                          label="Email Notifications"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.pushNotifications}
                              onChange={(e) => setSettings({
                                ...settings,
                                pushNotifications: e.target.checked,
                              })}
                            />
                          }
                          label="Push Notifications"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl component="fieldset" sx={{ width: '100%' }}>
                        <FormLabel component="legend">Privacy</FormLabel>
                        <RadioGroup
                          value={settings.privacy}
                          onChange={(e) => setSettings({
                            ...settings,
                            privacy: e.target.value,
                          })}
                        >
                          <FormControlLabel value="public" control={<Radio />} label="Public Profile" />
                          <FormControlLabel value="private" control={<Radio />} label="Private Profile" />
                          <FormControlLabel value="friends" control={<Radio />} label="Friends Only" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <FormLabel>Theme</FormLabel>
                        <RadioGroup
                          value={settings.theme}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: e.target.value,
                          })}
                          row
                        >
                          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                          <FormControlLabel value="light" control={<Radio />} label="Light" />
                          <FormControlLabel value="auto" control={<Radio />} label="Auto" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <FormLabel>Language</FormLabel>
                        <Select
                          value={settings.language}
                          onChange={(e) => setSettings({
                            ...settings,
                            language: e.target.value,
                          })}
                        >
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                          <MenuItem value="ja">Japanese</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          onClick={handleUpdateSettings}
                          startIcon={<Save />}
                        >
                          Save Settings
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && isOwnProfile && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Settings
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.twoFactorAuth}
                            onChange={(e) => setSettings({
                              ...settings,
                              twoFactorAuth: e.target.checked,
                            })}
                          />
                        }
                        label="Two-Factor Authentication"
                      />
                      <Typography variant="caption" color="text.secondary" display="block">
                        Add an extra layer of security to your account
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Active Sessions
                      </Typography>
                      <Alert severity="info">
                        Active sessions would appear here
                      </Alert>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2">
                            Download Your Data
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Request a copy of your personal data
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          startIcon={<Download />}
                        >
                          Request Data
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dialogs */}
        {/* Change Password Dialog */}
        <Dialog open={showChangePassword} onClose={() => setShowChangePassword(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowChangePassword(false)}>Cancel</Button>
            <Button onClick={handleChangePassword} variant="contained">
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Payment Method Dialog */}
        <Dialog open={showAddPayment} onClose={() => setShowAddPayment(false)}>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep} sx={{ my: 3 }}>
              <Step><StepLabel>Type</StepLabel></Step>
              <Step><StepLabel>Details</StepLabel></Step>
              <Step><StepLabel>Confirm</StepLabel></Step>
            </Stepper>

            {activeStep === 0 && (
              <RadioGroup
                value={paymentData.type}
                onChange={(e) => setPaymentData({ ...paymentData, type: e.target.value })}
              >
                <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                <FormControlLabel value="bank" control={<Radio />} label="Bank Transfer" />
              </RadioGroup>
            )}

            {activeStep === 1 && paymentData.type === 'card' && (
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Card Number"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                />
                <TextField
                  fullWidth
                  label="Expiry Date"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                  placeholder="MM/YY"
                />
                <TextField
                  fullWidth
                  label="CVV"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                  placeholder="123"
                />
                <TextField
                  fullWidth
                  label="Name on Card"
                  value={paymentData.nameOnCard}
                  onChange={(e) => setPaymentData({ ...paymentData, nameOnCard: e.target.value })}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={paymentData.isDefault}
                      onChange={(e) => setPaymentData({ ...paymentData, isDefault: e.target.checked })}
                    />
                  }
                  label="Set as default payment method"
                />
              </Stack>
            )}

            {activeStep === 2 && (
              <Alert severity="info">
                Review your payment information before confirming.
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            {activeStep > 0 && (
              <Button onClick={handleBackStep}>Back</Button>
            )}
            {activeStep < 2 ? (
              <Button onClick={handleNextStep} variant="contained">
                Next
              </Button>
            ) : (
              <Button onClick={handleAddPaymentMethod} variant="contained">
                Add Payment Method
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Block User Confirmation */}
        <Dialog open={showBlockConfirm} onClose={() => setShowBlockConfirm(false)}>
          <DialogTitle>Block User</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ my: 2 }}>
              Are you sure you want to block {selectedUser?.username}? 
              You won't be able to see their content or receive messages from them.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowBlockConfirm(false)}>Cancel</Button>
            <Button onClick={() => handleBlockUser(selectedUser?._id)} color="error" variant="contained">
              Block User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Remove Follower Confirmation */}
        <Dialog open={showRemoveConfirm} onClose={() => setShowRemoveConfirm(false)}>
          <DialogTitle>Remove Follower</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ my: 2 }}>
              Remove {selectedUser?.username} from your followers? 
              They won't be notified, but they won't be able to see your posts.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowRemoveConfirm(false)}>Cancel</Button>
            <Button onClick={() => handleRemoveFollower(selectedUser?._id)} color="error" variant="contained">
              Remove Follower
            </Button>
          </DialogActions>
        </Dialog>

        {/* Deactivate Account Dialog */}
        <Dialog open={showDeactivate} onClose={() => setShowDeactivate(false)}>
          <DialogTitle>Deactivate Account</DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ my: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Warning: This action is irreversible
              </Typography>
              <Typography variant="body2">
                • Your profile will be hidden from other users
                • All your content will be archived
                • You can reactivate within 30 days
                • After 30 days, account deletion is permanent
              </Typography>
            </Alert>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Reason for leaving (optional)"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeactivate(false)}>Cancel</Button>
            <Button onClick={handleDeactivateAccount} color="error" variant="contained">
              Deactivate Account
            </Button>
          </DialogActions>
        </Dialog>

        {/* Follow Menu */}
        <Menu
          anchorEl={followMenuAnchor}
          open={Boolean(followMenuAnchor)}
          onClose={handleFollowMenuClose}
        >
          <MenuItem onClick={() => {
            if (selectedUser) {
              navigate(`/profile/${selectedUser._id}`);
            }
            handleFollowMenuClose();
          }}>
            <Person sx={{ mr: 1 }} />
            View Profile
          </MenuItem>
          <MenuItem onClick={() => {
            if (selectedUser) {
              navigate(`/messages/${selectedUser._id}`);
            }
            handleFollowMenuClose();
          }}>
            <Email sx={{ mr: 1 }} />
            Send Message
          </MenuItem>
          {activeTab === 'followers' && (
            <MenuItem 
              onClick={() => {
                setShowRemoveConfirm(true);
                handleFollowMenuClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <RemoveCircle sx={{ mr: 1 }} />
              Remove Follower
            </MenuItem>
          )}
          {activeTab === 'following' && (
            <MenuItem 
              onClick={() => {
                if (selectedUser) {
                  handleUnfollowUser(selectedUser._id);
                }
                handleFollowMenuClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Person sx={{ mr: 1 }} />
              Unfollow
            </MenuItem>
          )}
          <MenuItem 
            onClick={() => {
              setShowBlockConfirm(true);
              handleFollowMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Block sx={{ mr: 1 }} />
            Block User
          </MenuItem>
        </Menu>
      </Container>
    // </LocalizationProvider>
  );
};

export default ProfilePage;