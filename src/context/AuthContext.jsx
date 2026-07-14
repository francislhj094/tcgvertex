import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Set up real-time listener on Firestore user document
        const userDocRef = doc(db, 'users', firebaseUser.uid);

        const unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
          const userData = docSnap.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            isPremium: userData?.isPremium || false,
          });
          setLoading(false);
        }, (error) => {
          console.error('Error listening to user document:', error);
          // Set user without premium status if Firestore fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            isPremium: false,
          });
          setLoading(false);
        });

        // Store the cleanup function
        return () => unsubscribeFirestore();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    
    // Automatically attempt to claim any guest purchases made with this email
    try {
      const idToken = await cred.user.getIdToken();
      await fetch('/api/claim-purchase', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
    } catch (e) {
      console.error('Failed to claim guest purchase:', e);
    }

    setUser({
      uid: cred.user.uid,
      email: cred.user.email,
      name: displayName,
    });
    return cred.user;
  };

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    
    // Check for unclaimed purchases
    try {
      const idToken = await cred.user.getIdToken();
      await fetch('/api/claim-purchase', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
    } catch (e) {
      console.error('Failed to claim guest purchase:', e);
    }
    
    return cred.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = { user, loading, signup, login, logout, isPremium: user?.isPremium || false };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
