import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Backend URL (Render wala)
  const API_URL = "https://collegeconnect-backend-mrkz.onrender.com/api/bookings/student/my"; 

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const res = await axios.get(API_URL, {
          headers: { 'x-auth-token': token }
        });

        console.log("Bookings Data:", res.data); 
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // 🕒 Time Check Logic
  const isClassTime = (booking) => {
    if (!booking.scheduledDate || !booking.startTime) return false;

    const now = new Date();
    const meetingDate = new Date(booking.scheduledDate);
    const [h, m] = booking.startTime.split(':');
    
    // Set Time
    meetingDate.setHours(parseInt(h), parseInt(m), 0);
    
    // End Time (+30 mins)
    const endTime = new Date(meetingDate.getTime() + 30 * 60000);

    // Button Active: 5 mins before start -> until end time
    return now >= new Date(meetingDate.getTime() - 5 * 60000) && now <= endTime;
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Scheduled Classes</h1>

        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center">
            <p className="text-gray-500 mb-4">No upcoming classes.</p>
            <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-4 py-2 rounded">
              Find a Mentor
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{b.topic}</h3>
                  <p className="text-sm">Mentor: {b.mentor?.name || "Senior Mentor"}</p>
                  <p className="text-xs text-gray-500">
                    📅 {new Date(b.scheduledDate).toLocaleDateString()} | ⏰ {b.startTime}
                  </p>
                </div>

                <button
                  disabled={!isClassTime(b)}
                  onClick={() => navigate(`/video-call/${b.meetingLink}`)}
                  className={`px-4 py-2 rounded text-white font-bold 
                    ${isClassTime(b) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  {isClassTime(b) ? "Join Video Call" : "Wait"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentBookings;