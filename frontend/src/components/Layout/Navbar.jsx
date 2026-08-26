import React, { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../../main";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1").replace(/\/api\/v1\/?$/, "");

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isAuthorized, setIsAuthorized, user, setUser, loading } =
    useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    setShow(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message || "Logged out successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    } finally {
      setUser({});
      setIsAuthorized(false);
      setShow(false);
      setProfileOpen(false);
      navigateTo("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  // Wait until fetchUser has finished before showing or hiding navbar
  if (loading) return null;

  // After loading, only show navbar if logged in
  if (!isAuthorized) return null;

  // Debug: remove this console.log once confirmed working
  console.log("NAVBAR user object:", user);
  console.log("NAVBAR user.role:", user?.role);

  const isEmployer = user?.role === "Employer";

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/job/getall", label: "All Jobs" },
    {
      to: "/applications/me",
      label: isEmployer ? "Received Applications" : "My Applications",
    },
    ...(isEmployer
      ? [
          { to: "/job/post", label: "Post Job" },
          { to: "/job/me", label: "Manage Jobs" },
        ]
      : []),
  ];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .cc-navbar {
          position: sticky;
          top: 0;
          width: 100%;
          z-index: 1000;
          background: #0f172a;
          border-bottom: 1px solid #1e293b;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .cc-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cc-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .cc-logo img { height: 38px; width: auto; object-fit: contain; }
        .cc-logo-text { font-size: 1.15rem; font-weight: 700; color: #f8fafc; }
        .cc-logo-text span { color: #3b82f6; }

        .cc-right {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .cc-nav-links {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .cc-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.45rem 0.8rem;
          border-radius: 6px;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .cc-link:hover { color: #f8fafc; background: #1e293b; }
        .cc-link.active { color: #3b82f6; font-weight: 600; background: rgba(59,130,246,0.12); }

        .cc-divider {
          width: 1px;
          height: 28px;
          background: #1e293b;
          margin: 0 0.6rem;
          flex-shrink: 0;
        }

        .cc-profile-wrap { position: relative; }

        .cc-profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #1e293b;
          border: 1px solid #334155;
          padding: 0.35rem 0.75rem 0.35rem 0.45rem;
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.18s ease;
          color: #e2e8f0;
        }
        .cc-profile-btn:hover { background: #334155; border-color: #475569; }

        .cc-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          text-transform: uppercase;
        }

        .cc-profile-info { display: flex; flex-direction: column; align-items: flex-start; }
        .cc-profile-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f1f5f9;
          max-width: 110px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cc-profile-role {
          font-size: 0.62rem;
          color: #60a5fa;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .cc-chevron { color: #64748b; transition: transform 0.2s ease; flex-shrink: 0; }
        .cc-chevron.open { transform: rotate(180deg); }

        .cc-profile-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 10px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.4);
          min-width: 180px;
          overflow: hidden;
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cc-dropdown-header { padding: 0.85rem 1rem 0.75rem; border-bottom: 1px solid #334155; }
        .cc-dropdown-name { font-size: 0.9rem; font-weight: 700; color: #f1f5f9; margin-bottom: 2px; }
        .cc-dropdown-role { font-size: 0.72rem; color: #60a5fa; font-weight: 500; text-transform: uppercase; }

        .cc-logout-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border: 1px solid rgba(248,113,113,0.35);
          padding: 0.42rem 0.85rem;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
          margin-left: 0.5rem;
        }
        .cc-logout-btn:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        .cc-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          background: #1e293b;
          border: 1px solid #334155;
          color: #f8fafc;
          padding: 0.45rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.18s ease;
          flex-shrink: 0;
        }
        .cc-hamburger:hover { background: #334155; }

        .cc-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 998;
          backdrop-filter: blur(2px);
        }
        .cc-overlay.show { display: block; }

        .cc-drawer {
          display: none;
          position: fixed;
          top: 64px;
          left: 0; right: 0; bottom: 0;
          background: #0f172a;
          z-index: 999;
          flex-direction: column;
          padding: 1.25rem 1.25rem 2rem;
          gap: 0.25rem;
          overflow-y: auto;
        }
        .cc-drawer.show { display: flex; }

        .cc-drawer-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          background: #1e293b;
          border-radius: 10px;
          margin-bottom: 0.5rem;
        }
        .cc-drawer-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: #3b82f6;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; font-weight: 700; color: #fff;
          text-transform: uppercase; flex-shrink: 0;
        }
        .cc-drawer-user-name { font-size: 0.95rem; font-weight: 700; color: #f1f5f9; }
        .cc-drawer-user-role { font-size: 0.75rem; color: #60a5fa; font-weight: 500; }

        .cc-drawer-divider { height: 1px; background: #1e293b; margin: 0.5rem 0; }

        .cc-drawer-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border-left: 3px solid transparent;
          transition: all 0.18s ease;
        }
        .cc-drawer-link:hover { color: #f8fafc; background: #1e293b; }
        .cc-drawer-link.active {
          color: #3b82f6; font-weight: 600;
          background: rgba(59,130,246,0.1);
          border-left-color: #3b82f6;
        }

        .cc-drawer-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.8rem;
          margin-top: auto;
          background: rgba(239,68,68,0.1);
          color: #f87171;
          border: 1px solid rgba(248,113,113,0.3);
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .cc-drawer-logout:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

        @media (max-width: 1024px) and (min-width: 769px) {
          .cc-link { padding: 0.45rem 0.5rem; font-size: 0.8rem; }
          .cc-profile-name { max-width: 75px; }
          .cc-logout-btn span { display: none; }
          .cc-logout-btn { padding: 0.42rem 0.6rem; margin-left: 0.35rem; }
        }

        @media (max-width: 768px) {
          .cc-right { display: none; }
          .cc-hamburger { display: flex; }
        }
      `}</style>

      <div
        className={`cc-overlay ${show ? "show" : ""}`}
        onClick={() => setShow(false)}
      />

      <nav className="cc-navbar">
        <div className="cc-container">
          <Link to="/" className="cc-logo" onClick={() => setShow(false)}>
            
            <span className="cc-logo-text">
              Jobz<span>Connect</span>
            </span>
          </Link>

          <div className="cc-right">
            <ul className="cc-nav-links">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`cc-link ${isActive(link.to) ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="cc-divider" />

            <div className="cc-profile-wrap" ref={profileRef}>
              <button
                className="cc-profile-btn"
                onClick={() => setProfileOpen((p) => !p)}
                aria-label="Profile menu"
              >
                <div className="cc-avatar">
                  {user?.name ? (
                    user.name.charAt(0)
                  ) : (
                    <FaUserCircle size={16} />
                  )}
                </div>
                <div className="cc-profile-info">
                  <span className="cc-profile-name">
                    {user?.name || "User"}
                  </span>
                  {user?.role && (
                    <span className="cc-profile-role">{user.role}</span>
                  )}
                </div>
                <FaChevronDown
                  size={11}
                  className={`cc-chevron ${profileOpen ? "open" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="cc-profile-dropdown">
                  <div className="cc-dropdown-header">
                    <div className="cc-dropdown-name">
                      {user?.name || "User"}
                    </div>
                    {user?.role && (
                      <div className="cc-dropdown-role">{user.role}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="cc-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt size={13} />
              <span>Logout</span>
            </button>
          </div>

          <button
            className="cc-hamburger"
            onClick={() => setShow(!show)}
            aria-label={show ? "Close menu" : "Open menu"}
          >
            {show ? <HiOutlineX size={22} /> : <HiOutlineMenuAlt3 size={22} />}
          </button>
        </div>
      </nav>

      <div className={`cc-drawer ${show ? "show" : ""}`}>
        {user && (
          <div className="cc-drawer-user">
            <div className="cc-drawer-avatar">
              {user.name ? user.name.charAt(0) : "U"}
            </div>
            <div>
              <div className="cc-drawer-user-name">{user.name || "User"}</div>
              {user.role && (
                <div className="cc-drawer-user-role">{user.role}</div>
              )}
            </div>
          </div>
        )}

        <div className="cc-drawer-divider" />

        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`cc-drawer-link ${isActive(link.to) ? "active" : ""}`}
            onClick={() => setShow(false)}
          >
            {link.label}
          </Link>
        ))}

        <div className="cc-drawer-divider" />

        <button className="cc-drawer-logout" onClick={handleLogout}>
          <FaSignOutAlt size={16} />
          Logout
        </button>
      </div>
    </>
  );
};

export default Navbar;
