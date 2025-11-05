import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client'; 
import toast from 'react-hot-toast';

// --- (1. 'यह' (This) 'रहा' (is) 100% 'Accurate' (सही) 'फिक्स' (Fix) (ठीक)) ---
// ('दोनों' (Both) 'URL' (यूआरएल) (URLs (यूआरएल)) 'को' (to) 'एक' (one) 'ही' (same) 'जगह' (place) 'पर' (on) 'डिफाइन' (define) (परिभाषित) 'करें' (do))
const API_URL = 'https://collegeconnect-backend-mrkz.onrender.com';
const SOCKET_URL = 'https://collegeconnect-backend-mrkz.onrender.com';
// --- (अपडेट (Update) खत्म) ---

const socket = io(SOCKET_URL); // ('Socket' (सॉकेट) (Socket (सॉकेट)) 'कनेक्ट' (connect) (कनेक्ट) 'करें' (do))

function ChatPage() {
    const { bookingId } = useParams();
    const { auth } = useAuth(); 
    
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState(''); 
    const [bookingInfo, setBookingInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const chatBodyRef = useRef(null); 

    useEffect(() => {
        socket.emit('join_room', bookingId);
        
        socket.on('receive_message', (newMessageData) => {
            setMessages(prevMessages => [...prevMessages, newMessageData]);
        });

        const loadChatHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // --- (2. 'यह' (This) 'रहा' (is) 100% 'Accurate' (सही) 'फिक्स' (Fix) (ठीक)) ---
                // ('`localhost`' (लोकलहोस्ट) (localhost) 'की' (of) 'जगह' (place) '`API_URL`' (एपीआई_यूआरएल) (API_URL) 'का' (of) 'इस्तेमाल' (use) 'करें' (do))
                const res = await axios.get(`${API_URL}/api/chat/${bookingId}`, {
                    headers: { 'x-auth-token': token }
                });
                setMessages(res.data);
                
                // ('`localhost`' (लोकलहोस्ट) (localhost) 'की' (of) 'जगह' (place) '`API_URL`' (एपीआई_यूआरएल) (API_URL) 'का' (of) 'इस्तेमाल' (use) 'करें' (do))
                // ('`Student`' (छात्र) (Student (छात्र)) 'और' (and) '`Senior`' (सीनियर) (Senior (सीनियर)) 'दोनों' (both) 'को' (to) 'सपोर्ट' (support) (समर्थन) 'करने' (to do) 'के लिए' (for) 'लॉजिक' (logic) (तर्क) 'बदलें' (Change))
                let bookingDataUrl = auth.user.isSenior 
                    ? `${API_URL}/api/bookings/senior/my` 
                    : `${API_URL}/api/bookings/student/my`;
                    
                const bookingRes = await axios.get(bookingDataUrl, { headers: { 'x-auth-token': token } });
                // --- (अपडेट (Update) खत्म) ---

                const foundBooking = bookingRes.data.find(b => b._id === bookingId);
                if (foundBooking) {
                    setBookingInfo(foundBooking);
                } else {
                    toast.error("Could not find booking details.");
                }

                setLoading(false);
            } catch (err) {
                toast.error("Failed to load chat history.");
                setLoading(false);
            }
        };
        loadChatHistory();

        return () => {
            socket.off('receive_message');
        };
    }, [bookingId, auth.user.isSenior, auth.user.id]); // ('auth' (ऑथ) (auth) 'डिपेंडेंसी' (dependency) (निर्भरता) 'जोड़ें' (Add))
    
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        if (!bookingInfo) {
            toast.error("Booking info not loaded yet.");
            return;
        }
        
        // ('रिसीवर' (Receiver) (रिसीवर) 'को' (to) 'सही' (correctly) 'ढूँढें' (Find))
        const receiverId = auth.user.id === (bookingInfo.student._id || bookingInfo.student) 
            ? (bookingInfo.senior._id || bookingInfo.senior) 
            : (bookingInfo.student._id || bookingInfo.student);

        socket.emit('send_message', {
            booking: bookingId,
            sender: auth.user.id,
            receiver: receiverId,
            text: newMessage
        });
        
        setNewMessage(''); 
    };

    if (loading) return <div className="container" style={{padding: '40px 0'}}><h2>Loading Chat...</h2></div>;

    // ('चैट' (Chat) (चैट) 'हेडर' (header) (शीर्ष लेख) 'को' (to) 'और' (more) 'स्मार्ट' (smart) (स्मार्ट) 'बनाएँ' (Make))
    const getChatHeader = () => {
        if (!bookingInfo) return '...';
        if (auth.user.role === 'Admin') return 'Admin View';
        
        // ('Student' (छात्र) (Student (छात्र)) 'के लिए' (for) 'Senior' (सीनियर) (सीनियर) 'का' (of) 'नाम' (name) (नाम) 'दिखाएँ' (Show))
        if (auth.user.id === (bookingInfo.student._id || bookingInfo.student)) {
            return `Chat with ${bookingInfo.senior.name}`;
        }
        // ('Senior' (सीनियर) (सीनियर) 'के लिए' (for) 'Student' (छात्र) (छात्र) 'का' (of) 'नाम' (name) (नाम) 'दिखाएँ' (Show))
        if (auth.user.id === (bookingInfo.senior._id || bookingInfo.senior)) {
            return `Chat with ${bookingInfo.student.name}`;
        }
        return 'Chat Room';
    };

    return (
        <div className="chat-page-container">
            <div className="chat-window">
                <div className="chat-header">
                    {getChatHeader()}
                </div>
                <div className="chat-body" ref={chatBodyRef}>
                    {messages.map((msg, index) => (
                        <div 
                            key={msg._id || `msg-${index}`} 
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