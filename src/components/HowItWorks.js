import React from 'react';
import './HowItWorks.css';
function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="container">
        <h2>In 3 Easy Steps</h2>
        <div className="steps-grid">
          {/* स्टेप 1 */}
          <div className="step">
            <div className="step-icon">1</div>
            <h3>Find a Senior</h3>
            <p>Choose a senior from your desired college and branch.</p>
          </div>
   <div className="step">
  <div className="step-icon">2</div>
  <h3>Book a Slot</h3>

  <p>
    Book a 1-on-1 call or chat slot according to your schedule. After booking, our senior will contact you within 6 hours.
    If not contacted within 6 hours, you can press the   
    <span style={{ color: "#e63946", fontWeight: "bold", fontSize: "17px" }}>
      “Dispute”
    </span> 
      button to raise a complaint.
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