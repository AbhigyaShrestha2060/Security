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

const BackgroundContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RegisterCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2.5rem;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const StyledInput = styled(animated.div)`
  position: relative;
  margin-bottom: 1.2rem;

  input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.5rem;
    border: none;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px #a777e3;
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6e8efb;
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
  color: #6e8efb;
`;

const StyledButton = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #a777e3, #6e8efb);
  }
`;

const GoogleButton = styled(StyledButton)`
  background: white;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;

  &:hover {
    background: #f1f1f1;
  }
`;

const TermsCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.8rem;

  input {
    margin-right: 0.5rem;
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

  const inputSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 10 },
  });

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleSubmit = (e) => {
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

    const data = { fullName, email, phone, password, captchaToken };

    registerUserApi(data)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          // Redirect to login page or handle as needed
        }
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Something went wrong';
        toast.error(message);
      });
  };

  return (
    <BackgroundContainer>
      <RegisterCard
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}>
        <h2
          style={{
            textAlign: 'center',
            color: '#6e8efb',
            marginBottom: '1.5rem',
          }}>
          Create Account
        </h2>
        <form onSubmit={handleSubmit}>
          <StyledInput style={inputSpring}>
            <FaUser />
            <input
              type='text'
              placeholder='Full Name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
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
            />
            <PasswordToggle
              type='button'
              onClick={() => setShowPassword(!showPassword)}>
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
            />
          </StyledInput>
          <TermsCheckbox>
            <input
              type='checkbox'
              id='terms'
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label htmlFor='terms'>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </TermsCheckbox>
          <ReCAPTCHA
            sitekey='6LeqWbMqAAAAAJsPdQqXcEX6M-68zQNUex8sYCgA'
            onChange={handleCaptchaChange}
          />
          <StyledButton
            type='submit'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            Sign Up
          </StyledButton>
          <GoogleButton
            as='button'
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`)
            }
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <FaGoogle />
            Sign up with Google
          </GoogleButton>
        </form>
        <div
          style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.9rem',
          }}>
          Already have an account?{' '}
          <Link
            to='/login'
            style={{ color: '#6e8efb', textDecoration: 'none' }}>
            Log in
          </Link>
        </div>
      </RegisterCard>
    </BackgroundContainer>
  );
};

export default Register;
