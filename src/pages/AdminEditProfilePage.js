import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast'; 

function AdminEditProfilePage() {
  const navigate = useNavigate();
  const { userId } = useParams(); 

  const [formData, setFormData] = useState({
    college: '', branch: 'Not Set', year: 'Not Set', bio: '', price_per_session: 0, session_duration_minutes: 20
  });
  
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState('https://via.placeholder.com/100');
  const [idCardFile, setIdCardFile] = useState(null);
  const [currentIdCard, setCurrentIdCard] = useState(null);
  const [allTags, setAllTags] = useState([]); 
  const [selectedTags, setSelectedTags] = useState([]); 
  const [allColleges, setAllColleges] = useState([]); 

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setLoading(false); toast.error("No token found."); return; }

        const profileRes = await axios.get(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/user/${userId}`, { headers: { 'x-auth-token': token } });
        
        setFormData({
            college: profileRes.data.college ? profileRes.data.college._id : '',
            branch: profileRes.data.branch || 'Not Set',
            year: profileRes.data.year || 'Not Set',
            bio: profileRes.data.bio || '',
            price_per_session: profileRes.data.price_per_session || 0,
            session_duration_minutes: profileRes.data.session_duration_minutes || 20
        });
        
        if (profileRes.data.avatar) setCurrentAvatar(profileRes.data.avatar);
        if (profileRes.data.tags) setSelectedTags(profileRes.data.tags.map(t => t._id));
        if (profileRes.data.id_card_url) setCurrentIdCard(profileRes.data.id_card_url);

        const tagsRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/tags', { headers: { 'x-auth-token': token } });
        setAllTags(tagsRes.data);
        const collegesRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/colleges', { headers: { 'x-auth-token': token } });
        setAllColleges(collegesRes.data);
        
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 404) {
            toast('This is a new senior. Please fill out their profile.', { icon: 'ℹ️' });
        } else {
            toast.error("Failed to load data.");
        }
        // (Dropdowns (ड्रॉपडाउन) (ड्रॉप-डाउन) 'को' (to) 'फिर' (still) 'भी' (also) 'लोड' (load) (लोड) 'करें' (do))
        try {
            const token = localStorage.getItem('token');
            const tagsRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/tags', { headers: { 'x-auth-token': token } });
            setAllTags(tagsRes.data);
            const collegesRes = await axios.get('https://collegeconnect-backend-mrkz.onrender.com/api/colleges', { headers: { 'x-auth-token': token } });
            setAllColleges(collegesRes.data);
        } catch (subErr) {
             toast.error("Failed to load colleges/tags.");
        }
        setLoading(false);
      }
    };
    loadData();
  }, [userId]); 

  // ('onChange' (ऑनचेंज) 'हैंडलर्स' (handlers) (संभालक) 'वही' (same) 'हैं' (are))
  const onChangeHandler = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
  const onFileChangeHandler = (e) => { setImageFile(e.target.files[0]); };
  const onIdCardFileChange = (e) => { setIdCardFile(e.target.files[0]); };
  const onTagChangeHandler = (e) => {
      const tagId = e.target.value;
      if (e.target.checked) setSelectedTags([...selectedTags, tagId]);
      else setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  // ('onSubmit' (ऑनसबमिट) 'हैंडलर' (handler) (संभालक) 'वही' (same) 'है' (is))
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Saving profile...');
    const data = new FormData();
    data.append('college', formData.college); 
    data.append('branch', formData.branch);
    data.append('year', formData.year);
    data.append('bio', formData.bio);
    data.append('price_per_session', formData.price_per_session);
    data.append('session_duration_minutes', formData.session_duration_minutes);
    data.append('tags', selectedTags.join(','));
    if (imageFile) data.append('image', imageFile);
    if (idCardFile) data.append('id_card', idCardFile);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://collegeconnect-backend-mrkz.onrender.com/api/profile/admin/${userId}`, data, {
        headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' }
      });
      toast.dismiss(toastId);
      toast.success('Profile Saved!');
      navigate('/admin-dashboard');
    } catch (err) {
      toast.dismiss(toastId);
      toast.error('Error saving profile: ' + (err.response ? err.response.data.msg : err.message));
    }
  };

  if (loading) return <div className="container" style={{padding: '40px 0'}}><h2>Loading...</h2></div>;

  return (
    <div className="form-container">
      <form onSubmit={onSubmitHandler} encType="multipart/form-data">
        <h2>Admin: Edit Senior Profile</h2>
        
        {/* ('Avatar' (अवतार) (Avatar (अवतार)) 'Upload' (अपलोड) (अपलोड)) */}
        <div className="form-group" style={{textAlign: 'center'}}>
            <img src={currentAvatar} alt="Avatar" style={{width: '100px', height: '100px', borderRadius: '50%'}} />
            <label>Change Profile Photo</label>
            <input type="file" name="image" onChange={onFileChangeHandler} />
        </div>
        
        {/* ('ID Card' (आईडी कार्ड) (पहचान पत्र) 'Upload' (अपलोड) (अपलोड)) */}
        <div className="form-group" style={{textAlign: 'center', background: '#f4f7f6', padding: '15px', borderRadius: '5px'}}>
            <label>Upload Senior's ID Card (for Verification)</label>
            <input type="file" name="id_card" onChange={onIdCardFileChange} />
            {currentIdCard && (
                <a href={currentIdCard} target="_blank" rel="noopener noreferrer" style={{color: '#1abc9c', fontWeight: 'bold'}}>
                    View College Verified ID Card
                </a>
            )}
        </div>
        
        {/* ('College' (कॉलेज) (कॉलेज) 'Dropdown' (ड्रॉपडाउन) (ड्रॉप-डाउन)) */}
        <div className="form-group">
            <label htmlFor="college">College Name</label>
            <select id="college" name="college" value={formData.college || ''} onChange={onChangeHandler}>
                <option value="" disabled>Select a College</option>
                {allColleges.map(college => (
                    <option key={college._id} value={college._id}>{college.name}</option>
                ))}
            </select>
        </div>
        
        {/* ('Branch' (ब्रांच) (शाखा) 'Input' (इनपुट) (इनपुट)) */}
        <div className="form-group"><label>Branch</label><input type="text" name="branch" value={formData.branch || ''} onChange={onChangeHandler} /></div>
        
        {/* --- (यह रहा 'नया' (New) 'फिक्स' (Fix) (ठीक) #2: 'Year' (इयर) (वर्ष) 'Dropdown' (ड्रॉपडाउन) (ड्रॉप-डाउन)) --- */}
        <div className="form-group">
            <label htmlFor="year">Current Year / Status</label>
            <select id="year" name="year" value={formData.year || ''} onChange={onChangeHandler}>
                <option value="Not Set" disabled>Select Status</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Placed in Company">Placed in Company</option>
            </select>
        </div>
        {/* --- (अपडेट (Update) खत्म) --- */}

        <div className="form-group"><label>Bio</label><textarea name="bio" value={formData.bio || ''} onChange={onChangeHandler} rows="4"></textarea></div>
        
        {/* ('Tags' (टैग्स) (टैग) 'Checkboxes' (चेकबॉक्स) (चेकबॉक्स)) */}
        <div className="form-group">
            <label>Specializations (Tags)</label>
            <div className="tag-checkbox-container">
                {allTags.length > 0 ? allTags.map(tag => (
                    <div className="tag-checkbox" key={tag._id}>
                        <input type="checkbox" id={tag._id} value={tag._id}
                            checked={selectedTags.includes(tag._id)}
                            onChange={onTagChangeHandler}
                        />
                        <label htmlFor={tag._id}>{tag.name}</label>
                    </div>
                )) : <p>No tags created. Go to "Manage Tags".</p>}
            </div>
        </div>

        {/* ('Fees' (फीस) (फीस) 'Section' (सेक्शन) (अनुभाग)) */}
        <h3>Set Fees (Admin Only)</h3>
        <div className="form-group"><label>Price (INR ₹)</label><input type="number" name="price_per_session" value={formData.price_per_session || 0} onChange={onChangeHandler} min="0" /></div>
        <div className="form-group"><label>Duration (minutes)</label><input type="number" name="session_duration_minutes" value={formData.session_duration_minutes || 20} onChange={onChangeHandler} min="1" /></div>
        
        <button type="submit" className="btn btn-primary btn-full">Save Profile</button>
      </form>
    </div>
  );
}
export default AdminEditProfilePage;