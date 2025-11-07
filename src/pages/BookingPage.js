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

    // (Razorpay (रेजरपे) (Razorpay (रेजरपे)) 'फंक्शन' (function) (Function (फंक्शन)) 'वही' (same) 'है' (is))
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
                key: 'rzp_test_RbhIpPvOLS2KkF', // (आपकी (Your) 'Razorpay' (रेजरपे) (Razorpay (रेजरपे)) 'Key' (की) (चाबी))
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

    // ('HTML' (एचटीएमएल) (HTML (एचटीएमएल)) 'Return' (रिटर्न) (return) 'सेक्शन' (section) (अनुभाग))
    return (
        <div className="container page-container" style={{ minHeight: '80vh', maxWidth: '800px' }}>
            <div className="senior-card" style={{textAlign: 'left', padding: '20px 40px 40px 40px'}}>
                
                <img src={profile.avatar || 'https://via.placeholder.com/100'} alt={profile.user ? profile.user.name : 'Senior'} style={{float: 'right', marginLeft: '20px', width: '100px', height: '100px', borderRadius: '50%'}} />
                
                <h2>{profile.user ? profile.user.name : 'Senior Profile'}</h2>
                <h4 className="college" style={{marginTop: 0}}>
                    {(profile.college ? profile.college.name : 'N/A')}
                    <span style={{display: 'block', color: '#555', fontWeight: 500, fontSize: '1rem'}}>
                        {profile.branch || 'Branch N/A'} ({profile.year || 'Year N/A'})
                    </span>
                </h4>
                
                <hr style={{margin: '20px 0'}} />
                
                <h3>About Me:</h3>
                <p className="bio" style={{minHeight: 'auto'}}>{profile.bio}</p>
                
                <h3>Specializations (Tags):</h3>
                <div className="tags-container" style={{justifyContent: 'flex-start', marginBottom: '20px'}}>
                    {profile.tags && profile.tags.length > 0 ? 
                        profile.tags.map(tag => (
                            <span key={tag._id} className="tag-pill">{tag.name}</span>
                        )) : <p>No tags listed.</p>
                    }
                </div>
                
                {/* --- (यह रहा 'नया' (New) '100% Accurate' (सही) 'फिक्स' (Fix) (ठीक)) --- */}
                {/* ('हम' (We) 'बटन' (button) (बटन) 'की' (of) 'जगह' (place) '`Image`' (इमेज) (Image (छवि)) 'दिखा' (showing) 'रहे' (are) 'हैं' (हैं)) */}
             {profile.id_card_url && (
  <div
    style={{
      margin: '30px auto',
      textAlign: 'center',
      background: '#f8f9fa',
      padding: '20px 0 30px 0',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      width: 'fit-content',
    }}
  >
    <h3
      style={{
        borderBottom: '1px solid #ddd',
        paddingBottom: '10px',
        margin: '10px 0 20px 0',
      }}
    >
      🎓 College Verified ID
    </h3>

    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <img
        src={profile.id_card_url}
        alt="College ID Card"
        style={{
          width: '100%',
          maxWidth: '54mm', // narrower width
          aspectRatio: '54 / 86', // flipped aspect ratio (portrait)
          height: 'auto',
          border: '2px solid #007BFF',
          borderRadius: '10px',
          boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
          objectFit: 'cover',
          transform: 'rotate(0deg)', // ensure upright orientation
        }}
      />
      <p
        style={{
          marginTop: '10px',
          fontSize: '0.9rem',
          color: '#555',
          fontWeight: 500,
        }}
      >
        (Standard Vertical 54mm × 86mm Size)
      </p>
    </div>
  </div>
)}


                {/* --- (अपडेट (Update) खत्म) --- */}

                <hr style={{margin: '20px 0'}} />

                <h3>Booking Details:</h3>
                <p>पेमेंट करने के बाद, 'सीनियर' आपसे 'अगले 6 घंटों' के 'भीतर' 'संपर्क' करेगा।</p>
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