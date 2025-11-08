import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminManageColleges() {
  const [colleges, setColleges] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://collegeconnect-backend-mrkz.onrender.com/api/colleges",
        { headers: { "x-auth-token": token } }
      );
      setColleges(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load colleges.");
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating college...");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/colleges",
        { name },
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success(`🎓 "${res.data.name}" added successfully!`);
      setColleges([...colleges, res.data]);
      setName("");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error(
        "Error: " + (err.response ? err.response.data.msg : err.message)
      );
    }
  };

  const handleDelete = async (id, collegeName) => {
    if (!window.confirm(`Delete "${collegeName}"?`)) return;
    const toastId = toast.loading("Deleting...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://collegeconnect-backend-mrkz.onrender.com/api/colleges/${id}`,
        { headers: { "x-auth-token": token } }
      );
      toast.dismiss(toastId);
      toast.success("College deleted successfully!");
      setColleges(colleges.filter((c) => c._id !== id));
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <div style={mainContainer}>
      <form style={formCard} onSubmit={handleCreate}>
        <h2 style={heading}>🏫 Manage Colleges</h2>
        <p style={subText}>Add or remove colleges from the system easily.</p>

        <div style={formGroup}>
          <input
            type="text"
            value={name}
            placeholder="Enter new college name..."
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={addButton}>
            ➕ Add College
          </button>
        </div>
      </form>

      <div style={listCard}>
        <h3 style={listTitle}>🎓 Existing Colleges ({colleges.length})</h3>
        <div style={{ marginTop: "10px" }}>
          {loading ? (
            <p style={{ color: "#2563eb", textAlign: "center" }}>
              ⏳ Loading colleges...
            </p>
          ) : colleges.length === 0 ? (
            <p style={{ color: "#555", textAlign: "center" }}>
              No colleges added yet.
            </p>
          ) : (
            colleges.map((c, index) => (
              <div
                key={c._id}
                style={{
                  ...collegeCard,
                  animation: `fadeSlide 0.5s ease ${index * 0.05}s forwards`,
                }}
              >
                <span style={{ fontWeight: 600, color: "#1e40af" }}>
                  {c.name}
                </span>
                <button
                  onClick={() => handleDelete(c._id, c.name)}
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

/* 🎨 Inline Styles */
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
  color: "#2563eb",
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
  background: "linear-gradient(45deg, #2563eb, #3b82f6)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: 600,
  transition: "all 0.3s ease",
  boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
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
  color: "#1e3a8a",
  fontWeight: 700,
  marginBottom: "10px",
};

const collegeCard = {
  background: "linear-gradient(90deg, #f8fafc, #eef2ff)",
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

export default AdminManageColleges;
