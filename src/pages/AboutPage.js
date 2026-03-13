import React, { useEffect } from 'react';

function AboutPage() {
  // पेज लोड होते ही सबसे ऊपर स्क्रॉल करने के लिए
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '40px 20px',
      fontFamily: "'Poppins', sans-serif",
    },
    card: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    },
    title: {
      fontSize: '2.2rem',
      fontWeight: '800',
      color: '#0f172a',
      marginBottom: '15px',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#3b82f6',
      textAlign: 'center',
      marginBottom: '40px',
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#1e293b',
      marginTop: '35px',
      marginBottom: '15px',
      borderBottom: '2px solid #f1f5f9',
      paddingBottom: '8px',
    },
    text: {
      fontSize: '1rem',
      color: '#475569',
      lineHeight: '1.8',
      marginBottom: '15px',
    },
    highlightBox: {
      backgroundColor: '#f0fdf4',
      borderLeft: '4px solid #22c55e',
      padding: '20px',
      borderRadius: '12px',
      marginTop: '30px',
    },
    gridList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    },
    gridItem: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>About Reap CampusConnect</h1>
        <p style={styles.subtitle}>Empowering Students Through Real Guidance</p>

        <p style={styles.text}>
          Choosing the right college and branch is one of the most critical decisions in a student's life. At <strong>Reap CampusConnect</strong>, we recognized a major gap in the education system: students often rely on biased agents or incomplete internet research to make this life-altering choice.
        </p>
        
        <p style={styles.text}>
          We are an <strong>Educational Technology (EdTech) platform</strong> specifically designed for students participating in the REAP (Rajasthan Engineering Admission Process). Our goal is to bring absolute transparency to college admissions.
        </p>

        <h2 style={styles.sectionTitle}>Our Mission (What We Do)</h2>
        <p style={styles.text}>
          Our mission is simple: <strong>Connect future engineers with current engineering students.</strong> We provide a secure, professional platform where 12th-grade students can book 1-on-1 video/audio counseling sessions with verified alumni and senior students from top engineering colleges across Rajasthan.
        </p>

        <div style={styles.gridList}>
          <div style={styles.gridItem}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '8px' }}>🎓 Authentic Insights</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>Get real reviews about college hostels, faculty, placements, and coding culture directly from the students studying there.</p>
          </div>
          <div style={styles.gridItem}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '8px' }}>🛡️ Verified Mentors</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>Every senior on our platform goes through a strict verification process to ensure they belong to the respective college.</p>
          </div>
          <div style={styles.gridItem}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '8px' }}>💡 Career Counseling</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>Beyond admissions, students get guidance on choosing the right branch (CS, AI, IT) based on their interests and future scope.</p>
          </div>
        </div>

        <div style={styles.highlightBox}>
          <h3 style={{ fontSize: '1.15rem', color: '#166534', margin: '0 0 10px 0' }}>Why We Are Different</h3>
          <p style={{ fontSize: '0.95rem', color: '#15803d', margin: 0, lineHeight: '1.6' }}>
            Unlike generic forums or social platforms, Reap CampusConnect is a dedicated <strong>educational mentorship ecosystem</strong>. We ensure strict professional decorum, secure payment processing, and a zero-tolerance policy for anything outside of academic and career guidance.
          </p>
        </div>

        <h2 style={styles.sectionTitle}>The Vision</h2>
        <p style={styles.text}>
          We envision a future where no student in Rajasthan makes a blind choice about their higher education. By democratizing access to firsthand college experiences, we are building a community where seniors uplift juniors, fostering a stronger and more informed generation of engineers.
        </p>

      </div>
    </div>
  );
}

export default AboutPage;