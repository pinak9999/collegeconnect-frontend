import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 

function RateBookingPage() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(0); 
    const [review_text, setReviewText] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            return toast.error('Please select a star rating (1-5).');
        }
        
        // --- (यह रहा 100% "Accurate" (सही) 'फिक्स' (Fix) (ठीक) - Bilingual Warning (द्विभाषी चेतावनी)) ---
        // 1. (पहले 'Student' (छात्र) 'से' (from) 'Confirm' (कन्फर्म) (पुष्टि) 'करवाएँ' (do))
        const isConfirmed = window.confirm(
            
            "WARNING: After giving a rating, you CANNOT raise a dispute for this booking anymore.\n" +
            "(चेतावनी: रेटिंग देने के बाद, आप इस बुकिंग के लिए फिर कभी 'Dispute' (विवाद) 'नहीं' (not) 'कर' (can do) 'पाएँगे' (will be))"
        );

        // 2. (अगर (If) 'Student' (छात्र) 'Cancel' (कैंसिल) 'दबाता' (presses) 'है' (है), 'तो' (then) 'रुक' (stop) 'जाएँ' (do))
        if (!isConfirmed) {
            return; 
        }
        // --- (अपडेट (Update) खत्म) ---

        
        const toastId = toast.loading('Submitting rating...');
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/ratings/submit/${bookingId}`,
                { rating, review_text },
                { headers: { 'x-auth-token': token } }
            );
            
            toast.dismiss(toastId);
            toast.success('Rating submitted! Thank you.');
            navigate('/student-dashboard/bookings'); 

        } catch (err) {
            toast.dismiss(toastId);
            toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={onSubmitHandler}>
                <h2>Rate Your Session</h2>
                
                <div className="form-group" style={{textAlign: 'center'}}>
                    <label>Rating (1-5 Stars)</label>
                    <div className="rating" style={{fontSize: '40px', cursor: 'pointer'}}>
                        {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            return (
                                <span 
                                    key={starValue} 
                                    style={{color: starValue <= rating ? '#f39c12' : '#e0e0e0'}}
                                    onClick={() => setRating(starValue)}
                                >
                                    ★
                                </span>
                            );
                        })}
                    </div>
                </div>

                <div className="form-group">
                    <label>Review (Optional)</label>
                    <textarea 
                        name="review_text" 
                        value={review_text} 
                        onChange={(e) => setReviewText(e.target.value)} 
                        rows="4"
                    ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary btn-full">Submit Rating</button>
            </form>
        </div>
    );
}
export default RateBookingPage;