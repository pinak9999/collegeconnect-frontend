import React, { useEffect } from 'react';

function TermsPage() {
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
        <h1 style={styles.title}>Terms & Conditions</h1>
        <p style={styles.lastUpdated}>Effective Date: March 2026</p>

        <p style={styles.text}>
          Welcome to <strong>Reap CampusConnect</strong>. By accessing or using our website and services, you agree to comply with and be bound by the following Terms & Conditions.
        </p>

        {/* 🚀 Razorpay Magic Clause: EdTech Proof */}
        <h2 style={styles.sectionTitle}>1. Nature of Business (Educational Services)</h2>
        <p style={styles.text}>
          Reap CampusConnect is strictly an <strong>Educational Technology (EdTech) and Career Counseling platform</strong>. We facilitate 1-on-1 academic mentorship sessions between high school students and university alumni. 
          <br/><br/>
          <strong>Disclaimer:</strong> We are NOT a social networking, dating, or matchmaking platform. The platform is designed solely for professional educational guidance, college admission queries, and career path discussions.
        </p>

        <h2 style={styles.sectionTitle}>2. User Accounts & Registration</h2>
        <ul style={styles.list}>
          <li>Users must provide accurate, current, and complete information during the registration process.</li>
          <li>You are responsible for safeguarding your account password and all activities that occur under your account.</li>
          <li>Mentors (Seniors) must be verified students or alumni of the respective colleges they represent.</li>
        </ul>

        <h2 style={styles.sectionTitle}>3. Payments, Fees, and Taxes</h2>
        <ul style={styles.list}>
          <li>Students must pay the standard consultation fee upfront to book a counseling session with a mentor.</li>
          <li>All payments are processed securely through our third-party payment gateway (Razorpay).</li>
          <li>Reap CampusConnect deducts a standard platform fee from the session amount before transferring the earnings to the mentor.</li>
        </ul>

        <h2 style={styles.sectionTitle}>4. Code of Conduct</h2>
        <p style={styles.text}>
          During video or audio counseling sessions, both students and mentors are expected to maintain strict professional decorum. Any form of harassment, abuse, sharing of inappropriate content, or using the platform for non-educational purposes will result in an immediate and permanent ban from the platform without any refund.
        </p>

        <h2 style={styles.sectionTitle}>5. Limitation of Liability</h2>
        <p style={styles.text}>
          The advice and guidance provided by the mentors (seniors) are based on their personal experiences and opinions. Reap CampusConnect does not guarantee college admissions, placements, or academic success based on these counseling sessions. The platform acts solely as a facilitator for educational communication.
        </p>

        <div style={styles.contactBox}>
          <h3 style={{ fontSize: '1.1rem', color: '#0369a1', marginBottom: '10px' }}>Contact Information</h3>
          <p style={{ color: '#0c4a6e', margin: 0, lineHeight: '1.5' }}>
            If you have any questions or concerns regarding these terms, please contact us:<br/>
            <strong>Email:</strong> davepinak0@gmail.com<br/>
            <strong>Phone:</strong> +91 7665054856<br/>
            <strong>Address:</strong> Jaipur, Rajasthan, India
          </p>
        </div>

      </div>
    </div>
  );
}

export default TermsPage;