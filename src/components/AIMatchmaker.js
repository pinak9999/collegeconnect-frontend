import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const aiStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

.ai-matchmaker-wrapper {
    font-family: 'Poppins', sans-serif;
    max-width: 900px;
    margin: 40px auto;
    padding: 0 20px;
}

/* 🤖 AI Search Box (Google/Perplexity Style) */
.ai-search-box {
    background: #ffffff;
    border-radius: 24px;
    padding: 8px 8px 8px 24px;
    display: flex;
    align-items: center;
    box-shadow: 0 12px 40px rgba(79, 70, 229, 0.15);
    border: 2px solid transparent;
    background-clip: padding-box;
    position: relative;
    transition: all 0.3s;
}
.ai-search-box::before {
    content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px;
    background: linear-gradient(135deg, #4f46e5, #ec4899);
    z-index: -1; border-radius: 26px;
}
.ai-search-input {
    flex: 1; border: none; outline: none; font-size: 1.1rem;
    font-family: inherit; color: #1e293b; background: transparent;
}
.ai-search-input::placeholder { color: #94a3b8; }
.ai-btn {
    background: linear-gradient(135deg, #4f46e5, #ec4899);
    color: white; border: none; padding: 14px 28px; border-radius: 18px;
    font-weight: 700; font-size: 1rem; cursor: pointer; transition: 0.3s;
    display: flex; align-items: center; gap: 8px; white-space: nowrap;
}
.ai-btn:hover { transform: scale(1.02); box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3); }
.ai-btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* Prompt Suggestions */
.ai-suggestions { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; justify-content: center; }
.ai-chip { background: #f1f5f9; color: #475569; padding: 8px 16px; border-radius: 50px; font-size: 0.85rem; cursor: pointer; transition: 0.2s; border: 1px solid #e2e8f0; }
.ai-chip:hover { background: #e0e7ff; color: #4f46e5; border-color: #c7d2fe; }

/* 🌟 AI Result Cards */
.ai-results-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-top: 40px; animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.ai-card { background: #fff; border-radius: 20px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; position: relative; display: flex; flex-direction: column; transition: transform 0.3s; }
.ai-card:hover { transform: translateY(-5px); border-color: #c7d2fe; }

/* ✨ AI Reason Box - Highlights why this mentor was chosen */
.ai-reason-box { background: linear-gradient(to right, #fef2f2, #fff1f2); border-left: 4px solid #ec4899; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 0.9rem; color: #be185d; font-weight: 500; display: flex; gap: 10px; align-items: flex-start; }

.ai-card-header { display: flex; gap: 16px; align-items: center; margin-bottom: 20px; }
.ai-avatar { width: 70px; height: 70px; border-radius: 16px; object-fit: cover; border: 2px solid #e0e7ff; }
.ai-info h3 { margin: 0 0 4px 0; font-size: 1.2rem; color: #0f172a; font-weight: 800; }
.ai-info p { margin: 0; font-size: 0.85rem; color: #64748b; font-weight: 500; }

.ai-book-btn { margin-top: auto; background: #e23744; color: white; text-align: center; padding: 12px; border-radius: 12px; text-decoration: none; font-weight: 700; transition: 0.2s; }
.ai-book-btn:hover { background: #cb202d; }

@media (max-width: 768px) {
    .ai-search-box { flex-direction: column; padding: 12px; border-radius: 26px; }
    .ai-search-input { width: 100%; padding: 10px; text-align: center; }
    .ai-btn { width: 100%; justify-content: center; }
}
`;

function AIMatchmaker() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!query.trim()) return;
        
        setLoading(true);
        setError("");
        try {
            // Apna backend URL daalein
           const res = await axios.post("https://collegeconnect-backend-mrkz.onrender.com/api/ai/matchmaker", { query });
            setMatches(res.data.matches);
        } catch (err) {
            setError("AI is taking a break. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleChipClick = (text) => {
        setQuery(text);
    };

    return (
        <div className="ai-matchmaker-wrapper">
            <style>{aiStyles}</style>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', color: '#1e293b', fontWeight: 800, margin: '0 0 10px 0' }}>
                    <span style={{background: 'linear-gradient(135deg, #4f46e5, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>AI</span> Mentor Matchmaker
                </h2>
                <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>Describe your situation, and our AI will find the perfect senior for you.</p>
            </div>

            {/* Magic Search Box */}
            <form onSubmit={handleSearch} className="ai-search-box">
                <span style={{fontSize: '1.5rem', color: '#ec4899', paddingLeft: '8px'}}>✨</span>
                <input 
                    type="text" 
                    className="ai-search-input" 
                    placeholder="e.g. Cs Specilization Best Senior"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="ai-btn" disabled={loading}>
                    {loading ? "🧠 Thinking..." : "Find My Mentor"}
                </button>
            </form>

            <div className="ai-suggestions">
                <span className="ai-chip" onClick={(e) => handleChipClick(e.target.innerText)}>I want CS branch in Jodhpur</span>
                <span className="ai-chip" onClick={(e) => handleChipClick(e.target.innerText)}>Placements ke liye best college?</span>
                <span className="ai-chip" onClick={(e) => handleChipClick(e.target.innerText)}>Hostel life kaisi hai CTAE me?</span>
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}

            {/* Results Grid */}
            {matches.length > 0 && (
                <div className="ai-results-grid">
                    {matches.map((profile, idx) => (
                        <div key={idx} className="ai-card">
                            
                            {/* ✨ AI's Explanation (The Magic part) */}
                            <div className="ai-reason-box">
                                <span style={{fontSize: '1.2rem'}}>💡</span>
                                <span>{profile.aiReason}</span>
                            </div>

                            <div className="ai-card-header">
                                <img 
                                    src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.user?.name || 'S'}&background=e0e7ff&color=4f46e5`} 
                                    alt="Senior" 
                                    className="ai-avatar" 
                                />
                                <div className="ai-info">
                                    <h3>{profile.user?.name}</h3>
                                    <p>🏛️ {profile.college?.name}</p>
                                    <p>📚 {profile.branch || 'B.Tech'}</p>
                                </div>
                            </div>

                            <Link to={`/book/${profile.user?._id}`} className="ai-book-btn">
                                🚀 Book Session (₹{profile.price_per_session + 20})
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AIMatchmaker;