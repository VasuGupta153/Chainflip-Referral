// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useConnectWallet } from "../utils/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {signer} = useConnectWallet();

  const checkAuthStatus = async () => {
    if (signer) {
      setUser({
        address: signer.address,
        worldIDVerified: false,
        hasSwapped: false
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, [signer]);

  const value = {
    user,
    setUser,
    checkAuthStatus,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);