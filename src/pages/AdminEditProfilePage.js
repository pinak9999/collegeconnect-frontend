import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function AdminEditProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    college: "",
    branch: "Not Set",
    year: "Not Set",
    bio: "",
    price_per_session: 0,
    session_duration_minutes: 20,
  });

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(
    "https://via.placeholder.com/100"
  );
  const [idCardFile, setIdCardFile] = useState(null);
  const [currentIdCard, setCurrentIdCard] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allColleges, setAllColleges] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          toast.error("No token found.");
          return;
        }

        const profileRes = await axios.get(
          `https://collegeconnect-backend-mrkz.onrender.com/api/profile/user/${userId}`,
          { headers: { "x-auth-token": token } }
        );

        setFormData({
          college: profileRes.data.college ? profileRes.data.college._id : "",
          branch: profileRes.data.branch || "Not Set",
          year: profileRes.data.year || "Not Set",
          bio: profileRes.data.bio || "",
          price_per_session: profileRes.data.price_per_session || 0,
          session_duration_minutes:
            profileRes.data.session_duration_minutes || 20,
        });

        if (profileRes.data.avatar) setCurrentAvatar(profileRes.data.avatar);
        if (profileRes.data.tags)
          setSelectedTags(profileRes.data.tags.map((t) => t._id));
        if (profileRes.data.id_card_url)
          setCurrentIdCard(profileRes.data.id_card_url);

        const tagsRes = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/tags",
          { headers: { "x-auth-token": token } }
        );
        setAllTags(tagsRes.data);

        const collegesRes = await axios.get(
          "https://collegeconnect-backend-mrkz.onrender.com/api/colleges",
          { headers: { "x-auth-token": token } }
        );
        setAllColleges(collegesRes.data);

        setLoading(false);
      } catch (err) {
        toast.error("Failed to load data");
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const onFileChangeHandler = (e) => setImageFile(e.target.files[0]);
  const onIdCardFileChange = (e) => setIdCardFile(e.target.files[0]);
  const onTagChangeHandler = (e) => {
    const tagId = e.target.value;
    if (e.target.checked)
      setSelectedTags([...selectedTags, tagId]);
    else setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Saving profile...");
    const data = new FormData();
    data.append("college", formData.college);
    data.append("branch", formData.branch);
    data.append("year", formData.year);
    data.append("bio", formData.bio);
    data.append("price_per_session", formData.price_per_session);
    data.append("session_duration_minutes", formData.session_duration_minutes);
    data.append("tags", selectedTags.join(","));
    if (imageFile) data.append("image", imageFile);
    if (idCardFile) data.append("id_card", idCardFile);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://collegeconnect-backend-mrkz.onrender.com/api/profile/admin/${userId}`,
        data,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.dismiss(toastId);
      toast.success("Profile Saved Successfully!");
      navigate("/admin-dashboard");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Error saving profile!");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px", color: "#2563eb" }}>
        <h2>⚙️ Loading Profile...</h2>
      </div>
    );

  return (
    <div style={mainWrapper}>
      <form style={formBox} onSubmit={onSubmitHandler}>
        <h2 style={title}>🧩 Edit Senior Profile</h2>

        {/* Profile Avatar */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src={currentAvatar} alt="Avatar" style={avatarStyle} />
          <label style={label}>Change Profile Photo</label>
          <input type="file" onChange={onFileChangeHandler} style={fileInput} />
        </div>

        {/* ID Card Upload */}
        <div style={sectionBox}>
          <label style={label}>Upload ID Card (for verification)</label>
          <input type="file" onChange={onIdCardFileChange} style={fileInput} />
          {currentIdCard && (
            <a
              href={currentIdCard}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
            >
              View Uploaded ID Card 🔗
            </a>
          )}
        </div>

        {/* College Dropdown */}
        <div style={formGroup}>
          <label style={label}>Select College</label>
          <select
            name="college"
            value={formData.college}
            onChange={onChangeHandler}
            style={dropdown}
          >
            <option value="">Select a College</option>
            {allColleges.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Branch Input */}
        <div style={formGroup}>
          <label style={label}>Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={onChangeHandler}
            style={input}
          />
        </div>

        {/* Year Dropdown */}
        <div style={formGroup}>
          <label style={label}>Current Year / Status</label>
          <select
            name="year"
            value={formData.year}
            onChange={onChangeHandler}
            style={dropdown}
          >
            <option value="Not Set">Select Status</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Placed in Company">Placed in Company</option>
          </select>
        </div>

        {/* Bio */}
        <div style={formGroup}>
          <label style={label}>Short Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={onChangeHandler}
            rows="3"
            style={textarea}
          />
        </div>

        {/* Tags */}
        <div style={formGroup}>
          <label style={label}>Specializations</label>
          <div style={tagGrid}>
            {allTags.map((tag) => (
              <label key={tag._id} style={tagLabel}>
                <input
                  type="checkbox"
                  value={tag._id}
                  checked={selectedTags.includes(tag._id)}
                  onChange={onTagChangeHandler}
                  style={{ marginRight: "6px" }}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        {/* Price & Duration */}
        <h3 style={subTitle}>💰 Session Settings</h3>
        <div style={formGroup}>
          <label style={label}>Price (₹)</label>
          <input
            type="number"
            name="price_per_session"
            value={formData.price_per_session}
            onChange={onChangeHandler}
            style={input}
          />
        </div>
        <div style={formGroup}>
          <label style={label}>Duration (minutes)</label>
          <input
            type="number"
            name="session_duration_minutes"
            value={formData.session_duration_minutes}
            onChange={onChangeHandler}
            style={input}
          />
        </div>

        <button type="submit" style={btnGradient}>
          💾 Save Profile
        </button>
      </form>
    </div>
  );
}

/* 🎨 Inline Styles */
const mainWrapper = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#eef2ff,#f9fafb)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 10px",
};

const formBox = {
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(8px)",
  borderRadius: "16px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  padding: "25px",
  width: "100%",
  maxWidth: "500px",
  animation: "fadeIn 0.6s ease",
};

const title = {
  textAlign: "center",
  color: "#2563eb",
  fontWeight: 700,
  marginBottom: "15px",
};

const label = { fontWeight: 600, color: "#333", marginBottom: "5px" };
const formGroup = { marginBottom: "15px", display: "flex", flexDirection: "column" };

const input = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  outline: "none",
  fontSize: "15px",
};

const dropdown = { ...input, background: "#fff", cursor: "pointer" };
const textarea = { ...input, resize: "none" };
const tagGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  background: "#f8fafc",
  padding: "10px",
  borderRadius: "10px",
};
const tagLabel = {
  background: "#e0e7ff",
  padding: "6px 10px",
  borderRadius: "8px",
  fontSize: "0.85rem",
  color: "#1e3a8a",
  cursor: "pointer",
};

const avatarStyle = {
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #2563eb",
  marginBottom: "8px",
};

const sectionBox = {
  background: "#f3f4f6",
  padding: "12px",
  borderRadius: "12px",
  textAlign: "center",
  marginBottom: "20px",
};

const fileInput = {
  display: "block",
  margin: "10px auto",
};

const linkStyle = { color: "#2563eb", textDecoration: "none", fontWeight: 600 };

const btnGradient = {
  background: "linear-gradient(45deg,#2563eb,#6366f1)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  padding: "10px 20px",
  cursor: "pointer",
  fontWeight: 600,
  width: "100%",
  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
  marginTop: "10px",
};

const subTitle = {
  color: "#2563eb",
  fontWeight: 700,
  margin: "20px 0 10px",
  textAlign: "center",
};

export default AdminEditProfilePage;
