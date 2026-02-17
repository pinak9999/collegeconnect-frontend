// File: frontend/src/pages/StudentBookings.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ⚠️ URL Check karein: Render ka backend URL hi hona chahiye
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

        // API Call to fetch bookings
        const res = await axios.get(API_URL, {
          headers: { 'x-auth-token': token }
        });

        console.log("Bookings Fetched:", res.data); // Debugging
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

  // 🕒 Time Check Logic (Button Activate karne ke liye)
  const isClassTime = (booking) => {
    if (!booking.scheduledDate || !booking.startTime) return false;

    const now = new Date();
    const meetingDate = new Date(booking.scheduledDate);
    const [h, m] = booking.startTime.split(':');
    
    // Set Meeting Start Time
    meetingDate.setHours(parseInt(h), parseInt(m), 0);
    
    // Set Meeting End Time (+30 mins)
    const endTime = new Date(meetingDate.getTime() + 30 * 60000);

    // Button Active: 5 mins before start -> until end time
    return now >= new Date(meetingDate.getTime() - 5 * 60000) && now <= endTime;
  };

  if (loading) return <div className="p-10 text-center text-blue-600 font-bold">Loading your classes...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Scheduled Classes</h1>

        {bookings.length === 0 ? (
          <div className="bg-white p-8 rounded shadow text-center">
            <p className="text-gray-500 mb-4">You have no upcoming classes.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Find a Mentor
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex flex-col md:flex-row justify-between items-center">
                
                {/* Details */}
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-bold text-gray-800">{b.topic}</h2>
                  <p className="text-gray-600">Mentor: <span className="font-semibold">{b.mentor?.name || "Senior Mentor"}</span></p>
                  
                  <div className="mt-2 flex gap-3 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      📅 {new Date(b.scheduledDate).toLocaleDateString()}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      ⏰ {b.startTime} - {b.endTime}
                    </span>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  disabled={!isClassTime(b)}
                  onClick={() => navigate(`/video-call/${b.meetingLink}`)}
                  className={`px-6 py-3 rounded-lg font-bold text-white transition-all transform 
                    ${isClassTime(b) 
                      ? 'bg-green-600 hover:bg-green-700 hover:scale-105 shadow-lg' 
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
                >
                  {isClassTime(b) ? "🎥 Join Video Call" : "Wait for Time"}
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