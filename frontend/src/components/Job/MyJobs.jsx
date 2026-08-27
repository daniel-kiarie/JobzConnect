import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTrash, FaPen, FaXmark, FaBriefcase } from "react-icons/fa6";
import { Context } from "../../main";
import { useNavigate, Navigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();

  // Fetching all jobs posted by current employer
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/job/getmyjobs`,
          { withCredentials: true },
        );
        setMyJobs(data.myJobs || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch jobs.");
        setMyJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized || (user && user.role !== "Employer")) {
    return <Navigate to="/login" />;
  }

  // Enable editing mode for specific job
  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  // Disable editing mode
  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  // Update specific job
  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/v1/job/update/${jobId}`,
        updatedJob,
        { withCredentials: true },
      );
      toast.success(res.data.message);
      setEditingMode(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update job.");
    }
  };

  // Delete specific job
  const handleDeleteJob = async (jobId) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/v1/job/delete/${jobId}`,
        { withCredentials: true },
      );
      toast.success(res.data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete job.");
    }
  };

  // Update input change in local state
  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job,
      ),
    );
  };

  return (
    <>
      <style>{`
        .my-jobs-page {
          min-height: 100vh;
          background-color: #0f172a;
          color: #f8fafc;
          padding: 2.5rem 1.25rem;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .my-jobs-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          border-bottom: 1px solid #334155;
          padding-bottom: 1rem;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
        }

        .job-count-badge {
          background-color: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .job-card {
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .job-card.is-editing {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .card-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(51, 65, 85, 0.6);
        }

        .editing-status-tag {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
        }

        .editing-status-tag.active {
          background-color: rgba(234, 179, 8, 0.15);
          color: #facc15;
        }

        .editing-status-tag.read {
          background-color: rgba(100, 116, 139, 0.15);
          color: #94a3b8;
        }

        .card-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 0.9rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
        }

        .btn-action:hover {
          transform: translateY(-1px);
        }

        .btn-edit {
          background-color: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }
        .btn-edit:hover {
          background-color: rgba(59, 130, 246, 0.3);
        }

        .btn-save {
          background-color: #10b981;
          color: #ffffff;
        }
        .btn-save:hover {
          background-color: #059669;
        }

        .btn-cancel {
          background-color: #475569;
          color: #f8fafc;
        }
        .btn-cancel:hover {
          background-color: #334155;
        }

        .btn-delete {
          background-color: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }
        .btn-delete:hover {
          background-color: rgba(239, 68, 68, 0.3);
        }

        /* Form Controls & Grid */
        .grid-fields {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .field-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #94a3b8;
          letter-spacing: 0.04em;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          background-color: #0f172a;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 0.6rem 0.8rem;
          color: #f8fafc;
          font-size: 0.9rem;
          box-sizing: border-box;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .form-input:disabled, .form-select:disabled, .form-textarea:disabled {
          background-color: rgba(15, 23, 42, 0.4);
          border-color: transparent;
          color: #cbd5e1;
          cursor: not-allowed;
          opacity: 0.9;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background-color: #0f172a;
        }

        .form-textarea {
          resize: vertical;
          min-height: 90px;
        }

        .salary-inputs {
          display: flex;
          gap: 0.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 1.5rem;
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 14px;
          color: #94a3b8;
        }

        .empty-state-icon {
          font-size: 2.5rem;
          color: #475569;
          margin-bottom: 1rem;
        }

        .loading-state {
          text-align: center;
          padding: 4rem;
          color: #94a3b8;
        }

        @media (max-width: 640px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .card-header-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .card-actions {
            width: 100%;
            justify-content: flex-end;
          }
          .grid-fields {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="my-jobs-page">
        <div className="my-jobs-container">
          <div className="page-header">
            <h1 className="page-title">Your Posted Jobs</h1>
            <span className="job-count-badge">
              {myJobs.length} {myJobs.length === 1 ? "Job" : "Jobs"} Active
            </span>
          </div>

          {loading ? (
            <div className="loading-state">Loading your job listings...</div>
          ) : myJobs.length > 0 ? (
            <div className="jobs-list">
              {myJobs.map((job) => {
                const isEditing = editingMode === job._id;

                return (
                  <div
                    key={job._id}
                    className={`job-card ${isEditing ? "is-editing" : ""}`}
                  >
                    {/* Header bar with mode status and controls */}
                    <div className="card-header-bar">
                      <span
                        className={`editing-status-tag ${
                          isEditing ? "active" : "read"
                        }`}
                      >
                        {isEditing ? "Editing Mode" : "Job View"}
                      </span>

                      <div className="card-actions">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdateJob(job._id)}
                              className="btn-action btn-save"
                              title="Save Changes"
                            >
                              <FaCheck /> <span>Save</span>
                            </button>
                            <button
                              onClick={handleDisableEdit}
                              className="btn-action btn-cancel"
                              title="Cancel Editing"
                            >
                              <FaXmark /> <span>Cancel</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEnableEdit(job._id)}
                            className="btn-action btn-edit"
                            title="Edit Job"
                          >
                            <FaPen /> <span>Edit</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteJob(job._id)}
                          className="btn-action btn-delete"
                          title="Delete Job"
                        >
                          <FaTrash /> <span>Delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid-fields">
                      <div className="field-group">
                        <label className="field-label">Job Title</label>
                        <input
                          type="text"
                          className="form-input"
                          disabled={!isEditing}
                          value={job.title || ""}
                          onChange={(e) =>
                            handleInputChange(job._id, "title", e.target.value)
                          }
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label">Category</label>
                        <select
                          className="form-select"
                          value={job.category || ""}
                          disabled={!isEditing}
                          onChange={(e) =>
                            handleInputChange(
                              job._id,
                              "category",
                              e.target.value,
                            )
                          }
                        >
                          <option value="Graphics & Design">
                            Graphics & Design
                          </option>
                          <option value="Mobile App Development">
                            Mobile App Development
                          </option>
                          <option value="Frontend Web Development">
                            Frontend Web Development
                          </option>
                          <option value="MERN Stack Development">
                            MERN Stack Development
                          </option>
                          <option value="Account & Finance">
                            Account & Finance
                          </option>
                          <option value="Artificial Intelligence">
                            Artificial Intelligence
                          </option>
                          <option value="Video Animation">
                            Video Animation
                          </option>
                          <option value="MEAN Stack Development">
                            MEAN Stack Development
                          </option>
                          <option value="MEVN Stack Development">
                            MEVN Stack Development
                          </option>
                          <option value="Data Entry Operator">
                            Data Entry Operator
                          </option>
                        </select>
                      </div>

                      <div className="field-group">
                        <label className="field-label">Country</label>
                        <input
                          type="text"
                          className="form-input"
                          disabled={!isEditing}
                          value={job.country || ""}
                          onChange={(e) =>
                            handleInputChange(
                              job._id,
                              "country",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label">City</label>
                        <input
                          type="text"
                          className="form-input"
                          disabled={!isEditing}
                          value={job.city || ""}
                          onChange={(e) =>
                            handleInputChange(job._id, "city", e.target.value)
                          }
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label">Salary ($)</label>
                        {job.fixedSalary ? (
                          <input
                            type="number"
                            className="form-input"
                            disabled={!isEditing}
                            value={job.fixedSalary || ""}
                            onChange={(e) =>
                              handleInputChange(
                                job._id,
                                "fixedSalary",
                                e.target.value,
                              )
                            }
                          />
                        ) : (
                          <div className="salary-inputs">
                            <input
                              type="number"
                              className="form-input"
                              placeholder="From"
                              disabled={!isEditing}
                              value={job.salaryFrom || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  job._id,
                                  "salaryFrom",
                                  e.target.value,
                                )
                              }
                            />
                            <input
                              type="number"
                              className="form-input"
                              placeholder="To"
                              disabled={!isEditing}
                              value={job.salaryTo || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  job._id,
                                  "salaryTo",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        )}
                      </div>

                      <div className="field-group">
                        <label className="field-label">Expired Status</label>
                        <select
                          className="form-select"
                          value={job.expired ? "true" : "false"}
                          disabled={!isEditing}
                          onChange={(e) =>
                            handleInputChange(
                              job._id,
                              "expired",
                              e.target.value === "true",
                            )
                          }
                        >
                          <option value="false">Active (FALSE)</option>
                          <option value="true">Expired (TRUE)</option>
                        </select>
                      </div>
                    </div>

                    {/* Long Text Fields Grid */}
                    <div
                      className="grid-fields"
                      style={{ gridTemplateColumns: "1fr" }}
                    >
                      <div className="field-group">
                        <label className="field-label">Description</label>
                        <textarea
                          rows={4}
                          className="form-textarea"
                          disabled={!isEditing}
                          value={job.description || ""}
                          onChange={(e) =>
                            handleInputChange(
                              job._id,
                              "description",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="field-group">
                        <label className="field-label">Location Details</label>
                        <textarea
                          rows={2}
                          className="form-textarea"
                          disabled={!isEditing}
                          value={job.location || ""}
                          onChange={(e) =>
                            handleInputChange(
                              job._id,
                              "location",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <FaBriefcase className="empty-state-icon" />
              <h3>No Posted Jobs Found</h3>
              <p>
                You haven't posted any jobs yet, or you may have deleted them
                all.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MyJobs;
