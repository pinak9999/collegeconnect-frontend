import React from 'react';
import { Link } from 'react-router-dom';

function BookingSuccessPage() {
    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '60vh', textAlign: 'center' }}>
            
            <h2 style={{color: 'green', fontSize: '2.5rem', marginBottom: '20px'}}>
                Booking Confirmed!
            </h2>
            
            {/* --- (यह रहा आपका 'नया' (New) 'मैसेज' (Message)) --- */}
            <p style={{ fontSize: '1.3rem', fontWeight: '600', color: '#333' }}>
                The Senior will contact you within 6 hours.
            </p>
            <p>
                (कृपया अपनी 'My Bookings' (मेरी बुकिंग्स) 'सेक्शन' (section) (जो 'Student Dashboard' (छात्र डैशबोर्ड) पर है) को 'चेक' (check) करते रहें)
            </p>
            {/* --- अपडेट (Update) खत्म --- */}
            
            <Link to="/student-dashboard" className="btn btn-primary" style={{marginTop: '30px', fontSize: '1rem'}}>
                Back to Dashboard
            </Link>
        </div>
    );
}

export default BookingSuccessPage;