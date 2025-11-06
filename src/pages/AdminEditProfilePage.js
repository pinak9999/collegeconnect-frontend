import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function AdminEditProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    college: '',
    branch: '',
    year: '',
    bio: '',
    price_per_session: 0,
    session_duration_minutes: 20,
  });

  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState('https://via.placeholder.com/100');
  const [idCardFile, setIdCardFile] = useState(null);
  const [currentIdCard, setCurrentIdCard] = useState(null);
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allColleges, setAllColleges] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          toast.error('No token found.');
          return;
        }

        const profileRes = await axios.get(
          `https://collegeconnect-backend-mrkz.onrender.com/api/profile/user/${userId}`,
          { headers: { 'x-auth-token': token } }
        );

        setFormData({
          college: profileRes.data.college ? profileRes.data.college._id : '',
          branch: profileRes.data.branch || '',
          year: profileRes.data.year || '',
          bio: profileRes.data.bio || '',
          price_per_session: profileRes.data.price_per_session || 0,
          session_duration_minutes: profileRes.data.session_duration_minutes || 20,
        });

        if (profileRes.data.avatar) setCurrentAvatar(profileRes.data.avatar);
        if (profileRes.data.tags) setSelectedTags(profileRes.data.tags.map((t) => t._id));
        if (profileRes.data.id_card_url) setCurrentIdCard(profileRes.data.id_card_url);

        const tagsRes = await axios.get(
          'https://collegeconnect-backend-mrkz.onrender.com/api/tags',
          { headers: { 'x-auth-token': token } }
        );
        setAllTags(tagsRes.data);

        const collegesRes = await axios.get(
          'https://collegeconnect-backend-mrkz.onrender.com/api/colleges',
          { headers: { 'x-auth-token': token } }
        );
        setAllColleges(collegesRes.data);

        setLoading(false);
      } catch (err) {
        toast.error('Failed to load data.');
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onFileChangeHandler = (e) => setImageFile(e.target.files[0]);
  const onIdCardFileChange = (e) => setIdCardFile(e.target.files[0]);
  const onTagChangeHandler = (e) => {
    const tagId = e.target.value;
    if (e.target.checked) setSelectedTags([...selectedTags, tagId]);
    else setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Saving profile...');
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append('tags', selectedTags.join(','));
    if (imageFile) data.append('image', imageFile);
    if (idCardFile) data.append('id_card', idCardFile);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `https://collegeconnect-backend-mrkz.onrender.com/api/profile/admin/${userId}`,
        data,
        { headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } }
      );
      toast.dismiss(toastId);
      toast.success('Profile Saved!');
      navigate('/admin-dashboard');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Error saving profile');
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#2563eb' }}>
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg,#e0f2ff,#f9faff)',
        padding: '25px 15px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <form
        onSubmit={onSubmitHandler}
        style={{
          width: '100%',
          maxWidth: '550px',
          background: 'white',
          padding: '25px 20px',
          borderRadius: '16px',
          boxShadow: '0 6px 25px rgba(0,0,0,0.08)',
          animation: 'fadeIn 0.5s ease-in-out',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            color: '#1e3a8a',
            marginBottom: '20px',
          }}
        >
          🧑‍💼 Admin: Edit Senior Profile
        </h2>

        {/* Avatar Upload */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={currentAvatar}
            alt="Avatar"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '3px solid #2563eb',
              marginBottom: '10px',
            }}
          />
          <label style={{ fontWeight: 600, color: '#2563eb' }}>Change Profile Photo</label>
          <input type="file" onChange={onFileChangeHandler} style={{ display: 'block', margin: '8px auto' }} />
        </div>

        {/* ID Card Upload */}
        <div
          style={{
            textAlign: 'center',
            background: '#f0f9ff',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
          }}
        >
          <label style={{ fontWeight: 600, color: '#1e3a8a' }}>Upload Senior's ID Card</label>
          <input type="file" onChange={onIdCardFileChange} style={{ display: 'block', margin: '10px auto' }} />
          {currentIdCard && (
            <a
              href={currentIdCard}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#16a34a', textDecoration: 'none', fontWeight: 600 }}
            >
              📄 View Uploaded ID Card
            </a>
          )}
        </div>

        {/* College Dropdown */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 600, color: '#1e3a8a' }}>College Name</label>
          <select
            name="college"
            value={formData.college}
            onChange={onChangeHandler}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              marginTop: '5px',
            }}
          >
            <option value="">Select College</option>
            {allColleges.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Branch & Year */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 600, color: '#1e3a8a' }}>Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={onChangeHandler}
            placeholder="Enter branch"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              marginTop: '5px',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 600, color: '#1e3a8a' }}>Year / Status</label>
          <select
            name="year"
            value={formData.year}
            onChange={onChangeHandler}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              marginTop: '5px',
            }}
          >
            <option value="">Select Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
            <option>Placed in Company</option>
          </select>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 600, color: '#1e3a8a' }}>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={onChangeHandler}
            rows="3"
            placeholder="Write about the senior..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              marginTop: '5px',
            }}
          ></textarea>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 600, color: '#1e3a8a' }}>Specializations</label>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '10px',
            }}
          >
            {allTags.map((tag) => (
              <label
                key={tag._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: selectedTags.includes(tag._id) ? '#2563eb' : '#e5e7eb',
                  color: selectedTags.includes(tag._id) ? '#fff' : '#1e3a8a',
                  padding: '6px 10px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <input
                  type="checkbox"
                  value={tag._id}
                  checked={selectedTags.includes(tag._id)}
                  onChange={onTagChangeHandler}
                  style={{ display: 'none' }}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>

        {/* Price & Duration */}
        <h3 style={{ color: '#1e3a8a', marginBottom: '10px' }}>💰 Session Details</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600 }}>Price (₹)</label>
            <input
              type="number"
              name="price_per_session"
              value={formData.price_per_session}
              onChange={onChangeHandler}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                marginTop: '5px',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: 600 }}>Duration (min)</label>
            <input
              type="number"
              name="session_duration_minutes"
              value={formData.session_duration_minutes}
              onChange={onChangeHandler}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                marginTop: '5px',
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            marginTop: '25px',
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(45deg,#2563eb,#1e40af)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(37,99,235,0.3)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          💾 Save Profile
        </button>
      </form>
    </div>
  );
}

export default AdminEditProfilePage;
