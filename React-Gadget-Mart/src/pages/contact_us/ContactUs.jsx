import { motion } from 'framer-motion';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter,
} from 'react-icons/fa';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px;
  font-family: 'Poppins', sans-serif;
  background-color: #0f172a;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-bottom: 40px;
  background-color: #1e293b;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const InfoSection = styled(motion.div)`
  flex: 1;
  min-width: 300px;
  padding: 40px;
  background-color: #1a1a2e;
  color: #f1f5f9;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #4f9cff;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 30px;
    opacity: 0.9;
  }
`;

const ContactInfo = styled.div`
  margin-bottom: 30px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-size: 1rem;

  svg {
    margin-right: 15px;
    font-size: 1.2rem;
    color: #60a5fa;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialIcon = styled.a`
  color: #f1f5f9;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    color: #60a5fa;
    transform: translateY(-3px);
  }
`;

const FormSection = styled(motion.div)`
  flex: 1;
  min-width: 300px;
  padding: 40px;
  background-color: #1e293b;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #334155;
  background-color: #1a1a2e;
  color: #f1f5f9;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4f9cff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 156, 255, 0.2);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #334155;
  background-color: #1a1a2e;
  color: #f1f5f9;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4f9cff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(79, 156, 255, 0.2);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`;

const ErrorMessage = styled.span`
  color: #f87171;
  font-size: 0.8rem;
  position: absolute;
  bottom: -20px;
  left: 0;
`;

const SubmitButton = styled(motion.button)`
  background-color: #4f9cff;
  color: #0f172a;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #60a5fa;
    transform: translateY(-2px);
  }
`;

const ImageSection = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.8);
  }
`;

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    // Handle form submission
    console.log(data);
    reset();
  };

  return (
    <Container>
      <ContentWrapper>
        <InfoSection
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            We'd love to hear from you. Our team is always ready to assist!
          </motion.p>
          <ContactInfo>
            <InfoItem>
              <FaMapMarkerAlt />
              <span>123 Education Street, Learning City, 54321</span>
            </InfoItem>
            <InfoItem>
              <FaPhone />
              <span>+1 (555) 123-4567</span>
            </InfoItem>
            <InfoItem>
              <FaEnvelope />
              <span>info@kawruh.com</span>
            </InfoItem>
          </ContactInfo>
          <SocialLinks>
            <SocialIcon href='#'>
              <FaFacebookF />
            </SocialIcon>
            <SocialIcon href='#'>
              <FaTwitter />
            </SocialIcon>
            <SocialIcon href='#'>
              <FaLinkedinIn />
            </SocialIcon>
            <SocialIcon href='#'>
              <FaInstagram />
            </SocialIcon>
          </SocialLinks>
        </InfoSection>
        <FormSection
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup>
              <Input
                {...register('name', { required: 'Name is required' })}
                placeholder='Your Name'
              />
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </InputGroup>
            <InputGroup>
              <Input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                placeholder='Your Email'
              />
              {errors.email && (
                <ErrorMessage>{errors.email.message}</ErrorMessage>
              )}
            </InputGroup>
            <InputGroup>
              <Input
                {...register('subject', { required: 'Subject is required' })}
                placeholder='Subject'
              />
              {errors.subject && (
                <ErrorMessage>{errors.subject.message}</ErrorMessage>
              )}
            </InputGroup>
            <InputGroup>
              <Textarea
                {...register('message', { required: 'Message is required' })}
                placeholder='Your Message'
              />
              {errors.message && (
                <ErrorMessage>{errors.message.message}</ErrorMessage>
              )}
            </InputGroup>
            <SubmitButton
              type='submit'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Send Message
            </SubmitButton>
          </Form>
        </FormSection>
      </ContentWrapper>
      <ImageSection>
        <img
          src='https://images.unsplash.com/photo-1534536281715-e28d76689b4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
          alt='Contact Us'
        />
      </ImageSection>
    </Container>
  );
};

export default ContactUs;
