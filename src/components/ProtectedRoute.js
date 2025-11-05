import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. 'Context' (कॉन्टेक्स्ट) (बक्सा) 'इम्पोर्ट' (import) करें

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth(); // 2. 'Context' (कॉन्टेक्स्ट) (बक्से) से 'auth' (ऑथ) 'स्टेट' (state) (स्थिति) 'लें' (Get)

  if (auth.loading) {
    // (अगर 'हम' (we) 'अभी' (still) 'चेक' (check) (जाँच) 'कर' (doing) 'रहे' (are) 'हैं' (हैं), 'तो' (then) 'रुको' (wait))
    return <h2>Loading...</h2>; 
  }
  
  if (!auth.isAuthenticated) {
    // 3. (अगर 'लॉगिन' (login) 'नहीं' (not) 'है' (is), 'तो' (then) 'वापस' (back) 'भेजें' (send))
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
export default ProtectedRoute;