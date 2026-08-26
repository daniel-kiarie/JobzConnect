import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1"
).replace(/\/api\/v1\/?$/, "");

/* =========================================================
   RESUME MODAL
========================================================= */

const ResumeViewer = ({ resume, onClose }) => {
  if (!resume) return null;

  const resumeUrl = resume.url || "";
  const fileName = resume.public_id || resume.filename || "Resume";
  const extension =
    resumeUrl.split("?")[0].split(".").pop()?.toLowerCase() || "";

  const isPdf =
    extension === "pdf" ||
    resume.resource_type === "raw" ||
    resume.format === "pdf";
  const isImage = ["jpg", "jpeg", "png", "webp"].includes(extension);
  const isWord = ["doc", "docx"].includes(extension);

  const getFileType = () => {
    if (isPdf) return "PDF Document";
    if (isImage) return "Image Resume";
    if (isWord) return "Word Document";
    return "Resume";
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumeUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15,23,42,0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        backdropFilter: "blur(5px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: isPdf || isImage ? "1000px" : "550px",
          height: isPdf || isImage ? "90vh" : "auto",
          background: "#fff",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 70px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div>
            <h3 style={{ margin: 0, color: "#111827", fontSize: "18px" }}>
              Resume Viewer
            </h3>
            <span style={{ color: "#6b7280", fontSize: "13px" }}>
              {getFileType()}
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              border: "none",
              background: "#f3f4f6",
              color: "#374151",
              fontSize: "20px",
              cursor: "pointer",
            }}
            aria-label="Close resume viewer"
          >
            ×
          </button>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            background: "#f3f4f6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          {isPdf && (
            <iframe
              src={resumeUrl}
              title="Resume PDF"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "#fff",
              }}
            />
          )}
          {isImage && (
            <img
              src={resumeUrl}
              alt="Applicant resume"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          )}
          {isWord && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                maxWidth: "450px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  margin: "0 auto 20px",
                  borderRadius: "18px",
                  background: "#e8f0ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                }}
              >
                📄
              </div>
              <h3 style={{ margin: "0 0 10px", color: "#111827" }}>
                Word Resume
              </h3>
              <p
                style={{
                  margin: "0 0 25px",
                  color: "#6b7280",
                  lineHeight: 1.6,
                }}
              >
                Word documents cannot be rendered reliably in every browser.
                Open or download to read.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "11px 18px",
                    borderRadius: "8px",
                    background: "#2563eb",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Open Resume
                </a>
                <button
                  onClick={handleDownload}
                  style={{
                    padding: "11px 18px",
                    borderRadius: "8px",
                    background: "#111827",
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Download
                </button>
              </div>
            </div>
          )}
          {!isPdf && !isImage && !isWord && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h3 style={{ color: "#111827" }}>Resume File</h3>
              <p style={{ color: "#6b7280" }}>
                This file cannot be previewed directly.
              </p>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "11px 18px",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Open Resume
              </a>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#fff",
              color: "#374151",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INFO ROW
========================================================= */

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
    <span
      style={{
        fontSize: "12px",
        fontWeight: 700,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.4px",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: "15px",
        color: "#1f2937",
        lineHeight: 1.5,
        wordBreak: "break-word",
      }}
    >
      {value || "Not provided"}
    </span>
  </div>
);

/* =========================================================
   RESUME CARD
========================================================= */

const ResumeCard = ({ resume, openResume }) => {
  if (!resume?.url) {
    return (
      <div
        style={{
          padding: "18px",
          borderRadius: "10px",
          background: "#f9fafb",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        No resume uploaded.
      </div>
    );
  }

  const url = resume.url;
  const extension = url.split("?")[0].split(".").pop()?.toLowerCase() || "";
  const isPdf = extension === "pdf" || resume.format === "pdf";
  const isImage = ["jpg", "jpeg", "png", "webp"].includes(extension);
  let type = "Document";
  if (isPdf) type = "PDF";
  if (isImage) type = "Image";
  if (extension === "doc" || extension === "docx") type = "Word Document";

  return (
    <div
      style={{
        marginTop: "22px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <div>
          <h4 style={{ margin: "0 0 3px", color: "#111827", fontSize: "15px" }}>
            Resume / CV
          </h4>
          <span style={{ fontSize: "12px", color: "#6b7280" }}>{type}</span>
        </div>
        <button
          onClick={() => openResume(resume)}
          style={{
            border: "none",
            borderRadius: "8px",
            padding: "9px 14px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          View Resume
        </button>
      </div>
      <div
        style={{
          padding: "20px",
          minHeight: "130px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
        }}
      >
        {isImage ? (
          <img
            src={url}
            alt="Resume preview"
            onClick={() => openResume(resume)}
            style={{
              maxWidth: "220px",
              maxHeight: "250px",
              objectFit: "contain",
              borderRadius: "6px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
              cursor: "pointer",
              background: "#fff",
            }}
          />
        ) : (
          <div
            onClick={() => openResume(resume)}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "16px",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: "34px", marginBottom: "5px" }}>
              {isPdf ? "📕" : "📄"}
            </span>
            <span
              style={{ color: "#374151", fontWeight: 700, fontSize: "11px" }}
            >
              {type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   JOB SEEKER CARD
========================================================= */

const JobSeekerCard = ({ element, deleteApplication, openResume }) => {
  const jobTitle = element.jobId?.title;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        marginBottom: "24px",
        overflow: "hidden",
        boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          padding: "20px 22px",
          background: "linear-gradient(135deg, #f8faff, #eef3ff)",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 4px", color: "#111827", fontSize: "21px" }}>
            {element.name}
          </h2>
          {/* Show the job title the seeker applied for */}
          {jobTitle && (
            <span
              style={{ fontSize: "13px", color: "#2563eb", fontWeight: 600 }}
            >
              Applied for: {jobTitle}
            </span>
          )}
        </div>
        <span
          style={{
            padding: "7px 12px",
            borderRadius: "30px",
            background: "#dcfce7",
            color: "#15803d",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          Submitted
        </span>
      </div>

      <div style={{ padding: "22px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <InfoRow label="Full Name" value={element.name} />
          <InfoRow label="Email" value={element.email} />
          <InfoRow label="Phone" value={element.phone} />
          <InfoRow label="Address" value={element.address} />
        </div>

        <div style={{ marginTop: "25px" }}>
          <h4
            style={{ margin: "0 0 10px", color: "#111827", fontSize: "15px" }}
          >
            Cover Letter
          </h4>
          <div
            style={{
              padding: "16px",
              background: "#f9fafb",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              color: "#374151",
              fontSize: "14px",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {element.coverLetter || "No cover letter provided."}
          </div>
        </div>

        <ResumeCard resume={element.resume} openResume={openResume} />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => deleteApplication(element._id)}
            style={{
              padding: "10px 16px",
              border: "none",
              borderRadius: "8px",
              background: "#fee2e2",
              color: "#b91c1c",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Delete Application
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   EMPLOYER CARD
========================================================= */

const EmployerCard = ({ element, openResume }) => {
  const jobTitle = element.jobId?.title;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        marginBottom: "24px",
        overflow: "hidden",
        boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          padding: "20px 22px",
          background: "linear-gradient(135deg, #f8faff, #eef3ff)",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 4px", color: "#111827", fontSize: "21px" }}>
            {element.name}
          </h2>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>Applicant</span>
        </div>
        {/* Show job title instead of generic "New Application" */}
        <span
          style={{
            padding: "7px 12px",
            borderRadius: "30px",
            background: "#eff6ff",
            color: "#1d4ed8",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          {jobTitle ? `Applied for: ${jobTitle}` : "New Application"}
        </span>
      </div>

      <div style={{ padding: "22px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <InfoRow label="Full Name" value={element.name} />
          <InfoRow label="Email" value={element.email} />
          <InfoRow label="Phone" value={element.phone} />
          <InfoRow label="Address" value={element.address} />
        </div>

        <div style={{ marginTop: "25px" }}>
          <h4
            style={{ margin: "0 0 10px", color: "#111827", fontSize: "15px" }}
          >
            Cover Letter
          </h4>
          <div
            style={{
              padding: "16px",
              background: "#f9fafb",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              color: "#374151",
              fontSize: "14px",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}
          >
            {element.coverLetter || "No cover letter provided."}
          </div>
        </div>

        <ResumeCard resume={element.resume} openResume={openResume} />
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!isAuthorized || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const endpoint =
          user.role === "Employer"
            ? "/api/v1/application/employer/getall"
            : "/api/v1/application/jobseeker/getall";

        const { data } = await axios.get(`${API_URL}${endpoint}`, {
          withCredentials: true,
        });
        setApplications(data?.applications || []);
      } catch (error) {
        console.error("Fetching applications failed:", error);
        toast.error(
          error.response?.data?.message || "Unable to load applications.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [isAuthorized, user]);

  const deleteApplication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );
    if (!confirmed) return;
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/v1/application/delete/${id}`,
        { withCredentials: true },
      );
      toast.success(data?.message || "Application deleted successfully.");
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete application.",
      );
    }
  };

  const openResume = (resume) => {
    if (!resume?.url) {
      toast.error("Resume is not available.");
      return;
    }
    setSelectedResume(resume);
  };

  if (!isAuthorized) return <Navigate to="/login" replace />;

  if (loading) {
    return (
      <section
        style={{
          minHeight: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f5f7fb",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              margin: "0 auto 15px",
              border: "4px solid #e5e7eb",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "appSpin 0.8s linear infinite",
            }}
          />
          <p style={{ margin: 0, color: "#6b7280" }}>Loading applications...</p>
        </div>
      </section>
    );
  }

  const isEmployer = user?.role === "Employer";

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "45px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ width: "100%", maxWidth: "1050px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px" }}>
          <span
            style={{
              display: "inline-block",
              marginBottom: "10px",
              padding: "6px 12px",
              borderRadius: "30px",
              background: "#e8efff",
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {isEmployer ? "Recruitment Dashboard" : "Application Dashboard"}
          </span>
          <h1
            style={{
              margin: "0 0 8px",
              color: "#111827",
              fontSize: "32px",
              lineHeight: 1.2,
            }}
          >
            {isEmployer ? "Applications From Job Seekers" : "My Applications"}
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "15px" }}>
            {isEmployer
              ? "Review applicant information, cover letters, and resumes."
              : "View and manage all the job applications you have submitted."}
          </p>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "22px",
            padding: "10px 14px",
            borderRadius: "10px",
            background: "#fff",
            border: "1px solid #e5e7eb",
            color: "#374151",
            fontSize: "14px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.03)",
          }}
        >
          <strong>{applications.length}</strong>
          {applications.length === 1 ? "Application" : "Applications"}
        </div>

        {applications.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "60px 25px",
              textAlign: "center",
              boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                margin: "0 auto 18px",
                borderRadius: "50%",
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
              }}
            >
              📭
            </div>
            <h3 style={{ margin: "0 0 8px", color: "#111827" }}>
              No Applications Found
            </h3>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              {isEmployer
                ? "There are currently no applications from job seekers."
                : "You have not submitted any job applications yet."}
            </p>
          </div>
        ) : (
          applications.map((element) =>
            isEmployer ? (
              <EmployerCard
                key={element._id}
                element={element}
                openResume={openResume}
              />
            ) : (
              <JobSeekerCard
                key={element._id}
                element={element}
                deleteApplication={deleteApplication}
                openResume={openResume}
              />
            ),
          )
        )}
      </div>

      {selectedResume && (
        <ResumeViewer
          resume={selectedResume}
          onClose={() => setSelectedResume(null)}
        />
      )}

      <style>{`@keyframes appSpin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
};

export default MyApplications;
