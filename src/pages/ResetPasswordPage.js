import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 
import { useParams, useNavigate } from 'react-router-dom';

function ResetPasswordPage() {
    const { token } = useParams(); // (URL 'से' (from) 'टोकन' (token) (टोकन) 'लें' (Get))
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }
        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters.");
        }

        setLoading(true);
        const toastId = toast.loading('Resetting password...');
        try {
            const res = await axios.post(
                `http://localhost:5000/api/auth/reset-password/${token}`, 
                { password }
            );
            toast.dismiss(toastId);
            toast.success(res.data.msg);
            navigate('/login'); // 'लॉगिन' (Login) 'पेज' (page) (page) 'पर' (on) 'भेजें' (Send)
        } catch (err) {
            toast.dismiss(toastId);
            let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
            toast.error('Error: ' + errorMsg);
        }
        setLoading(false);
    };

    return (
        <div className="form-container">
            <form onSubmit={onSubmitHandler}>
                <h2>Reset Your Password</h2>
                <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input 
                        type="password" id="password" name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input 
                        type="password" id="confirmPassword" name="confirmPassword" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                    {loading ? 'Saving...' : 'Set New Password'}
                </button>
            </form>
        </div>
    );
}
export default ResetPasswordPage;