import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineArrowLeft,
  HiOutlinePaperAirplane,
} from "react-icons/hi";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    let isMounted = true;

    axios
      .get(`${API_BASE_URL}/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (isMounted) {
          setJob(res.data.job);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Job details fetch error:", error);
        navigateTo("/notfound");
      });

    return () => {
      isMounted = false;
    };
  }, [id, navigateTo]);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  const formatSalary = () => {
    if (!job) return "Negotiable";
    if (job.fixedSalary) {
      return `$${Number(job.fixedSalary).toLocaleString()}`;
    }
    if (job.salaryFrom && job.salaryTo) {
      return `$${Number(job.salaryFrom).toLocaleString()} - $${Number(job.salaryTo).toLocaleString()}`;
    }
    return "Negotiable";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently posted";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  return (
    <>
      <style>{`
        .job-details-page {
          min-height: 100vh;
          background-color: #0f172a;
          color: #f8fafc;
          padding: 2.5rem 1.25rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .job-details-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: #3b82f6;
        }

        .details-card {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
        }

        .details-header {
          border-bottom: 1px solid #334155;
          padding-bottom: 1.5rem;
          margin-bottom: 1.75rem;
        }

        .category-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background-color: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.3rem 0.75rem;
          border-radius: 20px;
          margin-bottom: 0.85rem;
        }

        .job-main-title {
          font-size: 1.85rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 0.5rem 0;
          line-height: 1.25;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .info-box {
          background-color: #0f172a;
          border: 1px solid #334155;
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .info-icon {
          color: #3b82f6;
          font-size: 1.35rem;
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        .info-content {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 0.2rem;
        }

        .info-value {
          font-size: 0.95rem;
          color: #e2e8f0;
          font-weight: 500;
          word-break: break-word;
        }

        .salary-highlight {
          color: #10b981;
          font-weight: 600;
        }

        .description-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f8fafc;
          margin: 0 0 0.85rem 0;
        }

        .description-body {
          color: #cbd5e1;
          font-size: 0.95rem;
          line-height: 1.7;
          white-space: pre-line;
          background-color: rgba(15, 23, 42, 0.5);
          border: 1px solid #334155;
          padding: 1.25rem;
          border-radius: 10px;
        }

        .action-container {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid #334155;
          padding-top: 1.5rem;
        }

        .apply-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: #2563eb;
          color: #ffffff;
          padding: 0.75rem 1.75rem;
          border-radius: 10px;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: background-color 0.2s ease, transform 0.2s ease;
        }

        .apply-btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-2px);
        }

        .employer-note {
          font-size: 0.875rem;
          color: #64748b;
          font-style: italic;
        }

        .loading-state {
          text-align: center;
          padding: 5rem 1rem;
          color: #94a3b8;
          font-size: 1.1rem;
        }

        @media (max-width: 640px) {
          .details-card {
            padding: 1.25rem;
          }
          .job-main-title {
            font-size: 1.4rem;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
          .apply-btn {
            width: 100%;
          }
        }
      `}</style>

      <section className="job-details-page">
        <div className="job-details-container">
          <Link to="/job/getall" className="back-link">
            <HiOutlineArrowLeft size={16} /> Back to All Jobs
          </Link>

          {loading || !job ? (
            <div className="loading-state">Loading job details...</div>
          ) : (
            <div className="details-card">
              {/* Header Section */}
              <div className="details-header">
                <span className="category-chip">
                  <HiOutlineBriefcase size={14} />
                  {job.category || "General"}
                </span>
                <h1 className="job-main-title">{job.title}</h1>
              </div>

              {/* Grid Metadata */}
              <div className="info-grid">
                <div className="info-box">
                  <HiOutlineLocationMarker className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">Location</span>
                    <span className="info-value">
                      {job.city ? `${job.city}, ` : ""}
                      {job.country}
                    </span>
                    {job.location && (
                      <span
                        className="info-value"
                        style={{ fontSize: "0.8rem", color: "#94a3b8" }}
                      >
                        {job.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="info-box">
                  <HiOutlineCurrencyDollar className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">Salary</span>
                    <span className="info-value salary-highlight">
                      {formatSalary()}
                    </span>
                  </div>
                </div>

                <div className="info-box">
                  <HiOutlineCalendar className="info-icon" />
                  <div className="info-content">
                    <span className="info-label">Posted Date</span>
                    <span className="info-value">
                      {formatDate(job.jobPostedOn)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="description-section">
                <h2 className="section-title">
                  Job Description & Requirements
                </h2>
                <div className="description-body">
                  {job.description || "No specific description provided."}
                </div>
              </div>

              {/* CTA Action */}
              <div className="action-container">
                {user && user.role === "Employer" ? (
                  <span className="employer-note">
                    Employers cannot submit applications to job listings.
                  </span>
                ) : (
                  <Link to={`/application/${job._id}`} className="apply-btn">
                    <span>Apply Now</span>
                    <HiOutlinePaperAirplane size={16} />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default JobDetails;
