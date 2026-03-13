import React, { useEffect } from 'react';

function RefundPage() {
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
        <h1 style={styles.title}>Refund & Cancellation Policy</h1>
        <p style={styles.lastUpdated}>Last Updated: March 2026</p>

        <p style={styles.text}>
          At <strong>Reap CampusConnect</strong>, we are committed to providing genuine educational guidance and mentorship to our students. We ensure a transparent and fair process for cancellations and refunds.
        </p>

        <h2 style={styles.sectionTitle}>1. Cancellation Policy</h2>
        <ul style={styles.list}>
          <li><strong>By Student:</strong> Students can cancel their booked counseling session up to <strong>24 hours</strong> before the scheduled time to be eligible for a full refund.</li>
          <li><strong>Late Cancellations:</strong> Cancellations made within 24 hours of the scheduled session time will not be eligible for a refund, as the mentor's time has already been reserved.</li>
          <li><strong>By Mentor:</strong> If a mentor cancels the session due to unforeseen circumstances, the student will be given the option to reschedule or receive a 100% full refund.</li>
        </ul>

        <h2 style={styles.sectionTitle}>2. Refund Policy</h2>
        <p style={styles.text}>
          Refunds are applicable under the following conditions:
        </p>
        <ul style={styles.list}>
          <li>The session was canceled by the student at least 24 hours in advance.</li>
          <li>The mentor failed to join the scheduled session (No-show by mentor).</li>
          <li>Technical glitches from our platform prevented the session from taking place.</li>
        </ul>

        <h2 style={styles.sectionTitle}>3. Non-Refundable Scenarios</h2>
        <ul style={styles.list}>
          <li>If the student fails to join the session at the scheduled time (No-show by student).</li>
          <li>If the student claims dissatisfaction with the guidance provided (as mentorship is subjective and based on the senior's personal experience).</li>
        </ul>

        <h2 style={styles.sectionTitle}>4. Refund Processing Time</h2>
        <p style={styles.text}>
          Once a refund request is approved, the amount will be credited back to the original payment method (Credit/Debit Card, UPI, Net Banking) within <strong>5 to 7 business days</strong>.
        </p>

        <div style={styles.contactBox}>
          <h3 style={{ fontSize: '1.1rem', color: '#0369a1', marginBottom: '10px' }}>Need Help with a Refund?</h3>
          <p style={{ color: '#0c4a6e', margin: 0, lineHeight: '1.5' }}>
            To raise a dispute or request a refund, please contact us at:<br/>
            <strong>Email:</strong> davepinak0@gmail.com<br/>
            <strong>Phone:</strong> +91 7665054856<br/>
            <strong>Response Time:</strong> 24-48 Working Hours
          </p>
        </div>

      </div>
    </div>
  );
}

export default RefundPage;