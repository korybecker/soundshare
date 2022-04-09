import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";

import { getFirestore, updateDoc, doc } from "firebase/firestore";

import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const handleUpdateEmail = (email) => {
    return updateEmail(currentUser, email);
  };

  const handleUpdatePassword = (password) => {
    return updatePassword(currentUser, password);
  };

  const handleUpdateUser = (bio, username) => {
    const db = getFirestore();
    const userRef = doc(db, "users", currentUser.uid);
    return updateDoc(userRef, { bio, username });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    handleUpdateEmail,
    handleUpdatePassword,
    handleUpdateUser,
  };

  return (
    // render app only if user exists (loading is false)
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
