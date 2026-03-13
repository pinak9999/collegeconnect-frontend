import React, { useEffect } from 'react';

function ContactPage() {
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
      fontSize: '2rem',
      fontWeight: '700',
      color: '#0f172a',
      marginBottom: '10px',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: '1rem',
      color: '#64748b',
      textAlign: 'center',
      marginBottom: '40px',
      lineHeight: '1.5',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px',
    },
    infoBox: {
      backgroundColor: '#f1f5f9',
      padding: '24px',
      borderRadius: '12px',
      textAlign: 'center',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.3s ease',
    },
    icon: {
      fontSize: '2rem',
      marginBottom: '15px',
      display: 'block',
    },
    boxTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '10px',
    },
    boxText: {
      fontSize: '0.95rem',
      color: '#475569',
      lineHeight: '1.5',
      margin: '0',
    },
    bottomSection: {
      marginTop: '40px',
      paddingTop: '30px',
      borderTop: '1px solid #f1f5f9',
      textAlign: 'center',
    },
    supportText: {
      fontSize: '0.95rem',
      color: '#64748b',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Contact Us</h1>
        <p style={styles.subtitle}>
          Have a question about booking a session, becoming a mentor, or anything else? <br/>
          Our team is here to help you!
        </p>

        <div style={styles.grid}>
          {/* Email Support */}
          <div style={styles.infoBox} className="contact-hover">
            <span style={styles.icon}>📧</span>
            <h3 style={styles.boxTitle}>Email Support</h3>
            <p style={styles.boxText}>
              Drop us an email and we'll get back to you within 24 hours.
              <br/><br/>
              <strong>davepinak0@gmail.com</strong>
            </p>
          </div>

          {/* Phone Support */}
          <div style={styles.infoBox} className="contact-hover">
            <span style={styles.icon}>📞</span>
            <h3 style={styles.boxTitle}>Phone Support</h3>
            <p style={styles.boxText}>
              Available for urgent queries from 10:00 AM to 6:00 PM (Mon-Sat).
              <br/><br/>
              <strong>+91 7665054856</strong>
            </p>
          </div>

          {/* Office Address */}
          <div style={styles.infoBox} className="contact-hover">
            <span style={styles.icon}>🏢</span>
            <h3 style={styles.boxTitle}>Office Address</h3>
            <p style={styles.boxText}>
              Reap CampusConnect HQ
              <br/>
              Jaipur, Rajasthan, India
            </p>
          </div>
        </div>

        <div style={styles.bottomSection}>
          <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '10px' }}>Business Hours</h2>
          <p style={styles.supportText}>
            <strong>Monday - Saturday:</strong> 10:00 AM - 6:00 PM IST<br/>
            <strong>Sunday:</strong> Closed (Emails will be answered on Monday)
          </p>
        </div>

      </div>
    </div>
  );
}

export default ContactPage;