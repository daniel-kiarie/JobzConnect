import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
        background: "linear-gradient(135deg, #f8faff 0%, #eef3ff 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          textAlign: "center",
          padding: "50px 30px",
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(37, 99, 235, 0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Illustration */}
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
            margin: "0 auto 20px",
          }}
        >
          <img
            src="/notfound.png"
            alt="Page not found"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Error Code */}
        <div
          style={{
            display: "inline-block",
            marginBottom: "12px",
            padding: "6px 14px",
            borderRadius: "30px",
            background: "#eaf0ff",
            color: "#3154d8",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          ERROR 404
        </div>

        {/* Title */}
        <h1
          style={{
            margin: "0 0 12px",
            color: "#111827",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: "800",
            lineHeight: "1.15",
          }}
        >
          Page Not Found
        </h1>

        {/* Description */}
        <p
          style={{
            maxWidth: "500px",
            margin: "0 auto 28px",
            color: "#6b7280",
            fontSize: "15px",
            lineHeight: "1.7",
          }}
        >
          Sorry, the page you are looking for doesn't exist, may have been
          moved, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "170px",
              padding: "13px 22px",
              borderRadius: "9px",
              background: "#3154d8",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "700",
              transition: "0.2s ease",
              boxSizing: "border-box",
            }}
          >
            ← Return Home
          </Link>

          <button
            onClick={() => window.history.back()}
            style={{
              minWidth: "140px",
              padding: "13px 22px",
              borderRadius: "9px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
