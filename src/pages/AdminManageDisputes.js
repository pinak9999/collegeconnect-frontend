import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminManageDisputes() {
  const [reasons, setReasons] = useState([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReasons = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://collegeconnect-backend-mrkz.onrender.com/api/disputereasons",
        { headers: { "x-auth-token": token } }
      );
      setReasons(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("❌ Failed to load reasons.");
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating reason...");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/disputereasons",
        { reason },
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success(`✅ Reason "${res.data.reason}" created!`);
      setReasons([...reasons, res.data]);
      setReason("");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  const handleDelete = async (id, reasonText) => {
    if (!window.confirm(`Delete "${reasonText}"?`)) return;
    const toastId = toast.loading("Deleting...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://collegeconnect-backend-mrkz.onrender.com/api/disputereasons/${id}`,
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success("🗑 Reason deleted!");
      setReasons(reasons.filter((r) => r._id !== id));
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <div style={mainContainer}>
      <form style={formCard} onSubmit={handleCreate}>
        <h2 style={heading}>⚠️ Manage Dispute Reasons</h2>
        <p style={subText}>
          Add or remove reasons used by students when reporting a dispute.
        </p>
        <div style={formGroup}>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Senior did not attend session"
            style={inputStyle}
          />
          <button type="submit" style={addButton}>
            ➕ Add Reason
          </button>
        </div>
      </form>

      <div style={listCard}>
        <h3 style={listTitle}>📋 Existing Reasons ({reasons.length})</h3>
        <div style={{ marginTop: "15px" }}>
          {loading ? (
            <p style={{ color: "#2563eb", textAlign: "center" }}>
              ⏳ Loading reasons...
            </p>
          ) : reasons.length === 0 ? (
            <p style={{ color: "#666", textAlign: "center" }}>
              No dispute reasons found.
            </p>
          ) : (
            reasons.map((r, i) => (
              <div
                key={r._id}
                style={{
                  ...reasonCard,
                  animation: `fadeSlide 0.5s ease ${i * 0.05}s forwards`,
                }}
              >
                <span style={{ fontWeight: 600, color: "#1e3a8a" }}>
                  {r.reason}
                </span>
                <button
                  onClick={() => handleDelete(r._id, r.reason)}
                  style={deleteBtn}
                >
                  🗑 Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ✨ Inline CSS Styles */
const mainContainer = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e0f2fe, #f9fafb)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "40px 15px",
  fontFamily: "Poppins, sans-serif",
};

const formCard = {
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(8px)",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  padding: "25px",
  width: "100%",
  maxWidth: "600px",
  textAlign: "center",
  marginBottom: "30px",
  animation: "fadeIn 0.6s ease",
};

const heading = {
  color: "#dc2626",
  fontSize: "1.8rem",
  marginBottom: "5px",
  fontWeight: 700,
};

const subText = {
  color: "#555",
  fontSize: "0.9rem",
  marginBottom: "15px",
};

const formGroup = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  justifyContent: "center",
};

const inputStyle = {
  flexGrow: 1,
  minWidth: "220px",
  padding: "10px 14px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  transition: "0.3s",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
};

const addButton = {
  background: "linear-gradient(45deg, #dc2626, #ef4444)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: 600,
  transition: "all 0.3s ease",
  boxShadow: "0 4px 10px rgba(239,68,68,0.3)",
};

const listCard = {
  background: "rgba(255,255,255,0.95)",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  padding: "20px",
  width: "100%",
  maxWidth: "700px",
  animation: "fadeIn 0.8s ease",
};

const listTitle = {
  textAlign: "center",
  color: "#b91c1c",
  fontWeight: 700,
  marginBottom: "10px",
};

const reasonCard = {
  background: "linear-gradient(90deg, #fef2f2, #fee2e2)",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  padding: "10px 15px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "all 0.3s ease",
};

const deleteBtn = {
  background: "linear-gradient(45deg, #ef4444, #dc2626)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "6px 10px",
  cursor: "pointer",
  fontWeight: 600,
  boxShadow: "0 3px 10px rgba(239,68,68,0.3)",
  transition: "0.3s",
};

export default AdminManageDisputes;
