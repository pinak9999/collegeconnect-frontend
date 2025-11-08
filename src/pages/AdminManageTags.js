import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminManageTags() {
  const [tags, setTags] = useState([]);
  const [newTagName, setNewTagName] = useState("");
  const [loading, setLoading] = useState(true);

  // 🧩 Fetch all tags
  const fetchTags = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://collegeconnect-backend-mrkz.onrender.com/api/tags",
        { headers: { "x-auth-token": token } }
      );
      setTags(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("❌ Failed to load tags.");
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  // ➕ Create New Tag
  const handleCreateTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return toast.error("Please enter a tag name.");
    const toastId = toast.loading("Creating tag...");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://collegeconnect-backend-mrkz.onrender.com/api/tags",
        { name: newTagName },
        { headers: { "x-auth-token": token } }
      );
      setTags([...tags, res.data]);
      setNewTagName("");
      toast.dismiss(toastId);
      toast.success(`✅ "${res.data.name}" added!`);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  // 🗑 Delete Tag
  const handleDeleteTag = async (tagId, tagName) => {
    if (!window.confirm(`Are you sure you want to delete "${tagName}"?`)) return;
    const toastId = toast.loading("Deleting tag...");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://collegeconnect-backend-mrkz.onrender.com/api/tags/${tagId}`,
        { headers: { "x-auth-token": token } }
      );
      setTags(tags.filter((tag) => tag._id !== tagId));
      toast.dismiss(toastId);
      toast.success("🗑 Tag deleted!");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error: " + (err.response ? err.response.data.msg : err.message));
    }
  };

  return (
    <div style={mainContainer}>
      {/* 🎯 Create Tag Section */}
      <form onSubmit={handleCreateTag} style={formCard}>
        <h2 style={heading}>🏷 Manage Tags</h2>
        <p style={subText}>Create or delete tags used in senior profiles.</p>

        <div style={formGroup}>
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="e.g. Web Dev, AI/ML, Hostel Life..."
            style={inputStyle}
          />
          <button type="submit" style={addButton}>
            ➕ Add Tag
          </button>
        </div>
      </form>

      {/* 🧾 Tag List Section */}
      <div style={listCard}>
        <h3 style={listTitle}>📚 Existing Tags ({tags.length})</h3>

        <div style={{ marginTop: "15px" }}>
          {loading ? (
            <p style={{ textAlign: "center", color: "#2563eb" }}>
              ⏳ Loading tags...
            </p>
          ) : tags.length === 0 ? (
            <p style={{ textAlign: "center", color: "#777" }}>
              No tags found. Add one above 👆
            </p>
          ) : (
            tags.map((tag, i) => (
              <div
                key={tag._id}
                style={{
                  ...tagItem,
                  animation: `fadeSlide 0.5s ease ${i * 0.08}s forwards`,
                }}
              >
                <span style={tagText}>#{tag.name}</span>
                <button
                  onClick={() => handleDeleteTag(tag._id, tag.name)}
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

/* === 🎨 Inline Styles === */

const mainContainer = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#e0f2fe,#f9fafb)",
  padding: "50px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  fontFamily: "Poppins, sans-serif",
};

const formCard = {
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  padding: "25px 30px",
  width: "100%",
  maxWidth: "600px",
  textAlign: "center",
  marginBottom: "25px",
  animation: "fadeIn 0.6s ease",
};

const heading = {
  color: "#2563eb",
  fontSize: "1.8rem",
  fontWeight: "700",
  marginBottom: "8px",
};

const subText = { color: "#555", fontSize: "0.9rem", marginBottom: "20px" };

const formGroup = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "10px",
};

const inputStyle = {
  flexGrow: 1,
  minWidth: "220px",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "15px",
  outline: "none",
  transition: "0.3s",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const addButton = {
  background: "linear-gradient(45deg,#2563eb,#3b82f6)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "10px 18px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "0.3s",
  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
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
  color: "#1e40af",
  fontWeight: "700",
  marginBottom: "10px",
};

const tagItem = {
  background: "linear-gradient(90deg,#eff6ff,#dbeafe)",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  padding: "10px 15px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "0.3s",
};

const tagText = { fontWeight: "600", color: "#1e3a8a" };

const deleteBtn = {
  background: "linear-gradient(45deg,#ef4444,#dc2626)",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "6px 10px",
  cursor: "pointer",
  fontWeight: 600,
  boxShadow: "0 3px 10px rgba(239,68,68,0.3)",
  transition: "0.3s",
};

/* ✨ Animations */
const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}`;
document.head.appendChild(style);

export default AdminManageTags;
