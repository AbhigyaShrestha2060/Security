import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  KeyOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Button, Card, Form, Input, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { loginUserApi, verifyMfaCodeApi } from '../../Apis/api'; // Ensure this import path is correct

const { Title, Text, Paragraph } = Typography;

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

// Front end validation

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);

  // MFA related states
  const [isMfaRequired, setIsMfaRequired] = useState(false);
  const [mfaType, setMfaType] = useState(''); // e.g., "email", "app"
  const [mfaCode, setMfaCode] = useState('');

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

      const { data } = response;

      if (response.status === 200) {
        if (data.mfaRequired) {
          setIsMfaRequired(true);
          setMfaType(data.mfaType);
          return; // Don't continue yet, let the user input MFA code
        }

        const encodedToken = btoa(data.token);
        localStorage.setItem('token', encodedToken);
        setLoginAttempts(0);
        localStorage.removeItem('accountLockedUntil');
        navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/');
      } else {
        handleLoginAttempt();
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Send the MFA code to the backend to verify
      const response = await verifyMfaCodeApi({
        email: form.getFieldValue('email'),
        mfaCode: mfaCode,
      });

      const { data } = response;

      if (response.status === 200) {
        const encodedToken = btoa(data.token);
        localStorage.setItem('token', encodedToken);
        navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/');
      } else {
        throw new Error(data.message || 'Invalid MFA code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'MFA verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen relative bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'>
      {/* Animated background shapes */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute w-96 h-96 -left-12 -top-12 bg-white/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute w-96 h-96 -right-12 -bottom-12 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
      </div>

      <div className='relative min-h-screen flex items-center justify-center p-4'>
        <Card
          className='w-full max-w-md backdrop-blur-lg bg-white/90'
          style={{
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
          <Spin
            spinning={loading}
            size='large'>
            <div className='text-center mb-8'>
              <KeyOutlined className='text-5xl text-blue-500 mb-4' />
              <Title
                level={2}
                className='!mb-2'>
                Welcome Back
              </Title>
              <Paragraph type='secondary'>
                Enter your credentials to access your account
              </Paragraph>
            </div>

            {error && (
              <Alert
                message='Error'
                description={error}
                type='error'
                showIcon
                closable
                className='mb-6'
                style={{ borderRadius: '0.5rem' }}
              />
            )}

            {isLocked && lockoutEndTime && (
              <Alert
                message='Account Temporarily Locked'
                description={`Too many failed attempts. Please try again after ${lockoutEndTime.toLocaleTimeString()}`}
                type='warning'
                showIcon
                className='mb-6'
                style={{ borderRadius: '0.5rem' }}
              />
            )}

            {/* Initial Login Form */}
            {!isMfaRequired && (
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
                    prefix={<UserOutlined className='text-gray-400' />}
                    placeholder='Email'
                    disabled={isLocked}
                    autoComplete='email'
                    className='rounded-lg'
                    style={{ height: '3rem' }}
                  />
                </Form.Item>

                <Form.Item name='password'>
                  <Input.Password
                    prefix={<LockOutlined className='text-gray-400' />}
                    placeholder='Password'
                    disabled={isLocked}
                    iconRender={(visible) =>
                      visible ? (
                        <EyeTwoTone className='text-gray-400' />
                      ) : (
                        <EyeInvisibleOutlined className='text-gray-400' />
                      )
                    }
                    autoComplete='current-password'
                    className='rounded-lg'
                    style={{ height: '3rem' }}
                  />
                </Form.Item>

                <div className='flex justify-center mb-4'>
                  <ReCAPTCHA
                    sitekey='6LeqWbMqAAAAAJsPdQqXcEX6M-68zQNUex8sYCgA'
                    onChange={setCaptchaToken}
                    theme='light'
                  />
                </div>

                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    block
                    disabled={isLocked || !captchaToken}
                    className='h-12 rounded-lg'
                    style={{
                      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                      border: 'none',
                    }}>
                    Log In
                  </Button>
                </Form.Item>

                <div className='relative my-8'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-200'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-4 bg-white text-gray-500'>
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  icon={<GoogleOutlined />}
                  type='default'
                  block
                  size='large'
                  className='!h-12 rounded-lg'>
                  Google
                </Button>
              </Form>
            )}

            {/* MFA Input Form */}
            {isMfaRequired && (
              <Form
                form={form}
                onFinish={handleMfaSubmit}
                layout='vertical'
                requiredMark={false}
                size='large'>
                <Form.Item
                  name='mfaCode'
                  rules={[
                    { required: true, message: 'Please enter the MFA code' },
                  ]}>
                  <Input
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder={`Enter the ${
                      mfaType === 'email' ? 'email' : 'app'
                    } code`}
                    disabled={loading}
                    className='rounded-lg'
                    style={{ height: '3rem' }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type='primary'
                    htmlType='submit'
                    block
                    loading={loading}
                    disabled={loading || !mfaCode}>
                    Verify MFA Code
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Spin>
        </Card>
      </div>
    </div>
  );
};

export default Login;
