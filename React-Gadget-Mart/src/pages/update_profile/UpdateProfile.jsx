import React, { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSingleUserApi, updateProfileApi } from "../../Apis/api";

const UpdateProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getSingleUserApi(id);
      const { user } = response.data;
      setUserData({
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        password: "",
      });
    } catch (error) {
      console.error("Error Fetching Data", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      const { fullname, email, phone, password } = userData;
      const requestData = { fullname, email, phone, password };

      const response = await updateProfileApi(id, requestData);
      if (response.status === 200) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating user profile", error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update profile");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveChanges();
  };

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.updateProfileContainer}>
      <ToastContainer />
      <div style={styles.card}>
        <h2 style={styles.heading}>Update Profile</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <InputField
            label="Full Name"
            name="fullname"
            value={userData.fullname}
            onChange={handleInputChange}
            type="text"
            icon={<FaUser />}
          />
          <InputField
            label="Email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            type="email"
            icon={<FaEnvelope />}
          />
          <InputField
            label="Phone Number"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            type="tel"
            icon={<FaPhone />}
          />
          <InputField
            label="Password"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
            type="password"
            icon={<FaLock />}
          />
          <button type="submit" style={styles.button}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, type, icon }) => (
  <div style={styles.formGroup}>
    <label style={styles.label}>
      {label}
      <div style={styles.inputWrapper}>
        <span style={styles.icon}>{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required
          style={styles.input}
        />
      </div>
    </label>
  </div>
);

const styles = {
  updateProfileContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage:
      'url("https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2029&q=80")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "2rem",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    padding: "2.5rem",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#333",
    fontSize: "2.5rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#555",
    fontSize: "1.1rem",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: "12px",
    color: "#777",
    fontSize: "1.2rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
    border: "2px solid #ddd",
    borderRadius: "10px",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    outline: "none",
    ":focus": {
      borderColor: "#4a90e2",
      boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.1)",
    },
  },
  button: {
    padding: "1rem",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#4a90e2",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginTop: "1rem",
    ":hover": {
      backgroundColor: "#3a7bc8",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(74, 144, 226, 0.3)",
    },
    ":active": {
      transform: "translateY(0)",
      boxShadow: "0 2px 6px rgba(74, 144, 226, 0.3)",
    },
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "1.5rem",
    color: "#333",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
};

export default UpdateProfile;
