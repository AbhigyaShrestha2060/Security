import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AdminNavbar from './AdminNavbar';

const StyledNavbar = styled(motion.nav)`
  background-color: #1a1a2e;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled(motion.img)`
  height: 50px;
  cursor: pointer;
  filter: brightness(1.2);
`;

const NavLinks = styled(motion.ul)`
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(motion.li)`
  margin: 0 1.25rem;
`;

const StyledNavLink = styled(NavLink)`
  color: #e6e6ff;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;

  &:hover,
  &.active {
    color: #4f9cff;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #4f9cff;
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover::after,
  &.active::after {
    transform: scaleX(1);
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin-left: 1rem;
  color: #e6e6ff;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #4f9cff;
  }
`;

const MobileMenuButton = styled(IconButton)`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(26, 26, 46, 0.98);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const ProfileDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #1a1a2e;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 1rem;
  min-width: 220px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DropdownItem = styled(motion.div)`
  padding: 0.75rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #e6e6ff;
  border-radius: 8px;

  &:hover {
    background-color: rgba(79, 156, 255, 0.1);
    color: #4f9cff;
  }

  svg {
    margin-right: 0.75rem;
    font-size: 1.2rem;
  }
`;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 500, damping: 30 },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { type: 'tween', duration: 0.3 } },
  };

  return user && user.role === 'admin' ? (
    <>
      <AdminNavbar />
    </>
  ) : (
    <StyledNavbar
      initial='hidden'
      animate='visible'
      variants={navVariants}>
      <NavContainer>
        <Link to='/landingpage'>
          <Logo
            src='./../assets/icons/GMlogo.png'
            alt='Gadget Mart'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        </Link>
        <NavLinks>
          <NavItem variants={itemVariants}>
            <StyledNavLink
              exact
              to='/userdashboard'>
              Home
            </StyledNavLink>
          </NavItem>
          <NavItem variants={itemVariants}>
            <StyledNavLink to='/about'>About Us</StyledNavLink>
          </NavItem>
          <NavItem variants={itemVariants}>
            <StyledNavLink to='/cart'>Cart</StyledNavLink>
          </NavItem>
        </NavLinks>
        <UserActions>
          {user ? (
            <div style={{ position: 'relative' }}>
              <IconButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}>
                <Icon
                  icon={dropdownOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                />
                <Icon
                  icon='mdi:account-circle'
                  style={{ marginLeft: '5px' }}
                />
              </IconButton>
              <AnimatePresence>
                {dropdownOpen && (
                  <ProfileDropdown
                    initial='hidden'
                    animate='visible'
                    exit='hidden'
                    variants={dropdownVariants}>
                    <DropdownItem whileHover={{ x: 5 }}>
                      <Link
                        to='/profile'
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                        }}>
                        <Icon icon='mdi:account' />
                        Profile
                      </Link>
                    </DropdownItem>
                    <DropdownItem whileHover={{ x: 5 }}>
                      <Link
                        to='/cart'
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                        }}>
                        <Icon icon='mdi:cart' />
                        Cart
                      </Link>
                    </DropdownItem>
                    <DropdownItem whileHover={{ x: 5 }}>
                      <Link
                        to='/favourites'
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                        }}>
                        <Icon icon='mdi:heart' />
                        Favourites
                      </Link>
                    </DropdownItem>
                    <DropdownItem whileHover={{ x: 5 }}>
                      <Link
                        to='/orderlist'
                        style={{
                          color: 'inherit',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                        }}>
                        <Icon icon='mdi:order-bool-ascending' />
                        My Orders
                      </Link>
                    </DropdownItem>
                    <DropdownItem
                      whileHover={{ x: 5 }}
                      onClick={handleLogout}>
                      <Icon icon='mdi:logout' />
                      Logout
                    </DropdownItem>
                  </ProfileDropdown>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to='/login'
                className='btn btn-outline-primary me-2'>
                Login
              </Link>
              <Link
                to='/register'
                className='btn btn-primary'>
                Register
              </Link>
            </>
          )}
          <MobileMenuButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}>
            <Icon icon={mobileMenuOpen ? 'mdi:close' : 'mdi:menu'} />
          </MobileMenuButton>
        </UserActions>
      </NavContainer>
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={mobileMenuVariants}>
            <NavItem variants={itemVariants}>
              <StyledNavLink
                exact
                to='/'
                onClick={() => setMobileMenuOpen(false)}>
                Home
              </StyledNavLink>
            </NavItem>
            <NavItem variants={itemVariants}>
              <StyledNavLink
                to='/about'
                onClick={() => setMobileMenuOpen(false)}>
                About Us
              </StyledNavLink>
            </NavItem>
            <NavItem variants={itemVariants}>
              <StyledNavLink
                to='/contact'
                onClick={() => setMobileMenuOpen(false)}>
                Contact Us
              </StyledNavLink>
            </NavItem>
          </MobileMenu>
        )}
      </AnimatePresence>
    </StyledNavbar>
  );
};

export default Navbar;
