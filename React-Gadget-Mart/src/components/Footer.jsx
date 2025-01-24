import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeOutlined,
} from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const COLORS = {
  primary: '#1a1a2e',
  secondary: '#4f9cff',
  accent: '#60a5fa',
  background: '#0f172a',
  text: '#f1f5f9',
  white: '#1e293b',
  grey: '#334155',
};

const StyledFooter = styled.footer`
  background-color: ${COLORS.white};
  padding: 4rem 0;
  color: ${COLORS.text};
`;

const FooterColumn = styled.div`
  margin-bottom: 2rem;

  p {
    color: ${COLORS.text};
    opacity: 0.8;
  }
`;

const FooterTitle = styled.h5`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${COLORS.secondary};
`;

const FooterLink = styled(Link)`
  color: ${COLORS.text};
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  opacity: 0.8;

  &:hover {
    color: ${COLORS.secondary};
    opacity: 1;
    transform: translateX(5px);
  }
`;

const SocialIcon = styled.a`
  font-size: 1.5rem;
  color: ${COLORS.text};
  margin-right: 1rem;
  transition: all 0.3s ease;
  opacity: 0.8;

  &:hover {
    color: ${COLORS.secondary};
    opacity: 1;
    transform: translateY(-3px);
  }
`;

const Newsletter = styled.div`
  display: flex;
  margin-top: 1rem;

  .ant-input {
    background: ${COLORS.background};
    border-color: ${COLORS.grey};
    color: ${COLORS.text};

    &:focus {
      border-color: ${COLORS.secondary};
      box-shadow: 0 0 0 2px rgba(79, 156, 255, 0.2);
    }
  }

  .ant-btn {
    background: ${COLORS.secondary};
    border-color: ${COLORS.secondary};

    &:hover {
      background: ${COLORS.accent};
      border-color: ${COLORS.accent};
      transform: translateX(3px);
    }
  }
`;

const Copyright = styled.p`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${COLORS.grey};
  color: ${COLORS.text};
  opacity: 0.8;
`;

const Footer = () => {
  return (
    <StyledFooter>
      <div className='container'>
        <div className='row'>
          <FooterColumn className='col-md-4'>
            <FooterTitle>Gadget Mart</FooterTitle>
          </FooterColumn>
          <FooterColumn className='col-md-2'>
            <FooterTitle>Company</FooterTitle>
            <FooterLink to='/'>Home</FooterLink>
            <FooterLink to='/about'>About</FooterLink>
            <FooterLink to='/solutions'>Solutions</FooterLink>
            <FooterLink to='/pricing'>Pricing</FooterLink>
            <FooterLink to='/team'>Team</FooterLink>
            <FooterLink to='/career'>Career</FooterLink>
          </FooterColumn>
          <FooterColumn className='col-md-2'>
            <FooterTitle>Documentation</FooterTitle>
            <FooterLink to='/help'>Help Centre</FooterLink>
            <FooterLink to='/contact'>Contact</FooterLink>
            <FooterLink to='/faq'>FAQ</FooterLink>
            <FooterLink to='/privacy-policy'>Privacy Policy</FooterLink>
          </FooterColumn>
          <FooterColumn className='col-md-4'>
            <FooterTitle>Connect With Us</FooterTitle>
            <div>
              <SocialIcon
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'>
                <FacebookOutlined />
              </SocialIcon>
              <SocialIcon
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'>
                <InstagramOutlined />
              </SocialIcon>
              <SocialIcon
                href='https://youtube.com'
                target='_blank'
                rel='noopener noreferrer'>
                <YoutubeOutlined />
              </SocialIcon>
              <SocialIcon
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'>
                <TwitterOutlined />
              </SocialIcon>
            </div>
          </FooterColumn>
        </div>
        <Copyright>
          © {new Date().getFullYear()} Gadget Mart. All Rights Reserved.
          <FooterLink
            to='/terms-conditions'
            style={{ display: 'inline', marginLeft: '10px' }}>
            Terms & Conditions
          </FooterLink>
        </Copyright>
      </div>
    </StyledFooter>
  );
};

export default Footer;
