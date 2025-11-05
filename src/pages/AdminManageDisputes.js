import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminManageDisputes() {
    const [reasons, setReasons] = useState([]);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchReasons = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/disputereasons', {
                headers: { 'x-auth-token': token }
            });
            setReasons(res.data);
            setLoading(false);
        } catch (err) { toast.error("Failed to load reasons."); }
    };
    useEffect(() => { fetchReasons(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Creating reason...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://collegeconnect-backend-mrkz.onrender.com/api/disputereasons', { reason }, { headers: { 'x-auth-token': token } });
            toast.dismiss(toastId);
            toast.success(`Reason "${res.data.reason}" created!`);
            setReasons([...reasons, res.data]);
            setReason('');
        } catch (err) {
            toast.dismiss(toastId);
            toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
        }
    };

    const handleDelete = async (id, reasonText) => {
        if (!window.confirm(`Delete "${reasonText}"? Check if it's in use first.`)) return;
        const toastId = toast.loading('Deleting...');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://collegeconnect-backend-mrkz.onrender.com/api/disputereasons/${id}`, { headers: { 'x-auth-token': token } });
            toast.dismiss(toastId);
            toast.success('Reason deleted!');
            setReasons(reasons.filter(r => r._id !== id));
        } catch (err) {
            toast.dismiss(toastId);
            toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
        }
    };

    return (
        <div className="form-container" style={{maxWidth: '700px'}}>
            <form onSubmit={handleCreate}>
                <h2>Admin: Manage Dispute Reasons</h2>
                <div className="form-group">
                    <label>Create New Reason</label>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Senior did not call" />
                        <button type="submit" className="btn btn-primary" style={{whiteSpace: 'nowrap'}}>Add Reason</button>
                    </div>
                </div>
            </form>
            <hr style={{margin: '30px 0'}} />
            <h3>Existing Reasons ({reasons.length})</h3>
            <div className="tag-checkbox-container" style={{display: 'block'}}>
                {loading ? <p>Loading...</p> : (
                    reasons.map(r => (
                        <div key={r._id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee'}}>
                            <span style={{fontWeight: '600'}}>{r.reason}</span>
                            <button onClick={() => handleDelete(r._id, r.reason)} className="btn" style={{background: '#e74c3c', color: 'white', padding: '5px 10px'}}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
export default AdminManageDisputes;