import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserRoutes = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user != null && user.role === "user" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default UserRoutes;


// //------------------------------ edit profile ------------------------------//
// import React, { useState } from "react";

// const UserProfile = () => {
//   const [formData, setFormData] = useState({
//     firstName: " ",
//     lastName: " ",
//     email: " ",
//     address: " ",
//     currentPassword: "",
//     newPassword: "",
//     confirmNewPassword: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission
//     console.log("Form submitted", formData);
//   };

//   return (
//     <form onSubmit={handleSubmit} style={styles.form}>
//       <h2 style={styles.header}>Edit Your Profile</h2>
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label>First Name</label>
//           <input
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             style={styles.input}
//           />
//         </div>
//         <div style={styles.column}>
//           <label>Last Name</label>
//           <input
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             style={styles.input}
//           />
//         </div>
//       </div>
//       <div style={styles.row}>
//         <div style={styles.column}>
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             style={styles.input}
//           />
//         </div>
//         <div style={styles.column}>
//           <label>Address</label>
//           <input
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             style={styles.input}
//           />
//         </div>
//       </div>
//       <div style={styles.row}>
//         <label>Password Changes</label>
//         <input
//           type="password"
//           name="currentPassword"
//           placeholder="Current Password"
//           value={formData.currentPassword}
//           onChange={handleChange}
//           style={styles.input}
//         />
//         <input
//           type="password"
//           name="newPassword"
//           placeholder="New Password"
//           value={formData.newPassword}
//           onChange={handleChange}
//           style={styles.input}
//         />
//         <input
//           type="password"
//           name="confirmNewPassword"
//           placeholder="Confirm New Password"
//           value={formData.confirmNewPassword}
//           onChange={handleChange}
//           style={styles.input}
//         />
//       </div>
//       <div style={styles.buttons}>
//         <button type="button" style={styles.cancelButton}>
//           Cancel
//         </button>
//         <button type="submit" style={styles.saveButton}>
//           Save Changes
//         </button>
//       </div>
//     </form>
//   );
// };

// const styles = {
//   form: {
//     maxWidth: "600px",
//     margin: "0 auto",
//     padding: "1rem",
//     border: "1px solid #ccc",
//     borderRadius: "8px",
//     background: "#f9f9f9",
//   },
//   header: {
//     textAlign: "center",
//     color: "#e74c3c",
//   },
//   row: {
//     display: "flex",
//     flexDirection: "column",
//     marginBottom: "1rem",
//   },
//   column: {
//     marginBottom: "1rem",
//   },
//   input: {
//     width: "100%",
//     padding: "0.5rem",
//     margin: "0.5rem 0",
//     border: "1px solid #ccc",
//     borderRadius: "4px",
//   },
//   buttons: {
//     display: "flex",
//     justifyContent: "space-between",
//   },
//   cancelButton: {
//     background: "#ccc",
//     border: "none",
//     padding: "0.5rem 1rem",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   saveButton: {
//     background: "#e74c3c",
//     border: "none",
//     color: "#fff",
//     padding: "0.5rem 1rem",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
// };

// export default UserProfile;
