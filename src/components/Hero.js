import React from 'react';

function Hero() {
  return (
    <header className="hero">
      <div className="container">
        <h1>Choose Your Best College in REAP</h1>
        <p className="subtitle">Hostel, Faculty, Placements? Ask a senior from that college directly.</p>
        <div className="search-box">
          <input type="text" placeholder="Enter college name or branch..." />
          <button className="btn btn-primary">Search</button>
        </div>
      </div>
    </header>
  );
}

export default Hero; // <-- क्या यह 'export default Hero;' लाइन मौजूद है?