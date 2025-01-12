import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";

const StyledNavbar = styled(motion.nav)`
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
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
  margin: 0 1rem;
`;

const StyledNavLink = styled(NavLink)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 0;

  &:hover,
  &.active {
    color: #007bff;
  }

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #007bff;
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
  color: #333;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #007bff;
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
  background-color: rgba(255, 255, 255, 0.95);
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
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  min-width: 200px;
`;

const DropdownItem = styled(motion.div)`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #333;

  &:hover {
    background-color: #f0f0f0;
    color: #007bff;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
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
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { type: "tween", duration: 0.3 } },
  };
  return user && user.role === "admin" ? (
    <>
      <div className="text-end">
        {/* logout button */}
        <button
          className="btn btn-outline-secondary"
          onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </>
  ) : (
    <StyledNavbar initial="hidden" animate="visible" variants={navVariants}>
      <NavContainer>
        <Link to="/landingpage">
          <Logo
            src="./../assets/icons/GMlogo.png"
            alt="Gadget Mart"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
        </Link>
        <NavLinks>
          <NavItem variants={itemVariants}>
            <StyledNavLink exact to="/userdashboard">
              Home
            </StyledNavLink>
          </NavItem>
          <NavItem variants={itemVariants}>
            <StyledNavLink to="/about">About Us</StyledNavLink>
          </NavItem>
          <NavItem variants={itemVariants}>
            <StyledNavLink to="/contact">Contact Us</StyledNavLink>
          </NavItem>
        </NavLinks>
        <UserActions>
          {user ? (
            <div style={{ position: "relative" }}>
              <IconButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Icon
                  icon={dropdownOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
                />
                <Icon icon="mdi:account-circle" style={{ marginLeft: "5px" }} />
              </IconButton>
              <AnimatePresence>
                {dropdownOpen && (
                  <ProfileDropdown
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                  >
                    <DropdownItem whileHover={{ x: 5 }}>
                      <Link
                        to="/profile"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Icon icon="mdi:account" />
                        Profile
                      </Link>
                    </DropdownItem>
                    <DropdownItem whileHover={{ x: 5 }}>
                      <Link
                        to="/cart"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Icon icon="mdi:cart" />
                        Cart
                      </Link>
                    </DropdownItem>
                    <DropdownItem whileHover={{ x: 5 }}>
                      <Link
                        to="/favourites"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Icon icon="mdi:heart" />
                        Favourites
                      </Link>
                    </DropdownItem>
                    <DropdownItem whileHover={{ x: 5 }}>
                      <Link
                        to="/orderlist"
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Icon icon="mdi:order-bool-ascending" />
                        My Orders
                      </Link>
                    </DropdownItem>
                    <DropdownItem whileHover={{ x: 5 }} onClick={handleLogout}>
                      <Icon icon="mdi:logout" />
                      Logout
                    </DropdownItem>
                  </ProfileDropdown>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
          <MobileMenuButton
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"} />
          </MobileMenuButton>
        </UserActions>
      </NavContainer>
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            <NavItem variants={itemVariants}>
              <StyledNavLink
                exact
                to="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </StyledNavLink>
            </NavItem>
            <NavItem variants={itemVariants}>
              <StyledNavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </StyledNavLink>
            </NavItem>
            <NavItem variants={itemVariants}>
              <StyledNavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
              >
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
