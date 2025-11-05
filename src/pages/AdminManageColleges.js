import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminManageColleges() {
    const [colleges, setColleges] = useState([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchColleges = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/colleges', {
                headers: { 'x-auth-token': token }
            });
            setColleges(res.data);
            setLoading(false);
        } catch (err) { toast.error("Failed to load colleges."); }
    };
    useEffect(() => { fetchColleges(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Creating college...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('https://collegeconnect-backend-mrkz.onrender.com/api/colleges', { name }, { headers: { 'x-auth-token': token } });
            toast.dismiss(toastId);
            toast.success(`College "${res.data.name}" created!`);
            setColleges([...colleges, res.data]);
            setName('');
        } catch (err) {
            toast.dismiss(toastId);
            toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
        }
    };

    const handleDelete = async (id, collegeName) => {
        if (!window.confirm(`Delete "${collegeName}"? Check if it's in use first.`)) return;
        const toastId = toast.loading('Deleting...');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://collegeconnect-backend-mrkz.onrender.com/api/colleges/${id}`, { headers: { 'x-auth-token': token } });
            toast.dismiss(toastId);
            toast.success('College deleted!');
            setColleges(colleges.filter(c => c._id !== id));
        } catch (err) {
            toast.dismiss(toastId);
            toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
        }
    };

    return (
        <div className="form-container" style={{maxWidth: '700px'}}>
            <form onSubmit={handleCreate}>
                <h2>Admin: Manage Colleges</h2>
                <div className="form-group">
                    <label>Create New College</label>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., RTU Kota" />
                        <button type="submit" className="btn btn-primary" style={{whiteSpace: 'nowrap'}}>Add College</button>
                    </div>
                </div>
            </form>
            <hr style={{margin: '30px 0'}} />
            <h3>Existing Colleges ({colleges.length})</h3>
            <div className="tag-checkbox-container" style={{display: 'block'}}>
                {loading ? <p>Loading...</p> : (
                    colleges.map(c => (
                        <div key={c._id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee'}}>
                            <span style={{fontWeight: '600'}}>{c.name}</span>
                            <button onClick={() => handleDelete(c._id, c.name)} className="btn" style={{background: '#e74c3c', color: 'white', padding: '5px 10px'}}>
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
export default AdminManageColleges;