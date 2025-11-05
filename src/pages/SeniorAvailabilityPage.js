import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SeniorAvailabilityPage() {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState([
    // (डिफ़ॉल्ट (Default) रूप से हम 3 दिन दिखाते हैं)
    { day: 'Monday', startTime: '', endTime: '' },
    { day: 'Tuesday', startTime: '', endTime: '' },
    { day: 'Wednesday', startTime: '', endTime: '' },
  ]);
  const [loading, setLoading] = useState(true);

  // 1. (useEffect) पेज लोड (load) होते ही पुरानी 'availability' (उपलब्धता) (अगर है) को मँगाएँ
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const token = localStorage.getItem('token');
        // 'GET /api/profile/me' (मेरी (me) प्रोफाइल (profile) लाओ) को कॉल (call) करें
        const res = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/profile/me', {
          headers: { 'x-auth-token': token }
        });
        
        // अगर 'availability' (उपलब्धता) सेव (save) है, तो उसे दिखाएँ
        if (res.data.availability && res.data.availability.length > 0) {
          setAvailability(res.data.availability);
        }
        setLoading(false);
      } catch (err) {
        console.log(err.response ? err.response.data.msg : err.message);
        setLoading(false);
      }
    };
    loadAvailability();
  }, []);

  // 2. 'onChange' (ऑनचेंज) हैंडलर (handler) (जब 'टाइम' (time) बदलता है)
  const onChangeHandler = (index, e) => {
    // ('index' (इंडेक्स) -> 0, 1, 2... | 'e.target' (ई.टारगेट) -> day, startTime, endTime)
    const updatedAvailability = [...availability];
    updatedAvailability[index][e.target.name] = e.target.value;
    setAvailability(updatedAvailability);
  };

  // 3. 'onSubmit' (ऑनसबमिट) हैंडलर (handler) (फॉर्म (form) सेव (save) करने के लिए)
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // हमारे नए 'Senior' (सीनियर) API (PUT /api/profile/availability) को कॉल (call) करें
      await axios.put(
        'https://collegeconnect-backend-mrkz.onrender.com/api/profile/availability', 
        { availability: availability }, // (हम सिर्फ 'availability' (उपलब्धता) का डेटा (data) भेज रहे हैं)
        { headers: { 'x-auth-token': token } }
      );

      alert('Availability Saved!');
      navigate('/senior-dashboard'); // सीनियर (Senior) डैशबोर्ड (dashboard) पर वापस भेजें

    } catch (err) {
      alert('Error saving availability: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  if (loading) return <div className="container" style={{padding: '40px 0'}}><h2>Loading...</h2></div>;

  // 4. JSX (HTML) फॉर्म (Form)
  return (
    <div className="form-container">
      <form onSubmit={onSubmitHandler}>
        <h2>Set Your Availability (Time Slots)</h2>
        <p>छात्र (Students) सिर्फ़ इन्हीं स्लॉट (slot) में आपको बुक (book) कर पाएँगे।</p>
        
        {availability.map((item, index) => (
          <div key={index} className="availability-slot" style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
            <div className="form-group" style={{flex: 1}}>
              <label>Day</label>
              <select name="day" value={item.day} onChange={(e) => onChangeHandler(index, e)}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>Start Time</label>
              <input type="time" name="startTime" value={item.startTime} onChange={(e) => onChangeHandler(index, e)} />
            </div>
            <div className="form-group" style={{flex: 1}}>
              <label>End Time</label>
              <input type="time" name="endTime" value={item.endTime} onChange={(e) => onChangeHandler(index, e)} />
            </div>
          </div>
        ))}
        
        {/* (हम बाद में "Add Day" (दिन जोड़ें) / "Remove Day" (दिन हटाएँ) बटन (button) जोड़ सकते हैं) */}

        <button type="submit" className="btn btn-primary btn-full">Save Availability</button>
      </form>
    </div>
  );
}
export default SeniorAvailabilityPage;