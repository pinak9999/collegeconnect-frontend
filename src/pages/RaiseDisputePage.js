import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const palette = {
  primary: "#2563EB",
  primaryDark: "#1E40AF",
  text: "#0F172A",
  subtext: "#475569",
  glass: "rgba(255,255,255,0.85)",
  danger: "#EF4444",
};

const RaiseDisputePage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  // यहाँ से TypeScript का <{_id...}> टाइप हटा दिया गया है
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://collegeconnect-backend-mrkz.onrender.com/api/disputes/reasons", {
            headers: { "x-auth-token": token }
        });
        setReasons(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dispute reasons.");
      } finally {
        setFetching(false);
      }
    };
    fetchReasons();
  }, []);

  // यहाँ से (e: React.FormEvent) हटाकर सिर्फ (e) कर दिया गया है
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReason) {
        toast.error("Please select a reason");
        return;
    }

    setLoading(true);
    const t = toast.loading("Submitting dispute...");
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://collegeconnect-backend-mrkz.onrender.com/api/disputes/raise/${bookingId}`,
        {
            reasonId: selectedReason,
            comment: comment
        },
        { headers: { "x-auth-token": token } }
      );
      
      toast.dismiss(t);
      toast.success("Dispute raised successfully.");
      navigate("/student-dashboard"); 
    } catch (err) { // यहाँ से : any हटा दिया गया है
      toast.dismiss(t);
      console.error(err);
      // Optional chaining (?.) का उपयोग सुरक्षित रहता है
      toast.error(err.response?.data?.msg || "Failed to raise dispute");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F0F9FF 0%, #F1F5F9 100%)",
        padding: 20,
        fontFamily: "'Poppins', sans-serif",
    }}>
        <div style={{
            width: "100%",
            maxWidth: 500,
            background: palette.glass,
            borderRadius: 24,
            padding: 32,
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.6)"
        }}>
            <h2 style={{ textAlign: "center", color: palette.text, marginBottom: 24, fontSize: "1.8rem", fontWeight: 800 }}>
                Raise a Dispute ⚠️
            </h2>
            
            {fetching ? (
                <p style={{textAlign: 'center', color: palette.subtext}}>Loading reasons...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: palette.subtext }}>
                            Select Reason
                        </label>
                        <select
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: 12,
                                border: "1px solid #cbd5e1",
                                fontSize: 15,
                                outline: "none",
                                background: "#fff",
                                color: palette.text
                            }}
                            value={selectedReason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            required
                        >
                            <option value="">-- Choose a reason --</option>
                            {reasons.map(r => (
                                <option key={r._id} value={r._id}>{r.reason}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: palette.subtext }}>
                            Additional Details (Optional)
                        </label>
                        <textarea
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: 12,
                                border: "1px solid #cbd5e1",
                                fontSize: 15,
                                minHeight: 120,
                                outline: "none",
                                resize: "vertical"
                            }}
                            placeholder="Describe the issue..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            style={{
                                flex: 1,
                                padding: 14,
                                borderRadius: 12,
                                border: "none",
                                background: "#e2e8f0",
                                color: palette.text,
                                fontWeight: 700,
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: 14,
                                borderRadius: 12,
                                border: "none",
                                background: palette.danger,
                                color: "#fff",
                                fontWeight: 700,
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1,
                                boxShadow: "0 4px 12px rgba(239,68,68,0.3)"
                            }}
                        >
                            {loading ? "Submitting..." : "Submit Dispute"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    </div>
  );
};

export default RaiseDisputePage;