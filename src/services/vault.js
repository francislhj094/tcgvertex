// Vault Storage Service — Firestore when logged in, localStorage as fallback
import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, collection, query, where, getDocs } from 'firebase/firestore';

const VAULT_KEY = 'tcg_vault_cards';

// ---- localStorage fallback ----
const getLocalVault = () => {
  try {
    const data = localStorage.getItem(VAULT_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

const setLocalVault = (ids) => {
  localStorage.setItem(VAULT_KEY, JSON.stringify(ids));
};

// ---- Firestore operations ----
const getUserDocRef = (uid) => doc(db, 'users', uid);

const getFirestoreVault = async (uid) => {
  try {
    const snap = await getDoc(getUserDocRef(uid));
    if (snap.exists()) {
      return snap.data().vault || [];
    }
    return [];
  } catch (err) {
    console.error('Firestore getVault error:', err);
    return getLocalVault(); // fallback
  }
};

// ---- Public API (auto-selects storage based on uid) ----

export const getVault = async (uid) => {
  if (uid) {
    return await getFirestoreVault(uid);
  }
  return getLocalVault();
};

export const setVaultPublicStatus = async (uid, isPublic, username) => {
  if (!uid) return;
  const ref = getUserDocRef(uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { isPublicVault: isPublic, username });
    } else {
      await setDoc(ref, { isPublicVault: isPublic, username, vault: [] });
    }
  } catch (err) {
    console.error('Error setting public status:', err);
  }
};

export const getPublicVaultByUsername = async (username) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username), where('isPublicVault', '==', true));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  } catch (err) {
    console.error('Error fetching public vault:', err);
    return null;
  }
};

export const addToVault = async (cardId, uid, isPremium = false) => {
  // Check vault limit for free users
  const currentVault = uid ? await getFirestoreVault(uid) : getLocalVault();
  const FREE_LIMIT = 10;

  if (!isPremium && currentVault.length >= FREE_LIMIT && !currentVault.includes(cardId)) {
    throw new Error('FREE_LIMIT_REACHED');
  }

  if (uid) {
    try {
      const ref = getUserDocRef(uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, { vault: arrayUnion(cardId) });
      } else {
        await setDoc(ref, { vault: [cardId] });
      }
      return true;
    } catch (err) {
      console.error('Firestore addToVault error:', err);
    }
  }
  // localStorage fallback
  const vault = getLocalVault();
  if (!vault.includes(cardId)) {
    vault.push(cardId);
    setLocalVault(vault);
    return true;
  }
  return false;
};

export const removeFromVault = async (cardId, uid) => {
  if (uid) {
    try {
      await updateDoc(getUserDocRef(uid), { vault: arrayRemove(cardId) });
      return;
    } catch (err) {
      console.error('Firestore removeFromVault error:', err);
    }
  }
  setLocalVault(getLocalVault().filter(id => id !== cardId));
};

export const isInVault = async (cardId, uid) => {
  const vault = await getVault(uid);
  return vault.includes(cardId);
};

// Sync local vault to Firestore on first login
export const syncLocalToFirestore = async (uid) => {
  const localVault = getLocalVault();
  if (localVault.length === 0) return;
  
  try {
    const ref = getUserDocRef(uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      // Merge local cards into existing Firestore vault
      for (const cardId of localVault) {
        await updateDoc(ref, { vault: arrayUnion(cardId) });
      }
    } else {
      await setDoc(ref, { vault: localVault });
    }
    // Clear local after syncing
    localStorage.removeItem(VAULT_KEY);
  } catch (err) {
    console.error('Sync error:', err);
  }
};
