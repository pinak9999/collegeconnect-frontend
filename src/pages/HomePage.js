import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import HowItWorks from "../components/HowItWorks";
import FeaturedSeniors from "../components/FeaturedSeniors";

function HomePage() {
  useEffect(() => {
    const fadeElements = document.querySelectorAll(".fade-in-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.2 }
    );
    fadeElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f9fbfd",
        color: "#333",
        overflowX: "hidden",
      }}
    >
      {/* 🌟 HERO SECTION */}
      <section
        style={{
          background: "linear-gradient(135deg, #007BFF, #00B4D8)",
          color: "white",
          textAlign: "center",
          padding: "100px 20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Motion Blob */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            animation: "floatBlob 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-40px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            animation: "floatBlob 10s ease-in-out infinite",
          }}
        />
        <style>
          {`
            @keyframes floatBlob {
              0%,100% { transform: translateY(0); }
              50% { transform: translateY(-30px); }
            }
          `}
        </style>

        <div
          className="fade-in-up"
          style={{
            opacity: 0,
            transform: "translateY(40px)",
            transition: "all 1s ease",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1
            style={{
              fontSize: "2.8rem",
              fontWeight: "800",
              marginBottom: "10px",
              lineHeight: "1.3",
            }}
          >
            🎓 Choose Your Best College in REAP
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "rgba(255,255,255,0.9)",
              marginBottom: "40px",
              lineHeight: "1.5",
            }}
          >
            Hostel, Faculty, Placements? <br /> Ask a senior from that college
            directly.
          </p>
          <Link
            to="/register"
            style={{
              background: "#fff",
              color: "#007BFF",
              fontWeight: "600",
              padding: "14px 35px",
              borderRadius: "50px",
              fontSize: "1.1rem",
              textDecoration: "none",
              boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
              transition: "0.3s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            🚀 Get Started Now
          </Link>
        </div>
      </section>

      {/* ⭐ FEATURED SENIORS */}
      <section
        className="fade-in-up"
        style={{
          padding: "80px 20px",
          textAlign: "center",
          backgroundColor: "#fff",
          opacity: 0,
          transform: "translateY(40px)",
          transition: "all 1s ease",
        }}
      >
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: "700",
            color: "#007BFF",
            marginBottom: "15px",
          }}
        >
          ⭐ Featured Seniors
        </h2>
        <p style={{ color: "#555", marginBottom: "40px", fontSize: "1.05rem" }}>
          Get insights from real students who’ve experienced your dream college.
        </p>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <FeaturedSeniors />
        </div>
      </section>

      {/* 💡 HOW IT WORKS */}
      <section
        className="fade-in-up"
        style={{
          padding: "80px 20px",
          backgroundColor: "#f0f6ff",
          textAlign: "center",
          opacity: 0,
          transform: "translateY(40px)",
          transition: "all 1s ease",
        }}
      >
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: "700",
            color: "#007BFF",
            marginBottom: "20px",
          }}
        >
          💡 How It Works
        </h2>
        <p
          style={{
            color: "#555",
            fontSize: "1rem",
            maxWidth: "700px",
            margin: "0 auto 50px",
            lineHeight: "1.6",
          }}
        >
          Just register, choose your preferred senior, and book a call. Real
          advice. Real students. Real experiences.
        </p>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <HowItWorks />
        </div>
      </section>

      {/* 🌠 CALL TO ACTION */}
      <section
        className="fade-in-up"
        style={{
          background: "linear-gradient(135deg, #007BFF, #00B4D8)",
          color: "#fff",
          textAlign: "center",
          padding: "80px 20px",
          opacity: 0,
          transform: "translateY(40px)",
          transition: "all 1s ease",
        }}
      >
        <h2 style={{ fontSize: "1.9rem", fontWeight: "600", marginBottom: "25px" }}>
          Your college journey starts with the right guidance 🌟
        </h2>
        <Link
          to="/register"
          style={{
            background: "#fff",
            color: "#007BFF",
            fontWeight: "600",
            padding: "14px 35px",
            borderRadius: "50px",
            fontSize: "1.1rem",
            textDecoration: "none",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Join Now
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
