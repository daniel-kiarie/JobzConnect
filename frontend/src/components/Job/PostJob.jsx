import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Navigate } from "react-router-dom";
import { Context } from "../../main";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const CATEGORIES = [
  "Graphics & Design",
  "Mobile App Development",
  "Frontend Web Development",
  "Business Development Executive",
  "Account & Finance",
  "Artificial Intelligence",
  "Video Animation",
  "MEAN Stack Development",
  "MERN Stack Development",
  "Data Entry Operator",
];

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const [submitting, setSubmitting] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const validate = () => {
    if (!title.trim()) return "Job title is required.";
    if (!description.trim()) return "Job description is required.";
    if (!category) return "Please select a category.";
    if (!country.trim() || !city.trim() || !location.trim())
      return "Country, city, and location are required.";
    if (salaryType === "default") return "Please select a salary type.";
    if (salaryType === "Fixed Salary" && !fixedSalary)
      return "Please enter a fixed salary.";
    if (salaryType === "Ranged Salary" && (!salaryFrom || !salaryTo))
      return "Please enter both salary range values.";
    return null;
  };

  const handleJobPost = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const payload =
      salaryType === "Fixed Salary"
        ? { title, description, category, country, city, location, fixedSalary }
        : {
            title,
            description,
            category,
            country,
            city,
            location,
            salaryFrom,
            salaryTo,
          };

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/job/post`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      toast.success(res.data.message);
      navigateTo("/job/getall");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthorized || (user && user.role !== "Employer")) {
    return <Navigate to="/login" />;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h3 style={styles.heading}>Post New Job</h3>
        <form onSubmit={handleJobPost}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Job Title</label>
              <input
                style={styles.input}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frontend Developer"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Category</label>
              <select
                style={styles.input}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Country</label>
              <input
                style={styles.input}
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>City</label>
              <input
                style={styles.input}
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>

            <div style={{ ...styles.field, gridColumn: "span 2" }}>
              <label style={styles.label}>Location</label>
              <input
                style={styles.input}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Street address / area"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Salary Type</label>
              <select
                style={styles.input}
                value={salaryType}
                onChange={(e) => setSalaryType(e.target.value)}
              >
                <option value="default">Select Salary Type</option>
                <option value="Fixed Salary">Fixed Salary</option>
                <option value="Ranged Salary">Ranged Salary</option>
              </select>
            </div>

            <div style={styles.field}>
              {salaryType === "Fixed Salary" && (
                <>
                  <label style={styles.label}>Fixed Salary</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="Enter Fixed Salary"
                    value={fixedSalary}
                    onChange={(e) => setFixedSalary(e.target.value)}
                  />
                </>
              )}
              {salaryType === "Ranged Salary" && (
                <>
                  <label style={styles.label}>Salary Range</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      style={styles.input}
                      type="number"
                      placeholder="From"
                      value={salaryFrom}
                      onChange={(e) => setSalaryFrom(e.target.value)}
                    />
                    <input
                      style={styles.input}
                      type="number"
                      placeholder="To"
                      value={salaryTo}
                      onChange={(e) => setSalaryTo(e.target.value)}
                    />
                  </div>
                </>
              )}
              {salaryType === "default" && (
                <p style={styles.hint}>Please select a salary type *</p>
              )}
            </div>

            <div style={{ ...styles.field, gridColumn: "span 2" }}>
              <label style={styles.label}>Job Description</label>
              <textarea
                style={{ ...styles.input, resize: "vertical" }}
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the role, responsibilities, and requirements"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.button,
              ...(submitting ? styles.buttonDisabled : {}),
            }}
          >
            {submitting ? "Posting..." : "Create Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    boxSizing: "border-box",
    background: "#f4f6f8",
  },
  card: {
    width: "100%",
    maxWidth: 900,
    maxHeight: "92vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    padding: "24px 32px",
    boxSizing: "border-box",
  },
  heading: {
    margin: "0 0 16px 0",
    fontSize: "1.3rem",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px 20px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#333",
  },
  input: {
    padding: "8px 10px",
    border: "1px solid #d0d5dd",
    borderRadius: 6,
    fontSize: "0.9rem",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    width: "100%",
  },
  hint: {
    margin: "6px 0 0 0",
    fontSize: "0.8rem",
    color: "#888",
  },
  button: {
    marginTop: 18,
    width: "100%",
    padding: 10,
    border: "none",
    borderRadius: 6,
    background: "#4f46e5",
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  buttonDisabled: {
    background: "#a5a5c0",
    cursor: "not-allowed",
  },
};

export default PostJob;
