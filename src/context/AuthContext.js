import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. "बक्सा" (Context (कॉन्टेक्स्ट)) बनाएँ
const AuthContext = createContext(null);

// 2. "प्रोवाइडर" (Provider) बनाएँ (जो 'डेटा' (data) 'सप्लाई' (supply) (आपूर्ति) करेगा)
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    user: null,
    isAuthenticated: false,
    loading: true // (शुरू में 'लोड' (load) हो रहा है)
  });

  // (यह 'ऐप' (app) 'लोड' (load) होते ही 'यूज़र' (user) को 'चेक' (check) (जाँच) करेगा)
  useEffect(() => {
    const userItem = localStorage.getItem('user');
    const tokenItem = localStorage.getItem('token');
    
    if (userItem && tokenItem) {
      try {
        setAuth({
          token: tokenItem,
          user: JSON.parse(userItem),
          isAuthenticated: true,
          loading: false
        });
      } catch (error) {
        // (अगर 'localStorage' (लोकल स्टोरेज) (लोकल स्टोरेज) 'करप्ट' (corrupt) (भ्रष्ट) है)
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuth({ token: null, user: null, isAuthenticated: false, loading: false });
      }
    } else {
      setAuth({ token: null, user: null, isAuthenticated: false, loading: false });
    }
  }, []); // [] = सिर्फ एक बार चलो

  // 3. 'लॉगिन' (Login) 'फंक्शन' (function) (जो 'LoginPage' (लॉगिन पेज) 'इस्तेमाल' (use) करेगा)
  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({
      token: token,
      user: user,
      isAuthenticated: true,
      loading: false
    });
  };

  // 4. 'लॉगआउट' (Logout) 'फंक्शन' (function) (जो 'Navbar' (नेवबार) 'इस्तेमाल' (use) करेगा)
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false
    });
  };

  // 5. 'बक्से' (box) की 'वैल्यू' (value) (मान) 'भेजें' (Send)
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};

// 6. (यह 'Hook' (हुक) 'दूसरे' (other) 'कॉम्पोनेंट्स' (components) (घटकों) को 'बक्से' (box) का 'इस्तेमाल' (use) 'करने' (to do) 'देगा' (will allow))
export const useAuth = () => {
    return useContext(AuthContext);
};