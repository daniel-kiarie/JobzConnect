import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import { Context } from "../../main";

const HERO_STATS = [
  {
    id: 1,
    count: "1,200+",
    label: "Live Jobs",
    icon: <FaSuitcase size={28} />,
  },
  {
    id: 2,
    count: "500+",
    label: "Companies",
    icon: <FaBuilding size={28} />,
  },
  {
    id: 3,
    count: "10,000+",
    label: "Job Seekers",
    icon: <FaUsers size={28} />,
  },
  {
    id: 4,
    count: "2,500+",
    label: "Employers",
    icon: <FaUserPlus size={28} />,
  },
];

const HeroSection = () => {
  const { isAuthorized, user } = useContext(Context);

  return (
    <section className="heroSection">
      <div className="container">
        <div className="title">
          <h1>
            Find a job that suits <br />
            <span className="highlight">your interests & skills</span>
          </h1>
          <p>
            Discover opportunities matching your expertise and connect directly
            with top employers seeking talented professionals.
          </p>

          {/* Conditional Role-Based Action Buttons */}
          <div
            className="hero-cta"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "14px",
              flexWrap: "wrap",
              marginTop: "25px",
            }}
          >
            {/* Browse Jobs */}
            <Link
              to="/job/getall"
              className="btn btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "150px",
                padding: "13px 22px",
                borderRadius: "8px",
                background: "#3154d8",
                color: "#fff",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "700",
                transition: "0.2s ease",
              }}
            >
              Browse Jobs
            </Link>

            {/* Post a Job - Employers */}
            {isAuthorized && user?.role === "Employer" && (
              <Link
                to="/job/post"
                className="btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "150px",
                  padding: "13px 22px",
                  borderRadius: "8px",
                  background: "#fff",
                  color: "#3154d8",
                  border: "2px solid #3154d8",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "700",
                  transition: "0.2s ease",
                }}
              >
                Post a Job
              </Link>
            )}
          </div>
        </div>

        <div className="image">
          <img
            src="/heroS.jpg"
            alt="Professionals collaborating in a modern workplace"
          />
        </div>
      </div>

      <div className="details">
        {HERO_STATS.map(({ id, count, label, icon }) => (
          <div className="card" key={id}>
            <div className="icon">{icon}</div>
            <div className="content">
              <p className="count">{count}</p>
              <p className="label">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
