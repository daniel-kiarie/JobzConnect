import React, { useContext, useState } from "react";
import { MdOutlineMailOutline, MdLockOutline } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaRegUser, FaBriefcase, FaUserCheck, FaRocket } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role || !email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Login
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/user/login`,
        { email, password, role },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      toast.success(data.message || "Login successful!");

      // Step 2: Immediately fetch user so navbar gets role without needing a refresh
      const userRes = await axios.get(`${API_BASE_URL}/api/v1/user/getuser`, {
        withCredentials: true,
      });
      setUser(userRes.data.user);
      setIsAuthorized(true);

      setEmail("");
      setPassword("");
      setRole("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorized) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <style>{`
        .auth-wrapper {
          min-height: 100vh;
          background-color: #0f172a;
          color: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .auth-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          max-width: 1000px;
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .welcome-panel {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-right: 1px solid #334155;
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .brand-logo-fallback {
          background-color: #3b82f6;
          color: #ffffff;
          padding: 0.5rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .brand-name {
          font-size: 1.35rem;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.02em;
        }

        .welcome-content { margin-bottom: auto; }

        .welcome-title {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.25;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .highlight-text { color: #60a5fa; }

        .welcome-description {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .perks-list { display: flex; flex-direction: column; gap: 1.25rem; }

        .perk-item { display: flex; align-items: flex-start; gap: 0.85rem; }

        .perk-icon {
          background-color: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          padding: 0.5rem;
          border-radius: 8px;
          font-size: 1rem;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .perk-title { font-size: 0.9rem; font-weight: 600; color: #e2e8f0; }
        .perk-sub { font-size: 0.8rem; color: #64748b; }

        .welcome-footer {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(51, 65, 85, 0.5);
          font-size: 0.8rem;
          color: #64748b;
        }

        .form-panel {
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .form-header { margin-bottom: 2rem; }

        .form-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 0.35rem;
        }

        .form-subtitle { font-size: 0.875rem; color: #94a3b8; }

        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }

        .field-group { display: flex; flex-direction: column; gap: 0.4rem; }

        .field-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #cbd5e1;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .input-box { position: relative; display: flex; align-items: center; }

        .input-box .field-icon {
          position: absolute;
          left: 0.9rem;
          color: #64748b;
          font-size: 1.1rem;
          pointer-events: none;
          transition: color 0.2s ease;
        }

        .form-control {
          width: 100%;
          background-color: #0f172a;
          border: 1px solid #334155;
          border-radius: 10px;
          padding: 0.75rem 2.6rem 0.75rem 2.6rem;
          color: #f8fafc;
          font-size: 0.925rem;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .form-control::placeholder { color: #475569; }

        .form-control:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }

        .form-select { appearance: none; cursor: pointer; }

        .eye-toggle {
          position: absolute;
          right: 0.9rem;
          background: none;
          border: none;
          color: #64748b;
          font-size: 1.15rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: color 0.2s ease;
        }

        .eye-toggle:hover { color: #f8fafc; }

        .btn-submit {
          background-color: #3b82f6;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          padding: 0.85rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }

        .btn-submit:hover:not(:disabled) {
          background-color: #2563eb;
          transform: translateY(-1px);
        }

        .btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .auth-switch {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .auth-switch a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          margin-left: 0.35rem;
          transition: color 0.2s ease;
        }

        .auth-switch a:hover { color: #93c5fd; text-decoration: underline; }

        @media (max-width: 900px) {
          .auth-card { grid-template-columns: 1fr; max-width: 480px; }
          .welcome-panel {
            padding: 2rem 1.75rem;
            border-right: none;
            border-bottom: 1px solid #334155;
          }
          .welcome-title { font-size: 1.5rem; }
          .perks-list { display: none; }
          .welcome-description { margin-bottom: 0; }
          .welcome-footer { display: none; }
          .form-panel { padding: 2rem 1.75rem; }
        }
      `}</style>

      <section className="auth-wrapper">
        <div className="auth-card">
          {/* Left: Welcome panel */}
          <div className="welcome-panel">
            <div>
              <div className="brand-header">
                <div className="brand-logo-fallback">
                  <FaBriefcase />
                </div>
                <span className="brand-name">JobzConnect</span>
              </div>
              <div className="welcome-content">
                <h1 className="welcome-title">
                  Welcome back to your{" "}
                  <span className="highlight-text">JobzConnect</span>
                </h1>
                <p className="welcome-description">
                  Whether you are seeking your next big tech opportunity or
                  managing top talent applications, sign in to pick up right
                  where you left off.
                </p>
                <div className="perks-list">
                  <div className="perk-item">
                    <div className="perk-icon">
                      <FaRocket />
                    </div>
                    <div>
                      <div className="perk-title">
                        Fast Application Pipeline
                      </div>
                      <div className="perk-sub">
                        Apply directly or track incoming talent live
                      </div>
                    </div>
                  </div>
                  <div className="perk-item">
                    <div className="perk-icon">
                      <FaUserCheck />
                    </div>
                    <div>
                      <div className="perk-title">Role-Based Dashboard</div>
                      <div className="perk-sub">
                        Customized workspaces for Seekers & Employers
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="welcome-footer">
              © {new Date().getFullYear()} JobzConnect. All rights reserved.
            </div>
          </div>

          {/* Right: Form */}
          <div className="form-panel">
            <div className="form-header">
              <h2 className="form-title">Account Login</h2>
              <p className="form-subtitle">
                Enter your credentials below to access your account
              </p>
            </div>

            {/* autoComplete="off" prevents browser autofill on the whole form */}
            <form
              onSubmit={handleLogin}
              className="auth-form"
              autoComplete="off"
            >
              {/* Role */}
              <div className="field-group">
                <label className="field-label">Login As</label>
                <div className="input-box">
                  <select
                    className="form-control form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    autoComplete="off"
                  >
                    <option value="">Select Account Type</option>
                    <option value="Job Seeker">Job Seeker</option>
                    <option value="Employer">Employer</option>
                  </select>
                  <FaRegUser className="field-icon" />
                </div>
              </div>

              {/* Email */}
              <div className="field-group">
                <label className="field-label">Email Address</label>
                <div className="input-box">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-email"
                  />
                  <MdOutlineMailOutline className="field-icon" />
                </div>
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="input-box">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  <MdLockOutline className="field-icon" />
                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Authenticating..." : "Sign In"}
              </button>

              <div className="auth-switch">
                Don't have an account?
                <Link to={"/register"}>Register Now</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
