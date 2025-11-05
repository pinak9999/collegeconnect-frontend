import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function RaiseDisputePage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    
    // --- (यह 'नया' (New) 'अपडेट' (Update) है) ---
    const [reasonId, setReasonId] = useState(''); // (अब 'String' (स्ट्रिंग) (स्ट्रिंग) 'नहीं' (not) 'है' (is), 'ID' (आईडी) (ID (आईडी)) 'है' (is))
    const [allReasons, setAllReasons] = useState([]); // ('Dropdown' (ड्रॉपडाउन) (ड्रॉप-डाउन) 'के लिए' (for) 'लिस्ट' (list) (सूची))
    const [loading, setLoading] = useState(true);
    // --- (अपडेट (Update) खत्म) ---

    // (यह 'Dispute Reasons' (विवाद कारण) 'लाएगा' (will fetch))
    useEffect(() => {
        const fetchReasons = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/disputereasons', {
                    headers: { 'x-auth-token': token }
                });
                setAllReasons(res.data);
                setLoading(false);
            } catch (err) { toast.error("Failed to load reasons."); }
        };
        fetchReasons();
    }, []);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!reasonId) return toast.error('Please select a reason for the dispute.');
        
        const toastId = toast.loading('Submitting dispute...');
        try {
            const token = localStorage.getItem('token');
            // (यह 'अब' (now) 'ID' (आईडी) (ID (आईडी)) 'भेजता' (sends) 'है' (है))
            await axios.post(
                `http://localhost:5000/api/disputes/raise/${bookingId}`,
                { reasonId: reasonId },
                { headers: { 'x-auth-token': token } }
            );
            
            toast.dismiss(toastId);
            toast.success('Dispute raised. Admin will review it shortly.');
            navigate('/student-dashboard');

        } catch (err) {
            toast.dismiss(toastId);
            toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
        }
    };

    if (loading) return <div className="container" style={{padding: '40px 0'}}><h2>Loading...</h2></div>;

    return (
        <div className="form-container">
            <form onSubmit={onSubmitHandler}>
                <h2>Raise a Dispute</h2>
                
                {/* --- (यह 'नया' (New) 'Dropdown' (ड्रॉपडाउन) (ड्रॉप-डाउन) 'है' (is)) --- */}
                <div className="form-group">
                    <label>Reason for Dispute</label>
                    <select 
                        name="reason" 
                        value={reasonId} 
                        onChange={(e) => setReasonId(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a Reason</option>
                        {allReasons.map(r => (
                            <option key={r._id} value={r._id}>{r.reason}</option>
                        ))}
                    </select>
                </div>
                {/* --- (अपडेट (Update) खत्म) --- */}
                
                <button type="submit" className="btn btn-primary btn-full" style={{background: '#e74c3c'}}>Submit Dispute</button>
            </form>
        </div>
    );
}
export default RaiseDisputePage;