import { motion } from 'framer-motion';
import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
  FaPhone,
  FaUser,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { animated, useSpring } from 'react-spring';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { registerUserApi } from '../../Apis/api';

const COLORS = {
  primary: '#1a1a2e',
  secondary: '#4f9cff',
  accent: '#60a5fa',
  background: '#0f172a',
  text: '#f1f5f9',
  white: '#1e293b',
  grey: '#334155',
  error: '#ef4444',
  warning: '#f59e0b',
  darkGrey: '#64748b',
  inputBg: '#1a1a2e',
  borderColor: '#334155',
};

const BackgroundContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.background});
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  &::before {
    content: '';
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(79, 156, 255, 0.1) 0%,
      transparent 50%
    );
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const RegisterCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(79, 156, 255, 0.2);
  position: relative;
  z-index: 1;

  h2 {
    text-align: center;
    color: ${COLORS.secondary};
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }
`;

const StyledInput = styled(animated.div)`
  position: relative;
  margin-bottom: 1.2rem;

  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.5rem;
    border: 1px solid ${COLORS.borderColor};
    border-radius: 12px;
    background: ${COLORS.inputBg};
    color: ${COLORS.text};
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: ${COLORS.secondary};
      box-shadow: 0 0 0 2px rgba(79, 156, 255, 0.2);
    }

    &::placeholder {
      color: ${COLORS.darkGrey};
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${COLORS.secondary};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${COLORS.secondary};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: ${COLORS.accent};
  }
`;

const StyledButton = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.accent});
  color: ${COLORS.primary};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.secondary});
    transform: translateY(-2px);
  }

  &:disabled {
    background: ${COLORS.darkGrey};
    cursor: not-allowed;
    transform: none;
  }
`;

const GoogleButton = styled(StyledButton)`
  background: ${COLORS.inputBg};
  color: ${COLORS.text};
  border: 1px solid ${COLORS.borderColor};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;

  &:hover {
    background: ${COLORS.grey};
    border-color: ${COLORS.secondary};
  }

  svg {
    font-size: 1.2rem;
  }
`;

const TermsCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: ${COLORS.text};

  input[type='checkbox'] {
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
    accent-color: ${COLORS.secondary};
  }

  label {
    cursor: pointer;
    user-select: none;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: ${COLORS.text};
  font-size: 0.9rem;

  a {
    color: ${COLORS.secondary};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;

    &:hover {
      color: ${COLORS.accent};
    }
  }
`;

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);

  const inputSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 20 },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (!captchaToken) {
      toast.error('Please complete the reCAPTCHA verification');
      return;
    }

    try {
      setLoading(true);
      const response = await registerUserApi({
        fullName,
        email,
        phone,
        password,
        captchaToken,
      });

      if (response.status === 201) {
        toast.success('Registration successful! Please login to continue.');
        // Redirect to login page after short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundContainer>
      <RegisterCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <StyledInput style={inputSpring}>
            <FaUser />
            <input
              type='text'
              placeholder='Full Name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </StyledInput>
          <StyledInput style={inputSpring}>
            <FaEnvelope />
            <input
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </StyledInput>
          <StyledInput style={inputSpring}>
            <FaPhone />
            <input
              type='tel'
              placeholder='Phone Number'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disabled={loading}
            />
          </StyledInput>
          <StyledInput style={inputSpring}>
            <FaLock />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <PasswordToggle
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </PasswordToggle>
          </StyledInput>
          <StyledInput style={inputSpring}>
            <FaLock />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </StyledInput>

          <TermsCheckbox>
            <input
              type='checkbox'
              id='terms'
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor='terms'>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </TermsCheckbox>

          <div style={{ margin: '1rem 0' }}>
            <ReCAPTCHA
              sitekey='6LeqWbMqAAAAAJsPdQqXcEX6M-68zQNUex8sYCgA'
              onChange={(token) => setCaptchaToken(token)}
              theme='dark'
            />
          </div>

          <StyledButton
            type='submit'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </StyledButton>

          <GoogleButton
            as='button'
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`)
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}>
            <FaGoogle />
            Sign up with Google
          </GoogleButton>
        </form>

        <LoginLink>
          Already have an account? <Link to='/login'>Log in</Link>
        </LoginLink>
      </RegisterCard>
    </BackgroundContainer>
  );
};

export default Register;
