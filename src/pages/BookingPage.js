import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast'; 

function BookingPage() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth(); 
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const loadPageData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) { setLoading(false); setError('Error: You are not logged in.'); return; }
                
                const res = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`, { headers: { 'x-auth-token': token } });
                const settingsRes = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`);
                
                setProfile(res.data);
                const fee = res.data.price_per_session + settingsRes.data.platformFee;
                setTotalAmount(fee);
                setLoading(false);
            } catch (err) {
                let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
                setError('Error: ' + errorMsg); setLoading(false);
            }
        };
        loadPageData();
    }, [userId]);

    const displayRazorpay = async () => { 
        if (!auth.user) { toast.error('You must be logged in to book.'); navigate('/login'); return; }
        const bookingDetails = {
            senior: profile.user._id, profileId: profile._id,
            slot_time: new Date(), duration: profile.session_duration_minutes,
            amount: totalAmount 
        };
        const toastId = toast.loading('Creating your order...'); 
        try {
            const token = localStorage.getItem('token');
            const orderRes = await axios.post('https://collegeconnect-backend-mrkz.onrender.com/api/payment/order', 
                { seniorId: profile.user._id }, { headers: { 'x-auth-token': token } }
            );
            const order = orderRes.data;
            if (order.calculatedAmount !== totalAmount) {
                 toast.dismiss(toastId);
                 toast.error("Price mismatch error. Please refresh."); return;
            }
            toast.dismiss(toastId);
            const options = {
                key: 'rzp_test_RbhIpPvOLS2KkF', // (!! ज़रूरी: अपनी Razorpay (रेजरपे) Key (की) ID (आईडी) यहाँ डालें)
                amount: order.amount, 
                currency: order.currency,
                name: "CollegeConnect",
                description: `Booking slot with ${profile.user ? profile.user.name : 'Senior'}`,
                order_id: order.id,
                handler: async function (response) {
                    const verifyToastId = toast.loading('Verifying payment...');
                    try {
                        await axios.post('https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify', 
                            {...response, bookingDetails: bookingDetails},
                            { headers: { 'x-auth-token': token } }
                        );
                        toast.dismiss(verifyToastId);
                        toast.success('Booking Confirmed!');
                        navigate('/booking-success');
                    } catch (verifyErr) {
                        toast.dismiss(verifyToastId);
                        toast.error('Payment Verification Failed. Please contact support.');
                    }
                },
                prefill: { name: auth.user.name, email: auth.user.email },
                theme: { color: "#1abc9c" } 
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (err) {
            toast.dismiss(toastId);
            let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
            toast.error('Error creating order. ' + errorMsg);
        }
    };

    if (loading) return <div className="container" style={{padding: '40px 0'}}><h2>Loading Profile...</h2></div>;
    if (error) return <div className="container" style={{padding: '40px 0'}}><h2 style={{color: 'red'}}>{error}</h2></div>;
    if (!profile) return <div className="container" style={{padding: '40px 0'}}><h2>Profile not found.</h2></div>;

    return (
        <div className="container" style={{ padding: '40px 0', minHeight: '80vh', maxWidth: '800px' }}>
            <div className="senior-card" style={{textAlign: 'left', padding: '40px'}}>
                <img src={profile.avatar || 'https://via.placeholder.com/100'} alt={profile.user ? profile.user.name : 'Senior'} style={{float: 'right', marginLeft: '20px', width: '100px', height: '100px', borderRadius: '50%'}} />
                
                <h2>{profile.user ? profile.user.name : 'Senior Profile'}</h2>
                <h4 className="college">
                    {(profile.college ? profile.college.name : 'N/A')}
                    <span style={{display: 'block', color: '#555', fontWeight: 500, fontSize: '1rem'}}>
                        {profile.branch || 'Branch N/A'} ({profile.year || 'Year N/A'})
                    </span>
                </h4>
                
                {/* --- (यह रहा 'नया' (New) 'टेक्स्ट' (Text) (पाठ) 'वाला' (wala) 'फिक्स' (Fix) (ठीक)) --- */}
                {profile.id_card_url && (
                    <div className="form-group" style={{margin: '15px 0'}}>
                        <a href={profile.id_card_url} target="_blank" rel="noopener noreferrer" 
                           className="btn btn-secondary" 
                           style={{fontSize: '0.9rem', padding: '8px 15px', background: '#e0f7fa', borderColor: '#b2ebf2'}}>
                            View College Verified ID Card
                        </a>
                    </div>
                )}
                {/* --- (अपडेट (Update) खत्म) --- */}

                <hr style={{margin: '20px 0'}} />
                
                <h3>About Me:</h3>
                <p className="bio" style={{minHeight: 'auto'}}>{profile.bio}</p>
                <hr style={{margin: '20px 0'}} />
                
                <h3>Specializations (Tags):</h3>
                <div className="tags-container" style={{justifyContent: 'flex-start', marginBottom: '20px'}}>
                    {profile.tags && profile.tags.length > 0 ? 
                        profile.tags.map(tag => (
                            <span key={tag._id} className="tag-pill">{tag.name}</span>
                        )) : <p>No tags listed.</p>
                    }
                </div>
                <hr style={{margin: '20px 0'}} />

                <h3>Booking Details:</h3>
                <p>पेमेंट  करने के बाद, 'सीनियर'  आपसे 'अगले 6 घंटों'  के 'भीतर'  'संपर्क'  करेगा।</p>
                <div className="price" style={{fontSize: '1.5rem', textAlign: 'center', marginTop: '30px'}}>
                  Total Price: ₹{totalAmount} 
                  <span style={{fontSize: '1rem', color: '#555'}}> / {profile.session_duration_minutes} min session</span>
                </div>
                <button onClick={displayRazorpay} className="btn btn-primary btn-full">
                    Pay ₹{totalAmount} & Book Now
                </button>
            </div>
        </div>
    );
}

export default BookingPage;