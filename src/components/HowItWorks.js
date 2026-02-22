import React from 'react';
import './HowItWorks.css'; // आपकी अपडेटेड डार्क थीम वाली CSS यहीं से लोड होगी

function HowItWorks() {
  return (
    // हमने मेन हेडिंग HomePage.jsx में दे दी है, इसलिए यहाँ से हटा दी गई है 
    <section className="how-it-works" style={{ paddingTop: '10px' }}>
      <div className="container">
        <div className="steps-grid">
          
          {/* स्टेप 1 */}
          <div className="step">
            <div className="step-icon">1</div>
            <h3>Find a Senior</h3>
            <p>Choose a senior from your desired college and branch.</p>
          </div>

          {/* स्टेप 2 */}
          <div className="step">
            <div className="step-icon">2</div>
            <h3>Book a Slot</h3>
            <p>
              Book a 1-on-1 call or chat slot according to your schedule. After booking, our senior will contact you within 6 hours.
              If not contacted within 6 hours, you can press the <span className="dispute-text">“Dispute”</span> button to raise a complaint.
            </p>
          </div>

          {/* स्टेप 3 */}
          <div className="step">
            <div className="step-icon">3</div>
            <h3>Get Insights</h3>
            <p>Connect with the senior and learn everything about the college.</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;