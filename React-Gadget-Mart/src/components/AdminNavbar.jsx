import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const AdminNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="./../assets/icons/GMlogo.png"
              alt="Icon"
              className="App-logo"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0 mx-auto">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  exact
                  to="/"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to="/about"
                >
                  Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to="/contact"
                >
                  Users
                </NavLink>
              </li>
            </ul>
            {user ? (
              <div className="d-flex align-items-center">
                <form className="d-flex mx-3" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="What are you looking for?"
                    aria-label="Search"
                  />
                  <button className="btn btn-outline-success" type="submit">
                    <i className="fas fa-search"></i>
                  </button>
                </form>

                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user-circle"></i>
                  </button>

                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </div>
              </div>
            ) : (
              <div className="d-flex">
                <Link to="/login" className="btn btn-primary mx-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary ms-2">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default AdminNavbar;
