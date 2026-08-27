import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../../main";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineBriefcase,
  HiOutlineArrowRight,
  HiOutlineSearch,
} from "react-icons/hi";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthorized } = useContext(Context);

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/job/getall`, {
          withCredentials: true,
        });
        if (isMounted) {
          setJobs(res.data.jobs || res.data || []);
        }
      } catch (error) {
        console.error("Failed to load jobs:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  // Format Salary Display
  const formatSalary = (job) => {
    if (job.fixedSalary) {
      return `$${Number(job.fixedSalary).toLocaleString()}`;
    }
    if (job.salaryFrom && job.salaryTo) {
      return `$${Number(job.salaryFrom).toLocaleString()} - $${Number(job.salaryTo).toLocaleString()}`;
    }
    return "Negotiable";
  };

  // Filter Jobs by Title, Category, City, or Country
  const filteredJobs = jobs.filter((job) => {
    const query = searchTerm.toLowerCase();
    return (
      job.title?.toLowerCase().includes(query) ||
      job.category?.toLowerCase().includes(query) ||
      job.city?.toLowerCase().includes(query) ||
      job.country?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <style>{`
        .jobs-page {
          min-height: 100vh;
          background-color: #0f172a;
          color: #f8fafc;
          padding: 4.5rem 3.25rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .jobs-container {
          max-width: 1600px;
          margin: 0 auto;
          height: 100%;
        }

        .jobs-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 2.5rem;
          gap: 0.75rem;
        }

        .jobs-title {
          font-size: 2rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .jobs-subtitle {
          color: #94a3b8;
          font-size: 0.95rem;
          margin: 0;
        }

        .search-box {
          position: relative;
          width: 100%;
          max-width: 480px;
          margin-top: 0.5rem;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          font-size: 1.2rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 10px;
          color: #f8fafc;
          font-size: 0.9rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .job-card {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .job-card:hover {
          transform: translateY(-4px);
          border-color: #3b82f6;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        }

        .category-badge {
          align-self: flex-start;
          background-color: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.75rem;
        }

        .job-card-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #f8fafc;
          margin: 0 0 0.85rem 0;
          line-height: 1.35;
        }

        .job-meta-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #94a3b8;
        }

        .meta-icon {
          color: #3b82f6;
          font-size: 1.05rem;
          flex-shrink: 0;
        }

        .salary-text {
          color: #10b981;
          font-weight: 600;
        }

        .job-description {
          font-size: 0.85rem;
          color: #cbd5e1;
          line-height: 1.5;
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .details-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.65rem;
          background-color: #2563eb;
          color: #ffffff;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background-color 0.2s ease;
          box-sizing: border-box;
        }

        .details-btn:hover {
          background-color: #1d4ed8;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 4rem 1rem;
          color: #94a3b8;
          font-size: 1rem;
        }

        @media (max-width: 640px) {
          .jobs-grid {
            grid-template-columns: 1fr;
          }
          .jobs-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <section className="jobs-page">
        <div className="jobs-container">
          <header className="jobs-header">
            <h1 className="jobs-title">Explore Career Opportunities</h1>
            <p className="jobs-subtitle">
              Discover and apply for available positions across tech, design,
              and finance
            </p>

            {/* Search Filter */}
            <div className="search-box">
              <HiOutlineSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by title, category, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {/* Loading Indicator */}
          {loading ? (
            <div className="loading-state">Loading available jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="empty-state">
              No job opportunities found matching your criteria.
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((element) => (
                <div className="job-card" key={element._id}>
                  <div>
                    {/* Category Tag */}
                    <div className="category-badge">
                      <HiOutlineBriefcase size={12} />
                      {element.category || "General"}
                    </div>

                    {/* Job Title */}
                    <h3 className="job-card-title">{element.title}</h3>

                    {/* Job Metadata */}
                    <div className="job-meta-list">
                      <div className="meta-item">
                        <HiOutlineLocationMarker className="meta-icon" />
                        <span>
                          {element.city ? `${element.city}, ` : ""}
                          {element.country}
                          {element.location ? ` (${element.location})` : ""}
                        </span>
                      </div>

                      <div className="meta-item">
                        <HiOutlineCurrencyDollar className="meta-icon" />
                        <span className="salary-text">
                          {formatSalary(element)}
                        </span>
                      </div>
                    </div>

                    {/* Description Snippet */}
                    {element.description && (
                      <p className="job-description">{element.description}</p>
                    )}
                  </div>

                  {/* View Details Button */}
                  <div className="job-card-action">
                    <Link to={`/job/${element._id}`} className="details-btn">
                      <span>View Full Details</span>
                      <HiOutlineArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Jobs;
