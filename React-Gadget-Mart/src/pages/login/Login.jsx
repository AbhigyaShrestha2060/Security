import {
  Google,
  Key,
  Lock,
  Mail,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { loginUserApi, verifyMfaCodeApi } from '../../Apis/api';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

// Custom styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.background.default} 100%)`,
  padding: theme.spacing(3),
  position: 'relative',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    width: '24rem',
    height: '24rem',
    borderRadius: '50%',
    background: alpha(theme.palette.primary.main, 0.1),
    filter: 'blur(60px)',
    animation: 'pulse 4s infinite',
  },
  '&::before': {
    left: '-3rem',
    top: '-3rem',
  },
  '&::after': {
    right: '-3rem',
    bottom: '-3rem',
    animationDelay: '1s',
  },
  '@keyframes pulse': {
    '0%': { opacity: 0.5 },
    '50%': { opacity: 0.8 },
    '100%': { opacity: 0.5 },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: '28rem',
  backdropFilter: 'blur(16px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[10],
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
  });

  useEffect(() => {
    const lockedUntil = localStorage.getItem('accountLockedUntil');
    if (lockedUntil) {
      const lockTime = new Date(lockedUntil);
      if (lockTime > new Date()) {
        setIsLocked(true);
        setLockoutEndTime(lockTime);
      } else {
        localStorage.removeItem('accountLockedUntil');
      }
    }
  }, []);

  const handleLoginAttempt = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      const lockoutEnd = new Date(Date.now() + LOCKOUT_DURATION);
      setIsLocked(true);
      setLockoutEndTime(lockoutEnd);
      localStorage.setItem('accountLockedUntil', lockoutEnd.toISOString());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) {
      setError('Account is temporarily locked. Please try again later.');
      return;
    }

    if (!captchaToken) {
      setError('Please complete the reCAPTCHA verification.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await loginUserApi({
        email: formData.email,
        password: formData.password,
        captchaToken,
      });

      if (response.status === 200) {
        if (response.data.success) {
          setUserId(response.data.userId);
          setIsOtpModalVisible(true);
        } else {
          throw new Error(response.data.message || 'Login failed');
        }
      } else {
        handleLoginAttempt();
        throw new Error(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      handleLoginAttempt();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const response = await verifyMfaCodeApi({
        userId: userId,
        otp: formData.otp,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsOtpModalVisible(false);
        navigate(
          response.data.user.role === 'admin' ? '/admin/dashboard' : '/'
        );
      } else {
        throw new Error(response.data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <StyledPaper elevation={24}>
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}>
            <CircularProgress />
          </Box>
        )}
        <Box sx={{ opacity: loading ? 0.5 : 1 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Key sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography
              variant='h4'
              component='h1'
              gutterBottom>
              Welcome Back
            </Typography>
            <Typography
              variant='body1'
              color='text.secondary'>
              Enter your credentials to access your account
            </Typography>
          </Box>

          {error && (
            <Alert
              severity='error'
              sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {isLocked && lockoutEndTime && (
            <Alert
              severity='warning'
              sx={{ mb: 3 }}>
              Account Temporarily Locked. Try again after{' '}
              {lockoutEndTime.toLocaleTimeString()}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Email'
              variant='outlined'
              margin='normal'
              disabled={isLocked}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Mail color='action' />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label='Password'
              variant='outlined'
              margin='normal'
              type={showPassword ? 'text' : 'password'}
              disabled={isLocked}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Lock color='action' />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge='end'>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <ReCAPTCHA
                sitekey='6LeqWbMqAAAAAJsPdQqXcEX6M-68zQNUex8sYCgA'
                onChange={setCaptchaToken}
                theme='dark'
              />
            </Box>

            <Button
              fullWidth
              variant='contained'
              size='large'
              type='submit'
              disabled={isLocked || !captchaToken}
              sx={{
                mt: 2,
                height: 48,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                },
              }}>
              Log In
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography
                variant='body2'
                color='text.secondary'>
                Or continue with
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant='outlined'
              size='large'
              startIcon={<Google />}
              sx={{ height: 48 }}>
              Google
            </Button>
          </form>
        </Box>
      </StyledPaper>

      <Dialog
        open={isOtpModalVisible}
        onClose={() => setIsOtpModalVisible(false)}
        maxWidth='xs'
        fullWidth>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='OTP Code'
            variant='outlined'
            margin='normal'
            value={formData.otp}
            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            inputProps={{ maxLength: 6 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOtpModalVisible(false)}>Cancel</Button>
          <Button
            onClick={handleOtpSubmit}
            variant='contained'>
            Verify OTP
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default Login;
