import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  KeyOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Spin,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { loginUserApi, verifyMfaCodeApi } from '../../Apis/api';

const { Title, Text, Paragraph } = Typography;

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

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

const StyledLoginContainer = styled.div`
  min-height: 100vh;
  position: relative;
  background: linear-gradient(
    135deg,
    ${COLORS.primary} 0%,
    ${COLORS.background} 100%
  );

  .blur-overlay {
    position: absolute;
    inset: 0;
    overflow: hidden;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 24rem;
      height: 24rem;
      border-radius: 50%;
      background: rgba(79, 156, 255, 0.1);
      filter: blur(60px);
    }

    &::before {
      left: -3rem;
      top: -3rem;
      animation: pulse 4s infinite;
    }

    &::after {
      right: -3rem;
      bottom: -3rem;
      animation: pulse 4s infinite 1s;
    }
  }

  @keyframes pulse {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 28rem;
  backdrop-filter: blur(16px);
  background: rgba(30, 41, 59, 0.8);
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(79, 156, 255, 0.2);

  .ant-card-body {
    padding: 2rem;
  }

  .ant-typography {
    color: ${COLORS.text};

    &.ant-typography-secondary {
      color: ${COLORS.darkGrey};
    }
  }

  .ant-form-item-label > label {
    color: ${COLORS.text};
  }

  .ant-input-affix-wrapper {
    background: ${COLORS.inputBg};
    border-color: ${COLORS.borderColor};

    &:hover,
    &:focus,
    &-focused {
      border-color: ${COLORS.secondary};
      box-shadow: 0 0 0 2px rgba(79, 156, 255, 0.2);
    }

    input {
      background: transparent;
      color: ${COLORS.text};

      &::placeholder {
        color: ${COLORS.darkGrey};
      }
    }

    .anticon {
      color: ${COLORS.darkGrey};

      &:hover {
        color: ${COLORS.secondary};
      }
    }
  }

  .ant-btn {
    &.login-button {
      background: linear-gradient(45deg, ${COLORS.secondary}, ${COLORS.accent});
      border: none;
      height: 3rem;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(
          45deg,
          ${COLORS.accent},
          ${COLORS.secondary}
        );
        transform: translateY(-1px);
      }

      &:disabled {
        background: ${COLORS.darkGrey};
        opacity: 0.5;
      }
    }

    &.google-button {
      background: ${COLORS.inputBg};
      border-color: ${COLORS.borderColor};
      color: ${COLORS.text};
      height: 3rem;
      transition: all 0.3s ease;

      &:hover {
        background: ${COLORS.grey};
        border-color: ${COLORS.secondary};
      }
    }
  }

  .divider {
    border-color: ${COLORS.borderColor};
    margin: 2rem 0;

    .divider-text {
      color: ${COLORS.text};
      background: ${COLORS.white};
      padding: 0 1rem;
    }
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    background: ${COLORS.white};

    .ant-modal-header {
      background: ${COLORS.white};
      border-bottom: 1px solid ${COLORS.borderColor};

      .ant-modal-title {
        color: ${COLORS.text};
      }
    }

    .ant-modal-body {
      .ant-form-item-label > label {
        color: ${COLORS.text};
      }

      .ant-input {
        background: ${COLORS.inputBg};
        border-color: ${COLORS.borderColor};
        color: ${COLORS.text};

        &:hover,
        &:focus {
          border-color: ${COLORS.secondary};
          box-shadow: 0 0 0 2px rgba(79, 156, 255, 0.2);
        }

        &::placeholder {
          color: ${COLORS.darkGrey};
        }
      }

      .ant-btn {
        background: ${COLORS.secondary};
        border: none;

        &:hover {
          background: ${COLORS.accent};
        }

        &:disabled {
          background: ${COLORS.darkGrey};
          opacity: 0.5;
        }
      }
    }

    .ant-modal-close {
      color: ${COLORS.text};

      &:hover {
        color: ${COLORS.secondary};
      }
    }
  }
`;

const StyledAlert = styled(Alert)`
  background: ${COLORS.inputBg};
  border: 1px solid ${COLORS.borderColor};
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;

  .ant-alert-message {
    color: ${(props) =>
      props.type === 'error' ? COLORS.error : COLORS.warning};
  }

  .ant-alert-description {
    color: ${COLORS.text};
  }

  .ant-alert-close-icon {
    color: ${COLORS.text};

    &:hover {
      color: ${COLORS.secondary};
    }
  }
`;

const Login = () => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);

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

  const validateEmail = (_, value) => {
    if (!value) {
      return Promise.reject('Please enter your email');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject('Please enter a valid email address');
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
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
        email: values.email,
        password: values.password,
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

  const handleOtpSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');

      const response = await verifyMfaCodeApi({
        userId: userId,
        otp: values.otp,
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
    <StyledLoginContainer>
      <div className='blur-overlay items-center' />
      <div className='relative min-h-screen flex items-center justify-center p-4'>
        <StyledCard>
          <Spin
            spinning={loading}
            size='large'>
            <div className='text-center mb-8'>
              <KeyOutlined
                style={{
                  fontSize: '3rem',
                  color: COLORS.secondary,
                  marginBottom: '1rem',
                }}
              />
              <Title level={2}>Welcome Back</Title>
              <Paragraph type='secondary'>
                Enter your credentials to access your account
              </Paragraph>
            </div>

            {error && (
              <StyledAlert
                message='Error'
                description={error}
                type='error'
                showIcon
                closable
              />
            )}

            {isLocked && lockoutEndTime && (
              <StyledAlert
                message='Account Temporarily Locked'
                description={`Too many failed attempts. Please try again after ${lockoutEndTime.toLocaleTimeString()}`}
                type='warning'
                showIcon
              />
            )}

            <Form
              form={form}
              onFinish={handleSubmit}
              layout='vertical'
              requiredMark={false}
              size='large'>
              <Form.Item
                name='email'
                rules={[{ validator: validateEmail }]}>
                <Input
                  prefix={<UserOutlined />}
                  placeholder='Email'
                  disabled={isLocked}
                  autoComplete='email'
                />
              </Form.Item>

              <Form.Item
                name='password'
                rules={[
                  { required: true, message: 'Please enter your password' },
                ]}>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder='Password'
                  disabled={isLocked}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  autoComplete='current-password'
                />
              </Form.Item>

              <div className='flex justify-center mb-4'>
                <ReCAPTCHA
                  sitekey='6LeqWbMqAAAAAJsPdQqXcEX6M-68zQNUex8sYCgA'
                  onChange={setCaptchaToken}
                  theme='dark'
                />
              </div>

              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  block
                  disabled={isLocked || !captchaToken}
                  className='login-button'>
                  Log In
                </Button>
              </Form.Item>

              <div className='divider'>
                <div className='relative flex justify-center'>
                  <span className='divider-text'>Or continue with</span>
                </div>
              </div>

              <Button
                icon={<GoogleOutlined />}
                block
                className='google-button'>
                Google
              </Button>
            </Form>
          </Spin>
        </StyledCard>
      </div>

      <StyledModal
        title='Enter OTP'
        open={isOtpModalVisible}
        footer={null}
        onCancel={() => setIsOtpModalVisible(false)}
        maskClosable={false}>
        <Form
          form={otpForm}
          onFinish={handleOtpSubmit}
          layout='vertical'>
          <Form.Item
            name='otp'
            rules={[
              { required: true, message: 'Please enter the OTP' },
              { len: 6, message: 'OTP must be 6 digits' },
            ]}>
            <Input
              placeholder='Enter 6-digit OTP'
              maxLength={6}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              loading={loading}>
              Verify OTP
            </Button>
          </Form.Item>
        </Form>
      </StyledModal>

      <style
        jsx
        global>{`
        .recaptcha-dark {
          filter: invert(0.9) hue-rotate(180deg);
        }
      `}</style>
    </StyledLoginContainer>
  );
};

export default Login;
