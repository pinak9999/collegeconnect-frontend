import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

   // ...
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Sending reset link...');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            toast.dismiss(toastId);
            
            // --- (यह रहा 'नया' (New) 'फिक्स' (Fix) (ठीक)) ---
            // ('यूज़र' (User) (उपयोगकर्ता) 'को' (to) 'बताएँ' (Tell) 'कि' (that) 'कंसोल' (console) (console) 'चेक' (check) (जाँच) 'करे' (do))
            toast.success("Reset link generated! (Check Backend Console to see the link)");
            // --- (अपडेट (Update) खत्म) ---

        } catch (err) {
            toast.dismiss(toastId);
            let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
            toast.error('Error: ' + errorMsg);
        }
        setLoading(false);
    };
// ...

    return (
        <div className="form-container">
            <form onSubmit={onSubmitHandler}>
                <h2>Forgot Password</h2>
                <p>Enter the email address associated with your account, and we'll send you a link to reset your password.</p>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                        type="email" id="email" name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
        </div>
    );
}
export default ForgotPasswordPage;