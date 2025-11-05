import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; // (हम 'toast' (टोस्ट) (टोस्ट) 'का' (of) 'इस्तेमाल' (use) 'करेंगे' (will do))

function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ 
      name: '', email: '', password: '', mobileNumber: '' 
  });
  const [loading, setLoading] = useState(false); // ('Loading' (लोडिंग) (लोड हो रहा है) 'स्टेट' (state) (स्थिति))

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // 'लोडिंग' (Loading) (लोड हो रहा है) 'शुरू' (Start) 'करें' (do)
    const toastId = toast.loading('Registering...'); // 'Toast' (टोस्ट) (टोस्ट) 'दिखाएँ' (Show)
    
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      toast.dismiss(toastId); // 'लोडिंग' (Loading) (लोड हो रहा है) 'Toast' (टोस्ट) (टोस्ट) 'हटाएँ' (Remove)
      toast.success(res.data.msg); // 'सफलता' (Success) 'दिखाएँ' (Show) (जैसे, "Registration successful!")
      
      navigate('/login'); // 'लॉगिन' (Login) 'पेज' (page) (page) 'पर' (on) 'भेजें' (Send)

    } catch (err) {
      toast.dismiss(toastId); // 'लोडिंग' (Loading) (लोड हो रहा है) 'Toast' (टोस्ट) (टोस्ट) 'हटाएँ' (Remove)
      let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
      toast.error('Error: ' + errorMsg); // 'एरर' (Error) (त्रुटि) 'दिखाएँ' (Show)
    }
    setLoading(false); // 'लोडिंग' (Loading) (लोड हो रहा है) 'खत्म' (End) 'करें' (do)
  };

  return (
    <div className="form-container">
      
      <form onSubmit={onSubmitHandler}>
        <h2>Create Your Account</h2>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={onChangeHandler} required />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={onChangeHandler} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={onChangeHandler} required />
        </div>
        
        {/* (यह रहा 'ज़रूरी' (Important) 'मोबाइल' (Mobile) 'फील्ड' (field)) */}
        <div className="form-group">
          <label>10-Digit Mobile Number</label>
          <input 
            type="text" 
            name="mobileNumber" 
            value={formData.mobileNumber} 
            onChange={onChangeHandler} 
            placeholder="9876543210" 
            required 
            minLength="10" 
            maxLength="10" 
          />
        </div>
        
        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="form-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>

    </div>
  );
}
export default RegisterPage;