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
  success: '#22c55e',
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

const PasswordStrengthContainer = styled.div`
  margin: -0.8rem 0 1.2rem;
  padding: 0 0.5rem;
`;

const StrengthMeter = styled.div`
  display: flex;
  gap: 4px;
  height: 4px;
  margin: 8px 0;
`;

const MeterSegment = styled.div`
  flex: 1;
  height: 100%;
  border-radius: 2px;
  transition: background-color 0.3s ease;
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 8px 0;
  font-size: 0.8rem;
  color: ${COLORS.darkGrey};

  li {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 4px 0;

    &.met {
      color: ${COLORS.success};
    }
  }
`;

const StrengthText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;

  .strength-label {
    font-weight: 500;
  }

  .strength-score {
    color: ${COLORS.darkGrey};
    font-size: 0.75rem;
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

const PasswordStrength = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, text: '', color: COLORS.darkGrey };

    let score = 0;
    const requirements = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };

    // Score based on requirements
    if (requirements.length) score++;
    if (pwd.length >= 12) score++;
    if (requirements.uppercase) score++;
    if (requirements.lowercase) score++;
    if (requirements.numbers) score++;
    if (requirements.special) score++;

    // Map score to strength levels
    const strengthMap = {
      0: { text: 'Too Weak', color: COLORS.error },
      1: { text: 'Weak', color: COLORS.error },
      2: { text: 'Fair', color: COLORS.warning },
      3: { text: 'Good', color: COLORS.warning },
      4: { text: 'Strong', color: COLORS.success },
      5: { text: 'Very Strong', color: COLORS.success },
      6: { text: 'Excellent', color: COLORS.success },
    };

    return {
      score,
      requirements,
      ...strengthMap[score],
    };
  };

  const strength = calculateStrength(password);
  const segments = 6;

  return (
    <PasswordStrengthContainer>
      <StrengthText>
        <span
          className='strength-label'
          style={{ color: password ? strength.color : COLORS.darkGrey }}>
          {password ? strength.text : 'Password Strength'}
        </span>
        {password && (
          <span className='strength-score'>
            Score: {strength.score}/{segments}
          </span>
        )}
      </StrengthText>

      <StrengthMeter>
        {[...Array(segments)].map((_, index) => (
          <MeterSegment
            key={index}
            style={{
              backgroundColor:
                index < strength.score ? strength.color : COLORS.grey,
            }}
          />
        ))}
      </StrengthMeter>

      {password && (
        <RequirementsList>
          <li className={strength.requirements.length ? 'met' : ''}>
            • Minimum 8 characters
          </li>
          <li className={strength.requirements.uppercase ? 'met' : ''}>
            • At least one uppercase letter
          </li>
          <li className={strength.requirements.lowercase ? 'met' : ''}>
            • At least one lowercase letter
          </li>
          <li className={strength.requirements.numbers ? 'met' : ''}>
            • At least one number
          </li>
          <li className={strength.requirements.special ? 'met' : ''}>
            • At least one special character
          </li>
        </RequirementsList>
      )}
    </PasswordStrengthContainer>
  );
};

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

          <PasswordStrength password={password} />

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
