import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/bookings/student/my', {
          headers: { 'x-auth-token': token }
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  // 🕒 Helper to check time logic for button
  const isJoinable = (booking) => {
    if(!booking.scheduledDate) return false;
    
    const now = new Date();
    const meetingDate = new Date(booking.scheduledDate);
    const [h, m] = booking.startTime.split(':');
    meetingDate.setHours(h, m, 0);

    const endTime = new Date(meetingDate.getTime() + 30 * 60000); // +30 mins

    // Button active 5 mins before start until end time
    return now >= new Date(meetingDate.getTime() - 5 * 60000) && now <= endTime;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Scheduled Sessions</h2>
      
      {bookings.length === 0 ? (
        <p>No bookings found. Go book a mentor!</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((b) => (
            <div key={b._id} className="border p-4 rounded shadow bg-white hover:shadow-lg transition">
              <h3 className="font-bold text-lg">{b.topic}</h3>
              <p className="text-gray-600">Mentor: {b.senior?.name || "Unknown"}</p>
              
              <div className="mt-2 bg-gray-100 p-2 rounded text-sm">
                <p>📅 Date: {new Date(b.scheduledDate).toLocaleDateString()}</p>
                <p>⏰ Time: {b.startTime} - {b.endTime}</p>
              </div>

              {/* Join Button Logic */}
              <button
                disabled={!isJoinable(b)}
                onClick={() => navigate(`/video-call/${b.meetingLink}`)}
                className={`mt-4 w-full py-2 rounded font-bold text-white 
                  ${isJoinable(b) ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                {isJoinable(b) ? "🎥 Join Video Call" : "Wait for Time"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentBookings;