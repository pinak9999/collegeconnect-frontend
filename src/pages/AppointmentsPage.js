// फ़ाइल का नाम: src/pages/AppointmentsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // 👈 [1. Navigate इम्पोर्ट करें]

const API_URL = 'http://localhost:5000/api';

// 👈 [2. मीटिंग टाइम चेक करने का फ़ंक्शन]
// यह चेक करेगा कि क्या हम मीटिंग के 5 मिनट पहले और 30 मिनट बाद के बीच हैं
const isMeetingTime = (scheduledTimeStr) => {
    const now = new Date();
    const scheduledTime = new Date(scheduledTimeStr);

    // मीटिंग से 5 मिनट पहले
    const startTime = new Date(scheduledTime.getTime() - 5 * 60000); 
    // मीटिंग के 30 मिनट बाद (ताकि लेट होने पर भी जॉइन कर सकें)
    const endTime = new Date(scheduledTime.getTime() + 30 * 60000); 

    return now >= startTime && now <= endTime;
};


const AppointmentsPage = () => {
    const { auth } = useAuth();
    const currentUser = auth.user;
    const navigate = useNavigate(); // 👈 [3. Navigate हुक]

    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 👈 [4. लाइव घड़ी के लिए स्टेट]
    const [now, setNow] = useState(new Date());

    // --- API कॉल फ़ंक्शन्स ---

    const fetchAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("आपको लॉग-इन करना होगा।");
                setIsLoading(false);
                return;
            }
            const response = await axios.get(`${API_URL}/appointments/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAppointments(response.data);
        } catch (err) {
            console.error("अपॉइंटमेंट्स लाने में एरर:", err);
            setError("अपॉइंटमेंट्स लाने में कोई समस्या हुई।");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id, action, payload = {}) => {
        try {
            const token = localStorage.getItem('token');
            const url = `${API_URL}/appointments/${id}/${action}`;
            
            const response = await axios.patch(url, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setAppointments(prev =>
                prev.map(app => (app._id === id ? response.data.appointment : app))
            );
            toast.success(response.data.message || 'सफलतापूर्वक अपडेट हुआ!');
        } catch (err) {
            console.error(`एक्शन ${action} में एरर:`, err);
            toast.error(err.response?.data?.message || 'कुछ गलत हुआ');
        }
    };

    const handleProposeTime = (id) => {
        const reason = prompt("रिजेक्ट करने का कारण (Reason):");
        if (!reason) return; 

        const newTime = prompt("नया समय दें (जैसे: YYYY-MM-DD HH:MM):");
        if (!newTime) return;
        
        handleAction(id, 'propose', { newTime, reason });
    };

    // --- useEffects ---

    // 1. पेज लोड होने पर अपॉइंटमेंट्स लाएँ
    useEffect(() => {
        fetchAppointments();
    }, []);

    // 👈 [5. लाइव घड़ी का लॉजिक]
    // यह useEffect हर सेकंड 'now' स्टेट को अपडेट करेगा
    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000); // हर 1 सेकंड में

        // कंपोनेंट हटने पर टाइमर को साफ़ करें
        return () => clearInterval(timer);
    }, []);


    // --- बटन दिखाने के लिए लॉजिक ---
    const renderActionButtons = (item) => {
        if (!currentUser) return null;

        const isStudent = currentUser.role === 'student' || !currentUser.isSenior;
        const isSenior = currentUser.role === 'Admin' || currentUser.isSenior;

        // 1. जब सीनियर को फैसला लेना है
        if (item.status === 'pending' && isSenior) {
            return (
                <div style={styles.buttonGroup}>
                    <button 
                        style={{...styles.button, ...styles.acceptButton}}
                        onClick={() => handleAction(item._id, 'accept')}
                    >
                        ✅ Accept
                    </button>
                    <button 
                        style={{...styles.button, ...styles.proposeButton}}
                        onClick={() => handleProposeTime(item._id)}
                    >
                        🗓️ Propose New Time
                    </button>
                </div>
            );
        }

        // 2. जब स्टूडेंट को फैसला लेना है
        if (item.status === 'senior_proposed' && isStudent) {
            return (
                <div style={styles.actionBox}>
                    <p><strong>सीनियर का सुझाव:</strong> {item.rejectionReason}</p>
                    <p><strong>नया समय:</strong> {new Date(item.scheduledTime).toLocaleString()}</p>
                    <div style={styles.buttonGroup}>
                        <button 
                            style={{...styles.button, ...styles.acceptButton}}
                            onClick={() => handleAction(item._id, 'confirm')}
                        >
                            ✅ Confirm New Time
                        </button>
                        <button 
                            style={{...styles.button, ...styles.cancelButton}}
                            onClick={() => handleAction(item._id, 'cancel')}
                        >
                            ❌ Cancel Request
                        </button>
                    </div>
                </div>
            );
        }

        // 👈 [6. बटन डिसेबल करने का फ़ाइनल लॉजिक]
        // 3. जब मीटिंग कन्फर्म हो गई है
        if (item.status === 'confirmed') {
            // 'now' स्टेट का इस्तेमाल करें (जो हर सेकंड अपडेट हो रहा है)
            const isTime = isMeetingTime(item.scheduledTime); 

            return (
                <div style={styles.actionBox}>
                    <button 
                        style={{
                            ...styles.button, 
                            ...(isTime ? styles.videoButtonActive : styles.videoButtonDisabled) // स्टाइल बदलें
                        }}
                        disabled={!isTime} // 👈 असली डिसेबल लॉजिक
                        onClick={() => {
                            // window.location.href की जगह navigate का इस्तेमाल करें
                            navigate(`/session/${item._id}`);
                        }}
                    >
                        🎥 Join Video Call
                    </button>
                    <br/>
                    {!isTime && (
                        <small style={{color: '#777'}}>यह बटन मीटिंग के समय इनेबल होगा।</small>
                    )}
                </div>
            );
        }
        
        // 4. पेंडिंग (स्टूडENT) या कैंसिल्ड/कम्पलीटेड
        if (item.status === 'pending' && isStudent) {
            return <p><i>सीनियर के कन्फर्म करने का इंतज़ार है...</i></p>;
        }
        if (item.status === 'cancelled' || item.status === 'completed') {
            return <p><i>यह सेशन {item.status} हो चुका है।</i></p>;
        }

        return null;
    };


    // --- JSX (जो स्क्रीन पर दिखेगा) ---
    if (isLoading) {
        return <div className="container"><p>लोड हो रहा है...</p></div>;
    }

    if (error) {
        return <div className="container"><p style={{ color: 'red' }}>{error}</p></div>;
    }

    return (
        <div className="container" style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
            <h2>मेरी अपॉइंटमेंट्स</h2>
            
            {appointments.length === 0 ? (
                <p>कोई अपॉइंटमेंट नहीं मिली।</p>
            ) : (
                <div className="appointments-list">
                    {appointments.map(item => (
                        <div key={item._id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <p style={{...styles.status, color: getStatusColor(item.status)}}>
                                    <strong>{item.status.replace('_', ' ')}</strong>
                                </p>
                                <p><strong>समय:</strong> {new Date(item.scheduledTime).toLocaleString()}</p>
                            </div>
                            <hr style={styles.hr} />
                            <div style={styles.cardBody}>
                                <div>
                                    <p><strong>सीनियर:</strong> {item.senior.name}</p>
                                    <p><strong>स्टूडेंट:</strong> {item.student.name}</p>
                                </div>
                                <div>
                                    {renderActionButtons(item)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- स्टाइल्स ---
const styles = {
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #eee',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    cardBody: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: '15px',
    },
    hr: {
        border: 'none',
        borderTop: '1px solid #f0f0f0',
        margin: '15px 0 0',
    },
    status: {
        fontWeight: 'bold',
        textTransform: 'capitalize',
        fontSize: '1.1rem',
    },
    actionBox: {
        textAlign: 'right',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        marginTop: '10px',
    },
    button: {
        padding: '10px 15px',
        borderRadius: '5px',
        border: 'none',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'background-color 0.2s',
    },
    acceptButton: {
        background: '#28a745', // Green
    },
    proposeButton: {
        background: '#007bff', // Blue
    },
    cancelButton: {
        background: '#dc3545', // Red
    },
    // 👈 [7. बटन के दो नए स्टाइल]
    videoButtonActive: { // जब इनेबल हो
        background: '#ffc107', // Yellow/Gold
        color: '#333',
    },
    videoButtonDisabled: { // जब डिसेबल हो
        background: '#e0e0e0', // Gray
        color: '#999',
        cursor: 'not-allowed',
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'pending': return '#f0ad4e';
        case 'senior_proposed': return '#0275d8';
        case 'confirmed': return '#5cb85c';
        case 'completed': return '#777';
        case 'cancelled': return '#d9534f';
        default: return '#333';
    }
};

export default AppointmentsPage; 