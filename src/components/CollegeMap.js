// src/components/CollegeMap.js

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { colleges } from "./colleges"; // हमारा डेटा
import L from "leaflet"; // آئکن کی समस्या को ठीक करने के लिए

// Leaflet के डिफ़ॉल्ट آئکن को ठीक करना
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function CollegeMap() {
  const rajasthanCenter = [26.9124, 75.7873]; // जयपुर का सेंटर

  return (
    <div style={{ 
      border: "2px solid #007BFF", 
      borderRadius: "16px", 
      overflow: "hidden", 
      boxShadow: "0 10px 30px rgba(0,123,255,0.2)" 
    }}>
      <MapContainer
        center={rajasthanCenter}
        zoom={7} // ज़ूम लेवल ताकि पूरा राजस्थान दिखे
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* सभी कॉलेजों के लिए मार्कर बनाना */}
        {colleges.map((college) => (
          <Marker position={college.coords} key={college.name}>
            <Popup>
              <div style={{ textAlign: 'center', fontFamily: "'Poppins', sans-serif" }}>
                <h4 style={{ margin: '5px 0', color: '#007BFF' }}>{college.name}</h4>
                <p style={{ margin: 0 }}>{college.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CollegeMap;