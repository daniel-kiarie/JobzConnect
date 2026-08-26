import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API_URL = rawApiUrl.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
];

const ALLOWED_FILE_EXTENSIONS =
  ".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  coverLetter: "",
};

const Application = () => {
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();
  const { id: jobId } = useParams();

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(initialFormData);
  const [resume, setResume] = useState(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFile = (file) => {
    if (!file) {
      return "Please upload your resume.";
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Invalid file type. Please upload PDF, DOC, DOCX, PNG, JPG, JPEG, or WEBP.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 2MB.";
    }

    return "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    setFileError("");

    if (!file) {
      setResume(null);
      return;
    }

    const error = validateFile(file);

    if (error) {
      setResume(null);
      setFileError(error);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setResume(file);
  };

  const validateForm = () => {
    const { name, email, phone, address, coverLetter } = formData;

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return false;
    }

    if (!address.trim()) {
      toast.error("Please enter your address.");
      return false;
    }

    if (!coverLetter.trim()) {
      toast.error("Please write a cover letter.");
      return false;
    }

    if (coverLetter.trim().length < 30) {
      toast.error("Your cover letter must be at least 30 characters.");
      return false;
    }

    if (!resume) {
      setFileError("Please upload your resume.");
      toast.error("Please upload your resume.");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setResume(null);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplication = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!jobId) {
      toast.error("Invalid job. Please go back and select a job.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      form.append("name", formData.name.trim());
      form.append("email", formData.email.trim());
      form.append("phone", formData.phone.trim());
      form.append("address", formData.address.trim());
      form.append("coverLetter", formData.coverLetter.trim());
      form.append("resume", resume);
      form.append("jobId", jobId);

      const { data } = await axios.post(
        `${API_URL}/api/v1/application/post`,
        form,
        {
          withCredentials: true,
        }
      );

      toast.success(
        data?.message || "Application submitted successfully!"
      );

      resetForm();
      navigate("/job/getall");
    } catch (error) {
      console.error("Application submission error:", error);

      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(
          message || "Please check your application details."
        );
      } else if (status === 401 || status === 403) {
        toast.error(
          "You are not authorized to submit this application."
        );
      } else if (status === 413) {
        toast.error("The uploaded file is too large.");
      } else if (status >= 500) {
        toast.error("Server error. Please try again later.");
      } else if (
        message?.toLowerCase().includes("cloudinary") ||
        message?.toLowerCase().includes("api_key")
      ) {
        toast.error(
          "The file upload service is currently unavailable."
        );
      } else {
        toast.error(
          message || "Something went wrong. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized || user?.role === "Employer") {
    return <Navigate to="/login" replace />;
  }

  return (
    <section
      style={{
        minHeight: "100vh",
        padding: "50px 20px",
        background: "#f5f7fb",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "7px 14px",
              marginBottom: "14px",
              borderRadius: "30px",
              background: "#e9efff",
              color: "#3154d8",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Job Application
          </span>

          <h1
            style={{
              margin: "0 0 10px",
              color: "#1d2630",
              fontSize: "34px",
              fontWeight: "700",
            }}
          >
            Apply for this Position
          </h1>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            Complete the form below and submit your application.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleApplication}
          noValidate
          style={{
            background: "#ffffff",
            padding: "35px",
            borderRadius: "16px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* Full Name */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              autoComplete="name"
              disabled={loading}
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                boxSizing: "border-box",
                border: "1px solid #d9dee7",
                borderRadius: "8px",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              disabled={loading}
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                boxSizing: "border-box",
                border: "1px solid #d9dee7",
                borderRadius: "8px",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="phone"
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Phone Number
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+254 712 345 678"
              value={formData.phone}
              onChange={handleInputChange}
              autoComplete="tel"
              disabled={loading}
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                boxSizing: "border-box",
                border: "1px solid #d9dee7",
                borderRadius: "8px",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="address"
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Address
            </label>

            <input
              id="address"
              name="address"
              type="text"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleInputChange}
              autoComplete="street-address"
              disabled={loading}
              required
              style={{
                width: "100%",
                height: "48px",
                padding: "0 14px",
                boxSizing: "border-box",
                border: "1px solid #d9dee7",
                borderRadius: "8px",
                outline: "none",
                fontSize: "15px",
              }}
            />
          </div>

          {/* Cover Letter */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="coverLetter"
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Cover Letter
            </label>

            <textarea
              id="coverLetter"
              name="coverLetter"
              placeholder="Explain why you are a good fit for this position..."
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows="8"
              minLength="30"
              disabled={loading}
              required
              style={{
                width: "100%",
                minHeight: "170px",
                padding: "14px",
                boxSizing: "border-box",
                border: "1px solid #d9dee7",
                borderRadius: "8px",
                outline: "none",
                resize: "vertical",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            />

            <small
              style={{
                display: "block",
                marginTop: "6px",
                color: "#777",
                fontSize: "12px",
              }}
            >
              Minimum 30 characters.
            </small>
          </div>

          {/* Resume */}
          <div style={{ marginBottom: "25px" }}>
            <label
              htmlFor="resume"
              style={{
                display: "block",
                marginBottom: "7px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#222",
              }}
            >
              Resume / CV
            </label>

            <input
              ref={fileInputRef}
              id="resume"
              name="resume"
              type="file"
              accept={ALLOWED_FILE_EXTENSIONS}
              onChange={handleFileChange}
              disabled={loading}
              required
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
                background: "#f9fafc",
                border: "1px solid #d9dee7",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            />

            <small
              style={{
                display: "block",
                marginTop: "7px",
                color: "#777",
                fontSize: "12px",
                lineHeight: "1.5",
              }}
            >
              Accepted: PDF, DOC, DOCX, PNG, JPG, JPEG, WEBP.
              Maximum size: 2MB.
            </small>

            {resume && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "15px",
                  marginTop: "10px",
                  padding: "12px 14px",
                  background: "#f4f7ff",
                  border: "1px solid #dfe6ff",
                  borderRadius: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    color: "#25314c",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resume.name}
                </span>

                <span
                  style={{
                    fontSize: "12px",
                    color: "#6d7787",
                    flexShrink: 0,
                  }}
                >
                  {(resume.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>
            )}

            {fileError && (
              <p
                role="alert"
                style={{
                  margin: "8px 0 0",
                  color: "#dc3545",
                  fontSize: "13px",
                }}
              >
                {fileError}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "50px",
              border: "none",
              borderRadius: "8px",
              background: loading ? "#7180b8" : "#3154d8",
              color: "#fff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.2s ease",
            }}
          >
            {loading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "applicationSpin 0.7s linear infinite",
                  }}
                />
                Submitting...
              </span>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>
      </div>

      {/* Spinner animation */}
      <style>
        {`
          @keyframes applicationSpin {
            to {
              transform: rotate(360deg);
            }
          }

          input:focus,
          textarea:focus {
            border-color: #3154d8 !important;
            box-shadow: 0 0 0 3px rgba(49, 84, 216, 0.1);
          }

          @media (max-width: 600px) {
            .application-form-wrapper {
              padding: 20px !important;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Application;