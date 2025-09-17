// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";

export default function Dashboard() {
  const sections = [
    { name: "Reading", path: "/reading", icon: "/images/reading.png" },
    { name: "Writing", path: "/writing", icon: "/images/writing.png" },
    { name: "Speaking", path: "/speaking", icon: "/images/speaking.png" },
    { name: "Listening", path: "/listening", icon: "/images/listening.png" },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>IELTS Mock Test Dashboard</h2>
      <p style={styles.subtitle}>
        Choose a section to start your practice
      </p>
      <div style={styles.grid}>
        {sections.map((section) => (
          <Link key={section.name} to={section.path} style={styles.card}>
            <img src={section.icon} alt={section.name} style={styles.icon} />
            <div style={styles.label}>{section.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "50px 20px",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    backgroundColor: "#fafafa",
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#222",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "30px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "24px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "30px 20px",
    textDecoration: "none",
    color: "#222",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "transform 0.25s, box-shadow 0.25s",
    fontSize: "18px",
    fontWeight: "600",
  },
  icon: {
    width: "50px",
    height: "50px",
    marginBottom: "14px",
    objectFit: "contain",
  },
  label: {
    fontSize: "16px",
    color: "#333",
    marginTop: "4px",
  },
};
