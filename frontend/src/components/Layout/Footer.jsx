import React, { useContext } from "react";
import { Context } from "../../main";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaTwitter,
  FaBriefcase,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  const { isAuthorized } = useContext(Context);

  if (!isAuthorized) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/daniel-kiarie",
      icon: <FaGithub />,
    },
    {
      name: "LinkedIn",
      url: "https://github.com/daniel-kiarie",
      icon: <FaLinkedin />,
    },
    {
      name: "Portfolio",
      url: "https://your-portfolio.com",
      icon: <FaGlobe />,
    },
    {
      name: "Twitter",
      url: "https://twitter.com/am_kiarie",
      icon: <FaTwitter />,
    },
  ];

  return (
    <>
      <footer
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #111827 0%, #1e293b 100%)",
          color: "#fff",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "45px 25px 20px",
            boxSizing: "border-box",
          }}
        >
          {/* Main Footer */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "35px",
              paddingBottom: "35px",
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #3154d8, #5b7cff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "18px",
                    boxShadow: "0 8px 20px rgba(49,84,216,0.3)",
                  }}
                >
                  <FaBriefcase />
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    fontWeight: "800",
                    letterSpacing: "-0.4px",
                  }}
                >
                  JobzConnect
                </h2>
              </div>

              <p
                style={{
                  margin: 0,
                  maxWidth: "430px",
                  color: "#cbd5e1",
                  fontSize: "14px",
                  lineHeight: "1.8",
                }}
              >
                Connecting talented job seekers with meaningful opportunities
                and helping employers find the right people for their teams.
              </p>
            </div>

            {/* About */}
            <div>
              <h3
                style={{
                  margin: "0 0 15px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                About JobzConnect
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  fontSize: "14px",
                  lineHeight: "1.8",
                }}
              >
                JobzConnect is a platform designed to connect talented
                professionals with employers and meaningful career
                opportunities.
              </p>
            </div>

            {/* Connect */}
            <div>
              <h3
                style={{
                  margin: "0 0 15px",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#fff",
                }}
              >
                Connect With Me
              </h3>

              <p
                style={{
                  margin: "0 0 15px",
                  color: "#94a3b8",
                  fontSize: "13px",
                  lineHeight: "1.6",
                }}
              >
                Follow the project and connect with the developer.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#e2e8f0",
                      fontSize: "17px",
                      textDecoration: "none",
                      transition: "transform 0.2s ease, background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.background = "rgba(49,84,216,0.8)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)";
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background: "rgba(255,255,255,0.09)",
            }}
          />

          {/* Bottom Footer */}
          <div
            style={{
              paddingTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                fontSize: "13px",
              }}
            >
              © {currentYear} JobzConnect. All rights reserved.
            </p>

            <p
              style={{
                margin: 0,
                color: "#94a3b8",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              Built with
              <FaHeart
                style={{
                  color: "#ef4444",
                  fontSize: "11px",
                }}
              />
              for the job community
            </p>
          </div>
        </div>

        {/* Responsive styling */}
        <style>
          {`
            @media (max-width: 600px) {
              footer > div {
                padding-left: 18px !important;
                padding-right: 18px !important;
              }
            }

            footer a:hover {
              color: #ffffff !important;
            }
          `}
        </style>
      </footer>
    </>
  );
};

export default Footer;
