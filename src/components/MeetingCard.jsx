import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MeetingCard = ({ booking }) => {
  const navigate = useNavigate();
  const [canJoin, setCanJoin] = useState(false);
  const [message, setMessage] = useState("Wait for time...");

  useEffect(() => {
    // Ye function har minute check karega
    const checkTime = () => {
      const now = new Date();
      
      // Database se aayi hui date aur time ko combine karo
      const scheduledDate = new Date(booking.scheduledDate);
      const [startHour, startMin] = booking.startTime.split(':');
      
      // Meeting Start Time Object banao
      const meetingStart = new Date(scheduledDate);
      meetingStart.setHours(parseInt(startHour), parseInt(startMin), 0);

      // Meeting End Time (30 mins baad)
      const meetingEnd = new Date(meetingStart.getTime() + 30 * 60000);

      // --- 🚀 MAIN LOGIC ---
      if (now >= meetingStart && now <= meetingEnd) {
        setCanJoin(true);
        setMessage("Join Now 🟢");
      } else if (now > meetingEnd) {
        setCanJoin(false);
        setMessage("Meeting Expired 🔴");
      } else {
        setCanJoin(false);
        // Kitna time bacha hai wo dikhao
        const diff = Math.ceil((meetingStart - now) / 60000);
        setMessage(`Starts in ${diff} mins ⏳`);
      }
    };

    checkTime(); // Turant check karo
    const timer = setInterval(checkTime, 60000); // Har 1 min me update karo

    return () => clearInterval(timer);
  }, [booking]);

  const handleJoin = () => {
    if (canJoin) {
      // Room ID ke sath Video Page par bhejo
      navigate(`/video-call/${booking.meetingLink}`);
    }
  };

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h3>Topic: {booking.topic}</h3>
      <p>Time: {booking.startTime} - {booking.endTime}</p>
      
      {/* 🚀 SMART BUTTON */}
      <button
        onClick={handleJoin}
        disabled={!canJoin}
        className={`mt-2 px-4 py-2 rounded text-white font-bold w-full
          ${canJoin ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
      >
        {message}
      </button>
    </div>
  );
};

export default MeetingCard;