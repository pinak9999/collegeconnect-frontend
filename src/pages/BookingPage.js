import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Profile } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookingPage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token");
        
        // Parallel fetch for profile and settings (for fee)
        const [resProfile, resSettings] = await Promise.all([
           axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/senior/${userId}`, {
             headers: { 'x-auth-token': token }
           }),
           axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/settings`)
        ]);

        setProfile(resProfile.data);
        const fee = (resProfile.data.price_per_session || 0) + (resSettings.data.platformFee || 20);
        setTotalAmount(fee);
      } catch (error) {
        toast.error("Failed to load profile details");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, navigate]);

  const handlePayment = async () => {
    if (!profile) return;
    
    // --- KEY FIX: Structure matches backend expectation ---
    const bookingDetails = {
      senior: profile.user._id || profile.user.id,  // Must match backend schema
      profileId: profile._id,
      amount: totalAmount,
      slot_time: new Date(),     // In a real app, user selects this
    };

    const toastId = toast.loading("Initializing payment...");
    try {
      const token = localStorage.getItem('token');
      // 1. Create Order
      const { data: order } = await axios.post(
        'https://collegeconnect-backend-mrkz.onrender.com/api/payment/order',
        { amount: totalAmount },
        { headers: { 'x-auth-token': token } }
      );

      const options = {
        key: "rzp_test_RbhIpPvOLS2KkF", // Ideally from env
        amount: order.amount,
        currency: order.currency,
        name: "CollegeConnect",
        description: `Session with ${profile.user.name}`,
        order_id: order.id,
        handler: async function (response: any) {
          toast.loading("Verifying...", { id: toastId });
          try {
            await axios.post(
              'https://collegeconnect-backend-mrkz.onrender.com/api/payment/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingDetails: bookingDetails // Passing the structured details
              },
              { headers: { 'x-auth-token': token } }
            );
            toast.success("Booking Confirmed!", { id: toastId });
            navigate('/student-dashboard/bookings');
          } catch (verifyErr) {
             toast.error("Verification Failed", { id: toastId });
          }
        },
        prefill: {
          name: auth.user?.name,
          email: auth.user?.email,
          contact: auth.user?.mobileNumber
        },
        theme: { color: "#2563EB" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Payment initiation failed", { id: toastId });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
  if (!profile) return <div className="p-10 text-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-6">
            <img src={profile.avatar || "https://via.placeholder.com/100"} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-blue-50 object-cover" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{profile.user.name}</h2>
              <p className="text-blue-600 font-medium">{profile.college.name}</p>
              <div className="flex gap-2 mt-2">
                {profile.tags.map(t => <span key={t._id} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">{t.name}</span>)}
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">About</h3>
            <p className="text-slate-600 leading-relaxed">{profile.bio || "No bio available."}</p>
          </div>
        </div>

        {/* Right: Payment Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Booking Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Session Fee</span>
                <span>₹{profile.price_per_session}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Platform Fee</span>
                <span>₹{(totalAmount - profile.price_per_session)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg text-blue-600">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
            <button 
              onClick={handlePayment}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transition transform active:scale-95"
            >
              Pay & Book Now
            </button>
            <p className="text-xs text-center text-slate-400 mt-4">Secure payment via Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;