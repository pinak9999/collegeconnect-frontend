import React from 'react';
import { Link } from 'react-router-dom';
import HowItWorks from '../components/HowItWorks'; // 1. ('HowItWorks' (यह कैसे काम करता है) 'इम्पोर्ट' (import) (आयात) करें)
import FeaturedSeniors from '../components/FeaturedSeniors'; // 2. ('FeaturedSeniors' (फीचर्ड सीनियर्स) (चुनिंदा (featured) 'सीनियर्स' (seniors) (सीनियर्स)) 'इम्पोर्ट' (import) (आयात) करें)

// ('Hero' (हीरो) (नायक) 'सेक्शन' (section) (अनुभाग) 'कॉम्पोनेंट' (component) (घटक))
const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <h1>Choose Your Best College in REAP</h1>
        <p className="subtitle">Hostel, Faculty, Placements? Ask a senior from that college directly.</p>
        
        {/* --- (यह रहा 'नया' (New) 'फिक्स' (Fix) (ठीक)) --- */}
        {/* ('बेकार' (Useless) 'Search' (सर्च) (खोज) 'बार' (bar) (बार) 'हटा' (remove) 'दिया' (did) 'गया' (was) 'है' (है)) */}
        <Link 
            to="/register" // ('यह' (This) 'सीधे' (directly) 'Register' (रजिस्टर) 'पेज' (page) (page) 'पर' (on) 'जाएगा' (will go))
            className="btn btn-primary" 
            style={{fontSize: '1.2rem', padding: '12px 25px'}}
        >
            Get Started Now
        </Link>
        {/* --- (अपडेट (Update) खत्म) --- */}

      </div>
    </section>
  );
};

// ('मुख्य' (Main) 'Homepage' (होमपेज) (मुखपृष्ठ) 'पेज' (page) (page))
function HomePage() {
  return (
    <div className="homepage">
      {/* 1. 'Hero' (हीरो) (नायक) 'सेक्शन' (Section) (अनुभाग) */}
      <Hero />
      
      {/* 2. 'नया' (New) 'फीचर' (Feature) (सुविधा): 'Featured Seniors' (फीचर्ड सीनियर्स) (चुनिंदा (featured) 'सीनियर्स' (seniors) (सीनियर्स)) */}
      <FeaturedSeniors />
      
      {/* 3. 'नया' (New) 'फीचर' (Feature) (सुविधा): 'How It Works' (यह कैसे काम करता है) */}
      <HowItWorks />
      
    </div>
  );
}

export default HomePage;