import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client'; // 1. 'Socket.io' (सॉकेट.आईओ) (Socket.io (सॉकेट.आईओ)) 'Client' (क्लाइंट) (क्लाइंट) 'इम्पोर्ट' (import) (आयात) करें
import toast from 'react-hot-toast';

// 2. ('बैकएंड' (Backend) 'Socket' (सॉकेट) (Socket (सॉकेट)) 'सर्वर' (server) (सर्वर) 'से' (to) 'कनेक्ट' (connect) (कनेक्ट) 'करें' (do))
const socket = io('http://localhost:5000');

function ChatPage() {
    const { bookingId } = useParams();
    const { auth } = useAuth(); // (लॉग-इन' (Logged-in) 'यूज़र' (user) (उपयोगकर्ता))
    
    const [messages, setMessages] = useState([]); // (सभी 'मैसेज' (message) (संदेश) 'की' (of) 'लिस्ट' (list) (सूची))
    const [newMessage, setNewMessage] = useState(''); // (जो 'आप' (you) 'टाइप' (type) (type) 'कर' (doing) 'रहे' (are) 'हैं' (हैं))
    const [bookingInfo, setBookingInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const chatBodyRef = useRef(null); // ('ऑटो-स्क्रॉल' (auto-scroll) (स्वतः स्क्रॉल) 'के लिए' (for))

    // 3. (यह 'पेज' (page) (page) 'लोड' (load) 'होते' (on) 'ही' (as soon as) 'चलेगा' (will run))
    useEffect(() => {
        // 4. (यह 'Socket.io' (सॉकेट.आईओ) (Socket.io (सॉकेट.आईओ)) 'को' (to) 'बताता' (tells) 'है' (it) 'कि' (that) 'हम' (we) 'इस' (this) 'रूम' (room) (कमरे) 'में' (in) 'हैं' (are))
        socket.emit('join_room', bookingId);
        
        // 5. (यह 'बैकएंड' (Backend) 'से' (from) 'नए' (new) 'मैसेज' (message) (संदेश) 'सुनता' (listens) 'है' (it))
        socket.on('receive_message', (newMessageData) => {
            setMessages(prevMessages => [...prevMessages, newMessageData]);
        });

        // (पुराने' (Old) 'मैसेज' (message) (संदेश) 'लोड' (load) (लोड) 'करें' (do))
        const loadChatHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                // 6. (API (एपीआई) 'से' (from) 'पुराने' (old) 'चैट' (chat) (चैट) 'लाएँ' (Fetch))
                const res = await axios.get(`http://localhost:5000/api/chat/${bookingId}`, {
                    headers: { 'x-auth-token': token }
                });
                setMessages(res.data);
                
                // (हम 'Booking' (बुकिंग) 'डेटा' (data) (डेटा) 'भी' (also) 'ला' (fetch) 'रहे' (are) 'हैं' (हैं) 'ताकि' (so that) 'हम' (we) 'Header' (हेडर) (शीर्ष लेख) 'दिखा' (show) 'सकें' (can))
                const bookingRes = await axios.get('http://localhost:5000/api/bookings/student/my', { headers: { 'x-auth-token': token } });
                const foundBooking = bookingRes.data.find(b => b._id === bookingId);
                setBookingInfo(foundBooking);

                setLoading(false);
            } catch (err) {
                toast.error("Failed to load chat history.");
                setLoading(false);
            }
        };
        loadChatHistory();

        // 7. ('कॉम्पोनेंट' (Component) (घटक) 'बंद' (close) 'होने' (on) 'पर' (on) 'क्लीन-अप' (clean-up) (सफ़ाई) 'करें' (do))
        return () => {
            socket.off('receive_message');
        };
    }, [bookingId]);
    
    // (यह 'स्क्रॉल' (scroll) (scroll) 'को' (to) 'नीचे' (bottom) 'रखेगा' (will keep))
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    // 8. (जब 'आप' (you) "Send" (भेजें) 'दबाते' (press) 'हैं' (हैं))
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        // 9. (पक्का (Ensure) (सुनिश्चित) 'करें' (do) 'कि' (that) 'हम' (we) 'जानते' (know) 'हैं' (it) 'कि' (that) 'कौन' (who) 'भेज' (sending) 'रहा' (is) 'है' (है) 'और' (and) 'किसे' (to whom))
        if (!bookingInfo) {
            toast.error("Booking info not loaded yet.");
            return;
        }
        
        const receiverId = (auth.user.id === bookingInfo.student) ? bookingInfo.senior._id : bookingInfo.student;

        // 10. ('मैसेज' (Message) (संदेश) 'Socket.io' (सॉकेट.आईओ) (Socket.io (सॉकेट.आईओ)) 'को' (to) 'भेजें' (Send))
        socket.emit('send_message', {
            booking: bookingId,
            sender: auth.user.id,
            receiver: receiverId,
            text: newMessage
        });
        
        setNewMessage(''); // 'इनपुट' (Input) (इनपुट) 'खाली' (empty) करें
    };

    if (loading) return <div className="container" style={{padding: '40px 0'}}><h2>Loading Chat...</h2></div>;

    return (
        <div className="chat-page-container">
            <div className="chat-window">
                <div className="chat-header">
                    Chat for Booking: {bookingInfo ? (auth.user.role === 'Admin' ? 'Admin View' : (auth.user.id === bookingInfo.student ? bookingInfo.senior.name : bookingInfo.student.name)) : '...'}
                </div>
                <div className="chat-body" ref={chatBodyRef}>
                    {/* (सभी 'मैसेज' (message) (संदेश) 'यहाँ' (here) 'दिखाएँ' (Show)) */}
                    {messages.map((msg) => (
                        <div 
                            key={msg._id} 
                            // ('चेक' (Check) (जाँच) 'करें' (do) 'कि' (that) 'यह' (this) 'मेरा' (my) 'मैसेज' (message) (संदेश) 'है' (is) 'या' (or) 'दूसरे' (other) 'का' (of))
                            className={`message ${msg.sender._id === auth.user.id ? 'sent' : 'received'}`}
                        >
                            <div className="sender-name">{msg.sender.name}</div>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="chat-footer">
                    <form onSubmit={handleSendMessage}>
                        <input 
                            type="text" 
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;