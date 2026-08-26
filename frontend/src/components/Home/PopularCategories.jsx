import React, { useState } from "react";
import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";

const CATEGORIES = [
  {
    id: 1,
    title: "Graphics & Design",
    subTitle: "305 Open Positions",
    icon: <MdOutlineDesignServices />,
  },
  {
    id: 2,
    title: "Mobile App Development",
    subTitle: "500 Open Positions",
    icon: <TbAppsFilled />,
  },
  {
    id: 3,
    title: "Frontend Web Development",
    subTitle: "200 Open Positions",
    icon: <MdOutlineWebhook />,
  },
  {
    id: 4,
    title: "MERN Stack Development",
    subTitle: "1000+ Open Positions",
    icon: <FaReact />,
  },
  {
    id: 5,
    title: "Account & Finance",
    subTitle: "150 Open Positions",
    icon: <MdAccountBalance />,
  },
  {
    id: 6,
    title: "Artificial Intelligence",
    subTitle: "867 Open Positions",
    icon: <GiArtificialIntelligence />,
  },
  {
    id: 7,
    title: "Video Animation",
    subTitle: "50 Open Positions",
    icon: <MdOutlineAnimation />,
  },
  {
    id: 8,
    title: "Game Development",
    subTitle: "80 Open Positions",
    icon: <IoGameController />,
  },
];

const PopularCategories = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={styles.section}>
      <h3 style={styles.heading}>Popular Categories</h3>
      <div style={styles.banner}>
        {CATEGORIES.map((element) => {
          const isHovered = hoveredId === element.id;
          return (
            <div
              key={element.id}
              style={{
                ...styles.card,
                ...(isHovered ? styles.cardHovered : {}),
              }}
              onMouseEnter={() => setHoveredId(element.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                style={{
                  ...styles.icon,
                  ...(isHovered ? styles.iconHovered : {}),
                }}
              >
                {element.icon}
              </div>
              <div style={styles.text}>
                <p style={styles.title}>{element.title}</p>
                <p style={styles.subTitle}>{element.subTitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  section: {
    padding: "40px 24px",
    maxWidth: 1200,
    margin: "0 auto",
    boxSizing: "border-box",
  },
  heading: {
    textAlign: "center",
    fontSize: "1.4rem",
    letterSpacing: "1px",
    marginBottom: 28,
    color: "#1f2937",
  },
  banner: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "18px 20px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    transition:
      "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
  },
  cardHovered: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(79, 70, 229, 0.15)",
    background: "#4f46e5",
  },
  icon: {
    fontSize: "1.8rem",
    color: "#4f46e5",
    flexShrink: 0,
    transition: "color 0.15s ease",
  },
  iconHovered: {
    color: "#fff",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  title: {
    margin: 0,
    fontWeight: 600,
    fontSize: "0.95rem",
    color: "inherit",
  },
  subTitle: {
    margin: 0,
    fontSize: "0.8rem",
    color: "#6b7280",
  },
};

export default PopularCategories;
