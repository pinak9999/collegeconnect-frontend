import React from 'react';
import './HowItWorks.css';

function HowItWorks() {
  return (
    <section className="how-it-works-premium">
      <div className="container">
       

        {/* Steps Grid */}
        <div className="steps-wrapper">
          {/* Step 1 */}
          <div className="step-card card-yellow">
            <div className="step-badge">1</div>
            <div className="step-image-placeholder">
              {/* यहाँ आप अपनी स्टेप 1 की इमेज या इलस्ट्रेशन लगा सकते हैं */}
             <img src="\step2.png" alt="Find a Senior" />
            </div>
            <h3>Find a Senior</h3>
            <p className="step-desc">
              Choose a senior from your desired college and branch.
            </p>
            <ul className="step-list">
              <li><span className="check-icon">✔</span> Select College & Branch</li>
              <li><span className="check-icon">✔</span> Verified Seniors Only</li>
            </ul>
          </div>

          {/* Connector Arrow 1 */}
          <div className="connector connector-1"></div>

          {/* Step 2 */}
          <div className="step-card card-blue">
            <div className="step-badge">2</div>
            <div className="step-image-placeholder">
              {/* यहाँ आप अपनी स्टेप 2 की इमेज लगा सकते हैं */}
              <img src="  \step3.png" alt="Book a Slot" />
            </div>
            <h3>Book a Slot</h3>
            <p className="step-desc">
              Book a 1-on-1 call or chat slot according to your schedule. After booking, our senior will contact you within 6 hours.
              If not contacted within 6 hours, you can press the{' '}
              <span style={{ color: "#e63946", fontWeight: "bold", fontSize: "17px" }}>
                “Dispute”
              </span>{' '}
              button to raise a complaint.
            </p>
            <ul className="step-list">
              <li><span className="check-icon">✔</span> Pick Date & Time</li>
              <li><span className="check-icon">✔</span> Instant Confirmation</li>
            </ul>
          </div>

          {/* Connector Arrow 2 */}
          <div className="connector connector-2"></div>

          {/* Step 3 */}
          <div className="step-card card-purple">
            <div className="step-badge">3</div>
            <div className="step-image-placeholder">
              {/* यहाँ आप अपनी स्टेप 3 की इमेज लगा सकते हैं */}
              <img src="\step4.png" alt="Get Insights" />
            </div>
            <h3>Get Insights</h3>
            <p className="step-desc">
              Connect with the senior and learn everything about the college.
            </p>
            <ul className="step-list">
              <li><span className="check-icon">✔</span> Ask Questions</li>
              <li><span className="check-icon">✔</span> Get Honest Advice</li>
            </ul>
          </div>
        </div>

        {/* Bottom Features Bar */}
        <div className="features-bottom-bar">
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <span>100% Safe & Verified</span>
          </div>
          <div className="feature-divider"></div>
          <div className="feature-item">
            <span className="feature-icon">📅</span>
            <span>Instant Booking</span>
          </div>
          <div className="feature-divider"></div>
          <div className="feature-item">
            <span className="feature-icon">📞</span>
            <span>Direct Call/Chat</span>
          </div>
          <div className="feature-divider"></div>
          <div className="feature-item">
            <span className="feature-icon">🎓</span>
            <span>Expert Guidance</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;