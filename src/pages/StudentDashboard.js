import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// 🌟 Star Icon
const StarIcon = ({ filled }) => (
  <svg
    fill={filled ? '#FFD700' : '#ddd'}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    style={{ transition: '0.3s' }}
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

// 🌟 FindSenior Component
const FindSenior = () => {
  const [seniors, setSeniors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [platformFee, setPlatformFee] = useState(20);
  const [colleges, setColleges] = useState([]);
  const [tags, setTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const API_URL = 'https://collegeconnect-backend-mrkz.onrender.com';
        const [seniorsRes, collegesRes, tagsRes, settingsRes] = await Promise.all([
          axios.get(`${API_URL}/api/profile/all`, { headers: { 'x-auth-token': token } }),
          axios.get(`${API_URL}/api/colleges`, { headers: { 'x-auth-token': token } }),
          axios.get(`${API_URL}/api/tags`, { headers: { 'x-auth-token': token } }),
          axios.get(`${API_URL}/api/settings`)
        ]);
        setSeniors(seniorsRes.data);
        setColleges(collegesRes.data);
        setTags(tagsRes.data);
        setPlatformFee(settingsRes.data.platformFee);
        setLoading(false);
      } catch (err) {
        let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
        setError('Error: ' + errorMsg);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredAndSortedSeniors = seniors
    .filter((senior) => {
      const query = searchQuery.toLowerCase();
      const matchesCollege = !selectedCollege || (senior.college && senior.college._id === selectedCollege);
      const matchesTag = !selectedTag || (senior.tags && senior.tags.some((tag) => tag._id === selectedTag));
      const matchesSearch =
        !query ||
        (senior.college && senior.college.name.toLowerCase().includes(query)) ||
        (senior.branch && senior.branch.toLowerCase().includes(query)) ||
        (senior.user.name && senior.user.name.toLowerCase().includes(query));
      return matchesCollege && matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_per_session - b.price_per_session;
      if (sortBy === 'price_desc') return b.price_per_session - a.price_per_session;
      return (b.average_rating || 0) - (a.average_rating || 0);
    });

  if (loading) return <h2 style={{ textAlign: 'center', color: '#666' }}>Loading seniors...</h2>;
  if (error) return <h2 style={{ color: 'red', textAlign: 'center' }}>{error}</h2>;

  return (
    <div style={{ padding: '20px', animation: 'fadeIn 0.6s ease' }}>
      {/* 🔍 Search Bar */}
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="🔍 Search by College, Branch, or Tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '90%',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            outline: 'none',
            transition: '0.3s'
          }}
          onFocus={(e) => (e.target.style.borderColor = '#007BFF')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
      </div>

      {/* 🧭 Filters */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        style={{
          display: 'block',
          margin: '0 auto 20px auto',
          padding: '10px 18px',
          borderRadius: '8px',
          background: '#007BFF',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
          transition: '0.3s'
        }}
        onMouseEnter={(e) => (e.target.style.background = '#0056b3')}
        onMouseLeave={(e) => (e.target.style.background = '#007BFF')}
      >
        {showFilters ? 'Hide Filters ✖' : 'Show Filters & Sort ⚙️'}
      </button>

      {showFilters && (
        <div
          style={{
            display: 'grid',
            gap: '10px',
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <select value={selectedCollege} onChange={(e) => setSelectedCollege(e.target.value)} style={selectStyle}>
            <option value="">All Colleges</option>
            {colleges.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} style={selectStyle}>
            <option value="">All Tags</option>
            {tags.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
            <option value="rating">⭐ Rating: High to Low</option>
            <option value="price_asc">💰 Price: Low to High</option>
            <option value="price_desc">💸 Price: High to Low</option>
          </select>
        </div>
      )}

      {/* 👩‍🏫 Seniors Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '20px',
          justifyItems: 'center'
        }}
      >
        {filteredAndSortedSeniors.length > 0 ? (
          filteredAndSortedSeniors.map((profile) => (
            <div
              key={profile._id}
              style={{
                width: '100%',
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                padding: '20px',
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
              }}
            >
              <img
                src={profile.avatar || 'https://via.placeholder.com/100'}
                alt={profile.user?.name || 'Senior'}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #007BFF',
                  marginBottom: '10px'
                }}
              />
              <h4 style={{ color: '#333', marginBottom: '5px' }}>{profile.user?.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', alignItems: 'center' }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < Math.round(profile.average_rating)} />
                ))}
                <span style={{ fontSize: '13px', color: '#777' }}>({profile.total_ratings || 0})</span>
              </div>
              <p style={{ fontSize: '14px', color: '#666' }}>
                {profile.college?.name || 'N/A'} • {profile.branch} ({profile.year})
              </p>
              <div>
                {profile.tags?.map((tag) => (
                  <span
                    key={tag._id}
                    style={{
                      display: 'inline-block',
                      background: '#007bff1a',
                      color: '#007BFF',
                      borderRadius: '20px',
                      padding: '3px 10px',
                      margin: '3px',
                      fontSize: '12px'
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: '#555', margin: '8px 0' }}>
                {(profile.bio || '').substring(0, 70)}...
              </p>
              <div style={{ fontWeight: 'bold', color: '#007BFF' }}>
                ₹{(profile.price_per_session || 0) + platformFee} / {profile.session_duration_minutes} min
              </div>
              <Link
                to={`/book/${profile.user._id}`}
                style={{
                  display: 'inline-block',
                  marginTop: '10px',
                  padding: '8px 15px',
                  borderRadius: '8px',
                  background: '#007BFF',
                  color: 'white',
                  textDecoration: 'none',
                  transition: '0.3s'
                }}
                onMouseEnter={(e) => (e.target.style.background = '#0056b3')}
                onMouseLeave={(e) => (e.target.style.background = '#007BFF')}
              >
                View Profile & Book
              </Link>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>No seniors found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

const selectStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #ccc',
  background: '#fff',
  outline: 'none'
};

// 🌟 Student Dashboard Main
function StudentDashboard() {
  const location = useLocation();
  const onBookingsTab = location.pathname.includes('/bookings');

  return (
    <div style={{ minHeight: '80vh', background: '#f4f6f9', paddingBottom: '30px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '15px',
          background: 'white',
          padding: '15px',
          borderBottom: '2px solid #e0e0e0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <Link
          to="/student-dashboard"
          style={{
            textDecoration: 'none',
            color: !onBookingsTab ? 'white' : '#007BFF',
            background: !onBookingsTab ? '#007BFF' : '#f0f0f0',
            padding: '10px 18px',
            borderRadius: '25px',
            transition: '0.3s'
          }}
        >
          Find a Senior
        </Link>
        <Link
          to="/student-dashboard/bookings"
          style={{
            textDecoration: 'none',
            color: onBookingsTab ? 'white' : '#007BFF',
            background: onBookingsTab ? '#007BFF' : '#f0f0f0',
            padding: '10px 18px',
            borderRadius: '25px',
            transition: '0.3s'
          }}
        >
          My Bookings
        </Link>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<FindSenior />} />
         <Route path="/bookings" element={<MyBookings />} />

        </Routes>
      </div>
    </div>
  );
}

export default StudentDashboard;
