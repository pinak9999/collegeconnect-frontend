import React, { useEffect } from 'react';

function PrivacyPage() {
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
    lastUpdated: {
      fontSize: '0.9rem',
      color: '#64748b',
      textAlign: 'center',
      marginBottom: '40px',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      marginTop: '30px',
      marginBottom: '15px',
      borderBottom: '2px solid #f1f5f9',
      paddingBottom: '8px',
    },
    text: {
      fontSize: '1rem',
      color: '#475569',
      lineHeight: '1.7',
      marginBottom: '15px',
    },
    list: {
      marginLeft: '20px',
      marginBottom: '15px',
      color: '#475569',
      lineHeight: '1.7',
    },
    contactBox: {
      marginTop: '40px',
      backgroundColor: '#f0f9ff',
      padding: '20px',
      borderRadius: '12px',
      borderLeft: '4px solid #0ea5e9',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Privacy Policy</h1>
        <p style={styles.lastUpdated}>Effective Date: March 2026</p>

        <p style={styles.text}>
          At <strong>Reap CampusConnect</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our educational counseling platform.
        </p>

        <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
        <ul style={styles.list}>
          <li><strong>Personal Information:</strong> Name, email address, phone number, and college details provided during registration.</li>
          <li><strong>Profile Data:</strong> For mentors (seniors), we collect academic details, college ID cards (for verification), and profile pictures.</li>
          <li><strong>Session Data:</strong> Booking history, ratings, and reviews given for the counseling sessions.</li>
        </ul>

        <h2 style={styles.sectionTitle}>2. How We Use Your Information</h2>
        <ul style={styles.list}>
          <li>To facilitate and schedule 1-on-1 educational counseling sessions between students and mentors.</li>
          <li>To send you transactional emails, such as booking confirmations, OTPs, and password resets.</li>
          <li>To maintain platform security and prevent fraudulent activities.</li>
        </ul>

        {/* 🚀 Razorpay Magic Clause: Payment Security */}
        <h2 style={styles.sectionTitle}>3. Payment Processing & Security</h2>
        <p style={styles.text}>
          We do NOT store your credit/debit card details, net banking credentials, or UPI PINs on our servers. All payment transactions are securely processed through our authorized payment gateway partner (<strong>Razorpay</strong>), which uses industry-standard encryption to protect your financial data.
        </p>

        <h2 style={styles.sectionTitle}>4. Data Sharing & Disclosure</h2>
        <p style={styles.text}>
          <strong>We do not sell, rent, or trade your personal information to third parties.</strong> Your information is only shared in the following scenarios:
        </p>
        <ul style={styles.list}>
          <li><strong>With Mentors/Students:</strong> Only necessary details (like display name and college) are shared between the student and mentor to facilitate the counseling session.</li>
          <li><strong>Legal Requirements:</strong> If required by law, court order, or government authority to comply with legal processes.</li>
        </ul>

        <h2 style={styles.sectionTitle}>5. Video & Audio Session Privacy</h2>
        <p style={styles.text}>
          The 1-on-1 video/audio counseling sessions are private communications between the student and the mentor. We do not actively record or monitor these sessions unless a specific dispute is raised by either party, in which case logs may be reviewed for safety and compliance purposes.
        </p>

        <div style={styles.contactBox}>
          <h3 style={{ fontSize: '1.1rem', color: '#0369a1', marginBottom: '10px' }}>Privacy Concerns?</h3>
          <p style={{ color: '#0c4a6e', margin: 0, lineHeight: '1.5' }}>
            If you have any questions regarding how we handle your data, please reach out to our privacy team:<br/>
            <strong>Email:</strong> davepinak0@gmail.com<br/>
            <strong>Phone:</strong> +91 7665054856
          </p>
        </div>

      </div>
    </div>
  );
}

export default PrivacyPage;