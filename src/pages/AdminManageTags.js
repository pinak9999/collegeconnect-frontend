import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminManageTags() {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState('');
    const [loading, setLoading] = useState(true);

    // 1. (सभी 'Tags' (टैग्स) (टैग) 'लोड' (load) करें)
    const fetchTags = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/tags', {
                headers: { 'x-auth-token': token }
            });
            setTags(res.data);
            setLoading(false);
        } catch (err) { toast.error("Failed to load tags."); }
    };
    useEffect(() => { fetchTags(); }, []);

    // 2. ('नया' (New) 'टैग' (Tag) (टैग) 'बनाएँ' (Create))
    const handleCreateTag = async (e) => {
        e.preventDefault();
        if (!newTagName) return toast.error("Tag name cannot be empty.");
        
        const toastId = toast.loading('Creating tag...');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/tags',
                { name: newTagName },
                { headers: { 'x-auth-token': token } }
            );
            toast.dismiss(toastId);
            toast.success(`Tag "${res.data.name}" created!`);
            setTags([...tags, res.data]); // 'लिस्ट' (List) (list) 'अपडेट' (update) करें
            setNewTagName(''); // 'इनपुट' (Input) (इनपुट) 'खाली' (empty) करें
        } catch (err) {
            toast.dismiss(toastId);
            toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
        }
    };

    // 3. 'टैग' (Tag) (टैग) 'डिलीट' (Delete) (हटाएँ) करें
    const handleDeleteTag = async (tagId, tagName) => {
        if (!window.confirm(`Are you sure you want to delete the tag "${tagName}"?`)) return;

        const toastId = toast.loading('Deleting tag...');
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/tags/${tagId}`, {
                headers: { 'x-auth-token': token }
            });
            toast.dismiss(toastId);
            toast.success('Tag deleted!');
            setTags(tags.filter(tag => tag._id !== tagId)); // 'लिस्ट' (List) (list) 'अपडेट' (update) करें
        } catch (err) {
            toast.dismiss(toastId);
            toast.error('Error: ' + (err.response ? err.response.data.msg : err.message));
        }
    };

    return (
        <div className="form-container" style={{maxWidth: '700px'}}>
            <form onSubmit={handleCreateTag}>
                <h2>Admin: Manage Tags</h2>
                <div className="form-group">
                    <label>Create New Tag</label>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input 
                            type="text" 
                            value={newTagName} 
                            onChange={(e) => setNewTagName(e.target.value)} 
                            placeholder="e.g., Web Dev, AI/ML, Hostel Life..."
                        />
                        <button type="submit" className="btn btn-primary" style={{whiteSpace: 'nowrap'}}>Add Tag</button>
                    </div>
                </div>
            </form>

            <hr style={{margin: '30px 0'}} />

            <h3>Existing Tags ({tags.length})</h3>
            <div className="tag-checkbox-container" style={{display: 'block'}}>
                {loading ? <p>Loading tags...</p> : (
                    tags.map(tag => (
                        <div key={tag._id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee'}}>
                            <span style={{fontWeight: '600'}}>{tag.name}</span>
                            <button 
                                onClick={() => handleDeleteTag(tag._id, tag.name)}
                                className="btn" style={{background: '#e74c3c', color: 'white', padding: '5px 10px'}}
                            >
                                Delete
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
export default AdminManageTags;