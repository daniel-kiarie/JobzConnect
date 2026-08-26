import React, { useContext, useState } from "react";
import {
  FaRegUser,
  FaPencil,
  FaBriefcase,
  FaRocket,
  FaShieldHalved,
  FaUserPlus,
} from "react-icons/fa6";
import {
  MdOutlineMailOutline,
  MdLockOutline,
  MdOutlinePhone,
} from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  /* =========================================
     PASSWORD REQUIREMENTS
  ========================================= */

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const isStrongPassword =
    passwordRequirements.length &&
    passwordRequirements.uppercase &&
    passwordRequirements.number;

  /* =========================================
     REGISTER
  ========================================= */

  const handleRegister = async (e) => {
    e.preventDefault();

    if (loading) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    /* Required fields */
    if (!role || !trimmedName || !trimmedEmail || !trimmedPhone || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    /* Email validation */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    /* Kenyan phone validation */
    const phoneRegex = /^\+254\s?7\d{2}\s?\d{3}\s?\d{3}$/;

    if (!phoneRegex.test(trimmedPhone)) {
      toast.error("Enter a valid Kenyan phone number, e.g. +254 712 345 678");
      return;
    }

    /* Password validation */
    if (!passwordRequirements.length) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    if (!passwordRequirements.uppercase) {
      toast.error("Password must contain at least one uppercase letter.");
      return;
    }

    if (!passwordRequirements.number) {
      toast.error("Password must contain at least one number.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/user/register`,
        {
          name: trimmedName,
          phone: trimmedPhone,
          email: trimmedEmail,
          role,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      toast.success(data?.message || "Account registered successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");
      setShowPassword(false);

      setIsAuthorized(true);
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please check your information.",
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     REDIRECT IF ALREADY AUTHORIZED
  ========================================= */

  if (isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .auth-wrapper {
            min-height: 100vh;
            background-color: #0f172a;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2.5rem 1rem;
            font-family:
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              Roboto,
              sans-serif;
          }

          .auth-card {
            display: grid;
            grid-template-columns: 1fr 1.1fr;
            width: 100%;
            max-width: 1050px;
            background-color: #1e293b;
            border: 1px solid #334155;
            border-radius: 20px;
            overflow: hidden;
            box-shadow:
              0 20px 40px rgba(0, 0, 0, 0.4);
          }

          /* ===================================
             LEFT PANEL
          =================================== */

          .welcome-panel {
            background:
              linear-gradient(
                135deg,
                #1e293b 0%,
                #0f172a 100%
              );
            border-right: 1px solid #334155;
            padding: 3rem 2.5rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .brand-header {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 2rem;
          }

          .brand-logo-icon {
            width: 42px;
            height: 42px;
            background-color: #3b82f6;
            color: #ffffff;
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

          .welcome-content {
            margin-bottom: auto;
          }

          .welcome-title {
            font-size: 2rem;
            font-weight: 800;
            line-height: 1.25;
            color: #ffffff;
            margin-bottom: 1rem;
          }

          .highlight-text {
            color: #60a5fa;
          }

          .welcome-description {
            color: #94a3b8;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .perks-list {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }

          .perk-item {
            display: flex;
            align-items: flex-start;
            gap: 0.85rem;
          }

          .perk-icon {
            background-color:
              rgba(59, 130, 246, 0.15);
            color: #60a5fa;
            padding: 0.5rem;
            border-radius: 8px;
            font-size: 1rem;
            margin-top: 2px;
            flex-shrink: 0;
          }

          .perk-title {
            font-size: 0.9rem;
            font-weight: 600;
            color: #e2e8f0;
          }

          .perk-sub {
            font-size: 0.8rem;
            color: #64748b;
            line-height: 1.5;
          }

          .welcome-footer {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top:
              1px solid rgba(51, 65, 85, 0.5);
            font-size: 0.8rem;
            color: #64748b;
          }

          /* ===================================
             RIGHT FORM PANEL
          =================================== */

          .form-panel {
            padding: 3rem 2.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .form-header {
            margin-bottom: 1.75rem;
          }

          .form-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #f8fafc;
            margin-bottom: 0.35rem;
          }

          .form-subtitle {
            font-size: 0.875rem;
            color: #94a3b8;
          }

          .auth-form {
            display: flex;
            flex-direction: column;
            gap: 1.1rem;
          }

          .field-group {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
          }

          .field-label {
            font-size: 0.775rem;
            font-weight: 600;
            color: #cbd5e1;
            text-transform: uppercase;
            letter-spacing: 0.03em;
          }

          .input-box {
            position: relative;
            display: flex;
            align-items: center;
          }

          .input-box .field-icon {
            position: absolute;
            left: 0.9rem;
            color: #64748b;
            font-size: 1.1rem;
            pointer-events: none;
            transition: color 0.2s ease;
            z-index: 2;
          }

          .form-control {
            width: 100%;
            min-height: 48px;
            background-color: #0f172a;
            border: 1px solid #334155;
            border-radius: 10px;
            padding:
              0.7rem
              2.7rem
              0.7rem
              2.6rem;
            color: #f8fafc;
            font-size: 0.9rem;
            box-sizing: border-box;
            transition:
              border-color 0.2s ease,
              box-shadow 0.2s ease;
          }

          .form-control::placeholder {
            color: #64748b;
            opacity: 1;
          }

          .form-control:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow:
              0 0 0 3px
              rgba(59, 130, 246, 0.15);
          }

          .form-control:focus
          ~ .field-icon {
            color: #3b82f6;
          }

          /* ===================================
             SELECT
          =================================== */

          .form-select {
            appearance: none;
            cursor: pointer;
          }

          .form-select option {
            background: #0f172a;
            color: #f8fafc;
          }

          /* ===================================
             PASSWORD
          =================================== */

          .password-box {
            position: relative;
          }

          .password-box .form-control {
            padding-right: 3.2rem;
          }

          .eye-toggle {
            position: absolute;
            right: 0.85rem;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            background: transparent;
            border: none;
            color: #64748b;
            font-size: 1.15rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            border-radius: 6px;
            transition:
              color 0.2s ease,
              background 0.2s ease;
          }

          .eye-toggle:hover {
            color: #f8fafc;
            background:
              rgba(255, 255, 255, 0.05);
          }

          .password-hint {
            margin-top: 0.4rem;
            padding: 0.7rem 0.8rem;
            background-color: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
          }

          .password-hint-title {
            margin: 0 0 0.4rem;
            color: #cbd5e1;
            font-size: 0.7rem;
            font-weight: 600;
          }

          .password-requirement {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.7rem;
            margin-bottom: 0.2rem;
          }

          .password-requirement:last-child {
            margin-bottom: 0;
          }

          .requirement-valid {
            color: #4ade80;
          }

          .requirement-invalid {
            color: #64748b;
          }

          .requirement-icon {
            width: 12px;
            text-align: center;
          }

          /* ===================================
             PHONE HELP
          =================================== */

          .field-help {
            margin: 0.05rem 0 0;
            color: #64748b;
            font-size: 0.7rem;
          }

          /* ===================================
             SUBMIT
          =================================== */

          .btn-submit {
            min-height: 48px;
            background-color: #3b82f6;
            color: #ffffff;
            border: none;
            border-radius: 10px;
            padding: 0.85rem;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            margin-top: 0.35rem;
            transition:
              background-color 0.2s ease,
              transform 0.1s ease,
              opacity 0.2s ease;
          }

          .btn-submit:hover:not(:disabled) {
            background-color: #2563eb;
            transform: translateY(-1px);
          }

          .btn-submit:active:not(:disabled) {
            transform: translateY(0);
          }

          .btn-submit:disabled {
            opacity: 0.65;
            cursor: not-allowed;
          }

          /* ===================================
             LOGIN SWITCH
          =================================== */

          .auth-switch {
            text-align: center;
            margin-top: 1rem;
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

          .auth-switch a:hover {
            color: #93c5fd;
            text-decoration: underline;
          }

          /* ===================================
             AUTOFILL FIX
          =================================== */

          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow:
              0 0 0 1000px #0f172a inset !important;
            -webkit-text-fill-color: #f8fafc !important;
            caret-color: #f8fafc;
            transition:
              background-color 9999s ease-in-out 0s;
          }

          /* ===================================
             MOBILE
          =================================== */

          @media (max-width: 900px) {
            .auth-card {
              grid-template-columns: 1fr;
              max-width: 520px;
            }

            .welcome-panel {
              padding: 2rem 1.75rem;
              border-right: none;
              border-bottom: 1px solid #334155;
            }

            .welcome-title {
              font-size: 1.5rem;
            }

            .perks-list {
              display: none;
            }

            .welcome-description {
              margin-bottom: 0;
            }

            .welcome-footer {
              display: none;
            }

            .form-panel {
              padding: 2rem 1.75rem;
            }
          }

          @media (max-width: 480px) {
            .auth-wrapper {
              padding: 1rem;
            }

            .welcome-panel,
            .form-panel {
              padding: 1.5rem;
            }

            .form-title {
              font-size: 1.35rem;
            }

            .auth-card {
              border-radius: 14px;
            }
          }
        `}
      </style>

      <section className="auth-wrapper">
        <div className="auth-card">
          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <div className="welcome-panel">
            <div>
              {/* Brand */}
              <div className="brand-header">
                <div className="brand-logo-icon">
                  <FaBriefcase />
                </div>

                <span className="brand-name">JobzConnect</span>
              </div>

              {/* Welcome Content */}
              <div className="welcome-content">
                <h1 className="welcome-title">
                  Start your journey on{" "}
                  <span className="highlight-text">JobzConnect</span>
                </h1>

                <p className="welcome-description">
                  Create a free profile to discover personalized tech roles or
                  source verified candidates for your engineering teams.
                </p>

                {/* Benefits */}
                <div className="perks-list">
                  <div className="perk-item">
                    <div className="perk-icon">
                      <FaUserPlus />
                    </div>

                    <div>
                      <div className="perk-title">Tailored Account Setup</div>

                      <div className="perk-sub">
                        Dedicated portals for Employers and Job Seekers
                      </div>
                    </div>
                  </div>

                  <div className="perk-item">
                    <div className="perk-icon">
                      <FaRocket />
                    </div>

                    <div>
                      <div className="perk-title">Direct Networking</div>

                      <div className="perk-sub">
                        Seamless job postings and application tracking
                      </div>
                    </div>
                  </div>

                  <div className="perk-item">
                    <div className="perk-icon">
                      <FaShieldHalved />
                    </div>

                    <div>
                      <div className="perk-title">Secure & Confidential</div>

                      <div className="perk-sub">
                        Protected user credentials and contact privacy
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

          {/* =====================================
              RIGHT SIDE
          ===================================== */}

          <div className="form-panel">
            <div className="form-header">
              <h2 className="form-title">Create Account</h2>

              <p className="form-subtitle">
                Fill in your details to set up your profile
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="auth-form"
              autoComplete="on"
            >
              {/* Account Type */}
              <div className="field-group">
                <label className="field-label" htmlFor="register-role">
                  Register As
                </label>

                <div className="input-box">
                  <select
                    id="register-role"
                    name="role"
                    className="form-control form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    autoComplete="organization-title"
                    required
                  >
                    <option value="">Select Account Type</option>

                    <option value="Job Seeker">Job Seeker</option>

                    <option value="Employer">Employer</option>
                  </select>

                  <FaRegUser className="field-icon" />
                </div>
              </div>

              {/* Full Name */}
              <div className="field-group">
                <label className="field-label" htmlFor="register-name">
                  Full Name
                </label>

                <div className="input-box">
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                  />

                  <FaPencil className="field-icon" />
                </div>
              </div>

              {/* Email */}
              <div className="field-group">
                <label className="field-label" htmlFor="register-email">
                  Email Address
                </label>

                <div className="input-box">
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    inputMode="email"
                    spellCheck="false"
                    required
                  />

                  <MdOutlineMailOutline className="field-icon" />
                </div>
              </div>

              {/* Phone */}
              <div className="field-group">
                <label className="field-label" htmlFor="register-phone">
                  Phone Number
                </label>

                <div className="input-box">
                  <input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    placeholder="+254 712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    inputMode="tel"
                    required
                  />

                  <MdOutlinePhone className="field-icon" />
                </div>

                <p className="field-help">Example: +254 712 345 678</p>
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label" htmlFor="register-password">
                  Password
                </label>

                <div className="input-box password-box">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Create a secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />

                  <MdLockOutline className="field-icon" />

                  <button
                    type="button"
                    className="eye-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="password-hint">
                  <p className="password-hint-title">Password requirements</p>

                  <div
                    className={`password-requirement ${
                      passwordRequirements.length
                        ? "requirement-valid"
                        : "requirement-invalid"
                    }`}
                  >
                    <span className="requirement-icon">
                      {passwordRequirements.length ? "✓" : "•"}
                    </span>
                    At least 8 characters
                  </div>

                  <div
                    className={`password-requirement ${
                      passwordRequirements.uppercase
                        ? "requirement-valid"
                        : "requirement-invalid"
                    }`}
                  >
                    <span className="requirement-icon">
                      {passwordRequirements.uppercase ? "✓" : "•"}
                    </span>
                    One uppercase letter
                  </div>

                  <div
                    className={`password-requirement ${
                      passwordRequirements.number
                        ? "requirement-valid"
                        : "requirement-invalid"
                    }`}
                  >
                    <span className="requirement-icon">
                      {passwordRequirements.number ? "✓" : "•"}
                    </span>
                    One number
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Login */}
              <div className="auth-switch">
                Already have an account?
                <Link to="/login">Login Now</Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
