import {
  Facebook,
  Instagram,
  SendRounded,
  Twitter,
  YouTube,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const COLORS = {
  primary: '#1a1a2e',
  secondary: '#4f9cff',
  accent: '#60a5fa',
  background: '#0f172a',
  text: '#f1f5f9',
  white: '#1e293b',
  grey: '#334155',
};

// Styled Components
const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.white,
  color: COLORS.text,
  position: 'relative',
  padding: theme.spacing(8, 0),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, 
      transparent 0%, 
      ${alpha(COLORS.secondary, 0.3)} 50%, 
      transparent 100%
    )`,
  },
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
  color: COLORS.secondary,
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 40,
    height: 2,
    background: `linear-gradient(90deg, ${COLORS.secondary}, transparent)`,
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: COLORS.text,
  opacity: 0.8,
  textDecoration: 'none',
  display: 'block',
  marginBottom: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    color: COLORS.secondary,
    opacity: 1,
    transform: 'translateX(8px)',
  },
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
  color: COLORS.text,
  opacity: 0.8,
  transition: 'all 0.3s ease',
  marginRight: theme.spacing(1),
  '&:hover': {
    color: COLORS.secondary,
    opacity: 1,
    transform: 'translateY(-4px)',
    backgroundColor: alpha(COLORS.secondary, 0.1),
  },
}));

const NewsletterBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  background: alpha(COLORS.background, 0.3),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(COLORS.grey, 0.2)}`,
  borderRadius: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const NewsletterInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: alpha(COLORS.background, 0.5),
    color: COLORS.text,
    '& fieldset': {
      borderColor: alpha(COLORS.grey, 0.3),
    },
    '&:hover fieldset': {
      borderColor: alpha(COLORS.secondary, 0.5),
    },
    '&.Mui-focused fieldset': {
      borderColor: COLORS.secondary,
    },
  },
  '& .MuiInputLabel-root': {
    color: alpha(COLORS.text, 0.7),
  },
}));

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
  };

  return (
    <StyledFooter>
      <Container maxWidth='lg'>
        <Grid
          container
          spacing={4}>
          {/* Brand Column */}
          <Grid
            item
            xs={12}
            md={4}>
            <FooterHeading variant='h6'>Gadget Mart</FooterHeading>
            <Typography
              variant='body2'
              sx={{ opacity: 0.8, mb: 3 }}>
              Your one-stop destination for all things tech. Discover the latest
              gadgets and innovations that make life smarter and easier.
            </Typography>
            <NewsletterBox>
              <Typography
                variant='subtitle2'
                sx={{ mb: 2, color: COLORS.secondary }}>
                Stay Updated
              </Typography>
              <Box
                component='form'
                onSubmit={handleNewsletterSubmit}
                sx={{ display: 'flex' }}>
                <NewsletterInput
                  size='small'
                  label='Email Address'
                  variant='outlined'
                  fullWidth
                  sx={{ mr: 1 }}
                />
                <Button
                  variant='contained'
                  type='submit'
                  sx={{
                    background: `linear-gradient(45deg, ${COLORS.secondary}, ${COLORS.accent})`,
                    minWidth: 'auto',
                    px: 2,
                  }}>
                  <SendRounded />
                </Button>
              </Box>
            </NewsletterBox>
          </Grid>

          {/* Quick Links */}
          <Grid
            item
            xs={12}
            sm={6}
            md={2}>
            <FooterHeading variant='h6'>Company</FooterHeading>
            <FooterLink
              component={RouterLink}
              to='/'>
              Home
            </FooterLink>
            <FooterLink
              component={RouterLink}
              to='/about'>
              About
            </FooterLink>
            <FooterLink
              component={RouterLink}
              to='/solutions'>
              Solutions
            </FooterLink>
            <FooterLink
              component={RouterLink}
              to='/pricing'>
              Pricing
            </FooterLink>
            <FooterLink
              component={RouterLink}
              to='/team'>
              Team
            </FooterLink>
            <FooterLink
              component={RouterLink}
              to='/career'>
              Career
            </FooterLink>
          </Grid>

          {/* Documentation */}
          <Grid
            item
            xs={12}
            sm={6}
            md={2}>
            <FooterHeading variant='h6'>Documentation</FooterHeading>
            <FooterLink
              component={RouterLink}
              to='/help'>
              Help Centre
            </FooterLink>
            <FooterLink
              component={RouterLink}
              to='/contact'>
              Contact
            </FooterLink>
            <FooterLink
              component={RouterLink}
              to='/faq'>
              FAQ
            </FooterLink>
            <FooterLink
              component={RouterLink}
              to='/privacy-policy'>
              Privacy Policy
            </FooterLink>
          </Grid>

          {/* Social Links */}
          <Grid
            item
            xs={12}
            md={4}>
            <FooterHeading variant='h6'>Connect With Us</FooterHeading>
            <Typography
              variant='body2'
              sx={{ mb: 2, opacity: 0.8 }}>
              Follow us on social media for the latest updates, tech news, and
              exclusive offers.
            </Typography>
            <Box sx={{ mb: 3 }}>
              <SocialButton
                aria-label='Facebook'
                href='https://facebook.com'
                target='_blank'>
                <Facebook />
              </SocialButton>
              <SocialButton
                aria-label='Instagram'
                href='https://instagram.com'
                target='_blank'>
                <Instagram />
              </SocialButton>
              <SocialButton
                aria-label='YouTube'
                href='https://youtube.com'
                target='_blank'>
                <YouTube />
              </SocialButton>
              <SocialButton
                aria-label='Twitter'
                href='https://twitter.com'
                target='_blank'>
                <Twitter />
              </SocialButton>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Divider
          sx={{
            my: 4,
            borderColor: alpha(COLORS.grey, 0.2),
            '&::before, &::after': {
              borderColor: alpha(COLORS.grey, 0.2),
            },
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}>
          <Typography
            variant='body2'
            sx={{ opacity: 0.8 }}>
            © {currentYear} Gadget Mart. All Rights Reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FooterLink
              component={RouterLink}
              to='/terms-conditions'
              sx={{ mb: 0 }}>
              Terms & Conditions
            </FooterLink>
            <FooterLink
              component={RouterLink}
              to='/privacy-policy'
              sx={{ mb: 0 }}>
              Privacy Policy
            </FooterLink>
          </Box>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
