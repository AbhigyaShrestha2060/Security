// import React from "react";

// const AboutUs = () => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "row",
//         padding: "20px",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <div style={{ flex: 1, marginRight: "20px" }}>
//         <h2 style={{ color: "orange" }}>How It Started</h2>
//         <h1>Our Dream is Global Learning Transformation</h1>
//         <p>
//           Kawruh was founded by Robert Anderson, a passionate lifelong learner,
//           and Maria Sanchez, a visionary educator. Their shared dream was to
//           create a digital haven of knowledge accessible to all. United by their
//           belief in the transformational power of education, they embarked on a
//           journey to build 'Kawruh.' With relentless dedication, they gathered a
//           team of experts and launched this innovative platform, creating a
//           global community of eager learners, all connected by the desire to
//           explore, learn, and grow.
//         </p>
//       </div>
//       <div style={{ flex: 1 }}>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             backgroundColor: "#f0f0f0",
//             borderRadius: "10px",
//             padding: "20px",
//           }}
//         >
//           <img
//             src="assets/icons/GMlogo.png"
//             alt="Team"
//             style={{
//               width: "50%",
//               height: "auto",
//               borderRadius: "10px",
//               marginBottom: "20px",
//             }}
//           />
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-around",
//               width: "100%",
//             }}
//           >
//             <div style={{ textAlign: "center" }}>
//               <h3>3.5</h3>
//               <p>Years Experience</p>
//             </div>
//             <div style={{ textAlign: "center" }}>
//               <h3>23</h3>
//               <p>Project Challenge</p>
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-around",
//               width: "100%",
//               marginTop: "20px",
//             }}
//           >
//             <div style={{ textAlign: "center" }}>
//               <h3>830+</h3>
//               <p>Positive Reviews</p>
//             </div>
//             <div style={{ textAlign: "center" }}>
//               <h3>100K</h3>
//               <p>Trusted Students</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutUs;

import React from "react";
import {
  FaProjectDiagram,
  FaRegClock,
  FaRegThumbsUp,
  FaUserGraduate,
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.textSection}>
          <h3 style={styles.subtitle}>How It Started</h3>
          <h1 style={styles.title}>
            Our Dream is Global Learning Transformation
          </h1>
          <p style={styles.description}>
            Kawruh was founded by Robert Anderson, a passionate lifelong
            learner, and Maria Sanchez, a visionary educator. Their shared dream
            was to create a digital haven of knowledge accessible to all. United
            by their belief in the transformational power of education, they
            embarked on a journey to build 'Kawruh.' With relentless dedication,
            they gathered a team of experts and launched this innovative
            platform, creating a global community of eager learners, all
            connected by the desire to explore, learn, and grow.
          </p>
        </div>
        <div style={styles.statsSection}>
          <div style={styles.logoContainer}>
            <img
              src="assets/icons/GMlogo.png"
              alt="Kawruh Logo"
              style={styles.logo}
            />
          </div>
          <div style={styles.statsGrid}>
            {[
              { icon: <FaRegClock />, value: "3.5", label: "Years Experience" },
              {
                icon: <FaProjectDiagram />,
                value: "23",
                label: "Project Challenges",
              },
              {
                icon: <FaRegThumbsUp />,
                value: "830+",
                label: "Positive Reviews",
              },
              {
                icon: <FaUserGraduate />,
                value: "100K",
                label: "Trusted Students",
              },
            ].map((stat, index) => (
              <div key={index} style={styles.statItem}>
                <div style={styles.statIcon}>{stat.icon}</div>
                <h3 style={styles.statValue}>{stat.value}</h3>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "50px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "1200px",
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  textSection: {
    flex: 1,
    padding: "60px",
  },
  subtitle: {
    color: "#ff6b6b",
    fontSize: "1.2rem",
    marginBottom: "10px",
    fontWeight: 600,
  },
  title: {
    fontSize: "2.5rem",
    color: "#2d3436",
    marginBottom: "20px",
    lineHeight: 1.2,
  },
  description: {
    fontSize: "1rem",
    color: "#636e72",
    lineHeight: 1.6,
  },
  statsSection: {
    flex: 1,
    backgroundColor: "#4a69bd",
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: "40px",
  },
  logo: {
    width: "120px",
    height: "auto",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "30px",
  },
  statItem: {
    textAlign: "center",
    color: "#ffffff",
  },
  statIcon: {
    fontSize: "2rem",
    marginBottom: "10px",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: 700,
    marginBottom: "5px",
  },
  statLabel: {
    fontSize: "0.9rem",
    opacity: 0.8,
  },
};

export default AboutUs;
