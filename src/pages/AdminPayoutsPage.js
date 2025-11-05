import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminPayoutsPage() {
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/payouts/admin', {
                headers: { 'x-auth-token': token }
            });
            setPayouts(res.data);
            setLoading(false);
        } catch (err) {
            setError('Error: ' + (err.response ? err.response.data.msg : err.message));
            setLoading(false);
        }
    };
    useEffect(() => { fetchPayouts(); }, []);

    const markAsPaidHandler = async (seniorId) => {
        if (!window.confirm('Are you sure you have paid this senior? This action cannot be undone.')) return;
        const toastId = toast.loading('Updating status...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(
                `http://localhost:5000/api/payouts/mark-paid/${seniorId}`,
                null,
                { headers: { 'x-auth-token': token } }
            );
            toast.dismiss(toastId);
            toast.success(res.data.msg);
            fetchPayouts(); // (लिस्ट (list) (सूची) 'रीफ्रेश' (refresh) (ताज़ा) करें)
        } catch (err) {
            toast.dismiss(toastId);
            toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
        }
    };

    if (loading) return <div className="container" style={{padding: '40px 0'}}><h2>Loading Payouts...</h2></div>;
    if (error) return <div className="container" style={{padding: '40px 0'}}><h2 style={{color: 'red'}}>{error}</h2></div>;

    return (
        <div className="container" style={{ padding: '40px 0', minHeight: '60vh' }}>
            <h2>Admin Payouts (Pending)</h2>
            <p>This list shows all *Completed & Unpaid* bookings, grouped by senior.</p>
            
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Senior Name</th>
                            <th>Completed Bookings</th>
                            <th>Your Platform Fee (Earned)</th>
                            <th>Final Payout Amount (To Senior)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payouts.length > 0 ? payouts.map(payout => (
                            <tr key={payout.seniorId}>
                                <td>{payout.seniorName}</td>
                                <td>{payout.totalBookings}</td>
                                {/* (यह 'आपका' (your) 'असली' (real) 'कमीशन' (commission) (कमीशन) है) */}
                                <td style={{color: 'green', fontWeight: 'bold'}}>₹{payout.totalPlatformFee}</td>
                                {/* (यह 'सीनियर' (Senior) 'को' (to) 'देने' (give) 'वाला' (wala) 'अमाउंट' (amount) (रकम) है) */}
                                <td style={{color: '#007bff', fontWeight: 'bold'}}>₹{payout.finalPayoutAmount}</td>
                                <td>
                                    <button 
                                        onClick={() => markAsPaidHandler(payout.seniorId)} 
                                        className="btn btn-primary" 
                                        style={{padding: '5px 10px'}}
                                    >
                                        Mark as Paid
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{textAlign: 'center'}}>No pending payouts found!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default AdminPayoutsPage;