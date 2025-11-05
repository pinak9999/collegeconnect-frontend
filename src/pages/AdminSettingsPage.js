import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 

function AdminSettingsPage() {
    const [platformFee, setPlatformFee] = useState('');
    const [loading, setLoading] = useState(true);

    // 1. (पेज (page) 'लोड' (load) 'होते' (on) 'ही' (as) 'करंट' (current) (वर्तमान) 'फीस' (fees) 'लाएँ' (Fetch))
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/settings');
                setPlatformFee(res.data.platformFee);
                setLoading(false);
            } catch (err) {
                toast.error("Failed to load settings.");
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    // 2. ('सेव' (Save) (save) 'बटन' (button) 'हैंडलर' (Handler))
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Saving settings...');
        try {
            const token = localStorage.getItem('token');
            
            // 3. (PUT API (एपीआई) 'को' (to) 'कॉल' (call) (call) 'करें' (do))
            await axios.put(
                'http://localhost:5000/api/settings',
                { platformFee: Number(platformFee) }, // (नंबर (Number) (संख्या) 'के' (as) 'रूप' (form) 'में' (in) 'भेजें' (Send))
                { headers: { 'x-auth-token': token } }
            );
            
            toast.dismiss(toastId);
            toast.success('Settings Updated! Platform fee is now ₹' + platformFee);

        } catch (err) {
            toast.dismiss(toastId);
            let errorMsg = err.response ? (err.response.data.msg || err.response.data) : err.message;
            toast.error('Error: ' + errorMsg);
        }
    };

    if (loading) return <div className="container" style={{padding: '40px 0'}}><h2>Loading Settings...</h2></div>;

    return (
        <div className="form-container">
            <form onSubmit={onSubmitHandler}>
                <h2>Admin: Site Settings</h2>
                
                <div className="form-group">
                    <label htmlFor="platformFee">Platform Fee (INR ₹)</label>
                    <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>
                        (यह 'अमाउंट' (amount) (रकम) 'सीनियर' (Senior) 'फीस' (fees) 'के' (to) 'ऊपर' (on) 'हर' (every) 'बुकिंग' (booking) 'पर' (on) 'ऐड' (add) (जोड़ा) 'जाएगा' (will be))
                    </p>
                    <input 
                        type="number" 
                        id="platformFee" 
                        name="platformFee" 
                        value={platformFee} 
                        onChange={(e) => setPlatformFee(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-full">Save Settings</button>
            </form>
        </div>
    );
}
export default AdminSettingsPage;