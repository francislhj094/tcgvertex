import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const getDeveloperKey = async (userId) => {
  try {
    const docRef = doc(db, 'apiKeys', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
};

export const generateDeveloperKey = async (userId) => {
  try {
    // Generate a simple random key
    const rawKey = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    const apiKey = `tcg_${rawKey}`;
    
    const docRef = doc(db, 'apiKeys', userId);
    const keyData = {
      apiKey,
      createdAt: serverTimestamp(),
      userId,
      usageCount: 0
    };
    
    await setDoc(docRef, keyData);
    return keyData;
  } catch (error) {
    console.error('Error generating API key:', error);
    throw error;
  }
};
