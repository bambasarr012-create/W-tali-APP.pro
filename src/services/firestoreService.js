import { 
  getFirestore, collection, doc, setDoc, getDoc, getDocs, 
  onSnapshot, query, where, addDoc, updateDoc 
} from 'firebase/firestore';
import { firebaseState } from './firebase';

// ==========================================
// UTILS
// ==========================================
const getDb = () => {
  if (!firebaseState.db) {
    console.warn("Firestore not initialized yet, falling back to getFirestore()");
    return getFirestore();
  }
  return firebaseState.db;
};

export function subscribeToCollection(collectionName, callback) {
  try {
    const db = getDb();
    const q = query(collection(db, collectionName));
    return onSnapshot(q, (snapshot) => {
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      if (typeof callback === 'function') {
        callback(data);
      }
    }, (error) => {
      console.error(`Error subscribing to collection ${collectionName}:`, error);
    });
  } catch (error) {
    console.error(`Error in subscribeToCollection for ${collectionName}:`, error);
    return () => {}; // Return a no-op function to prevent cleanup errors in useEffect
  }
}

// ==========================================
// GESTION DES PROFILS
// ==========================================

export function subscribeToProfiles(callback) {
  const db = getDb();
  const q = query(collection(db, 'users'));
  return onSnapshot(q, (snapshot) => {
    const profiles = [];
    snapshot.forEach(doc => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    callback(profiles);
  }, (error) => {
    console.error("Error subscribing to profiles:", error);
  });
}

export async function getAllProfiles() {
  const db = getDb();
  const snapshot = await getDocs(collection(db, 'users'));
  const profiles = [];
  snapshot.forEach(doc => {
    profiles.push({ id: doc.id, ...doc.data() });
  });
  return profiles;
}

export async function getProfileById(id) {
  if (!id) return null;
  const db = getDb();
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

export async function saveUserProfile(profileData) {
  if (!profileData || !profileData.id) throw new Error("Profile ID is required");
  const db = getDb();
  
  const docRef = doc(db, 'users', profileData.id);
  const dataToSave = { 
    ...profileData, 
    updatedAt: new Date().toISOString() 
  };
  if (!profileData.createdAt) {
    dataToSave.createdAt = new Date().toISOString();
  }

  // Ajout d'un timeout pour éviter que setDoc ne tourne indéfiniment 
  // en cas de blocage réseau (Adblocker, App Check en cache, etc.)
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Le serveur met trop de temps à répondre. Vérifiez votre connexion ou désactivez votre bloqueur de publicités (Adblock).")), 10000)
  );

  await Promise.race([
    setDoc(docRef, dataToSave, { merge: true }),
    timeout
  ]);

  localStorage.setItem('wetali_current_profile', JSON.stringify(dataToSave)); // Fallback cache local
  return dataToSave;
}

export function getCurrentStoredProfile() {
  try {
    const saved = localStorage.getItem('wetali_current_profile');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn(e);
  }
  return null;
}

// ==========================================
// ALGORITHME DES POINTS COMMUNS (Pure Function)
// ==========================================

export function calculatePointsCommuns(myProfile, targetProfile) {
  if (!targetProfile) return { score: 75, points: [] };
  
  const points = [];
  let score = 65; 

  if (myProfile?.ville && targetProfile?.ville) {
    if (myProfile.ville.trim().toLowerCase() === targetProfile.ville.trim().toLowerCase()) {
      points.push({ type: 'ville', label: `Même ville de résidence (${targetProfile.ville})`, icon: 'map-pin' });
      score += 15;
    }
  }

  if (myProfile?.dahira && targetProfile?.dahira) {
    if (myProfile.dahira === targetProfile.dahira && myProfile.dahira !== 'Autre Dahira') {
      points.push({ type: 'dahira', label: `Même repère spirituel (${targetProfile.dahira})`, icon: 'heart' });
      score += 12;
    }
  }

  if (myProfile?.visionMariage && targetProfile?.visionMariage) {
    if (myProfile.visionMariage === targetProfile.visionMariage) {
      points.push({ type: 'vision', label: `Vision d'engagement alignée`, icon: 'calendar-check' });
      score += 10;
    }
  }

  const myInterests = Array.isArray(myProfile?.interets) ? myProfile.interets : [];
  const targetInterests = Array.isArray(targetProfile?.interets) ? targetProfile.interets : [];
  const sharedInterests = myInterests.filter(i => targetInterests.includes(i));
  
  if (sharedInterests.length > 0) {
    points.push({ type: 'interets', label: `${sharedInterests.length} centre(s) d'intérêt en commun`, icon: 'sparkles' });
    score += Math.min(sharedInterests.length * 4, 12);
  }

  if (myProfile?.age && targetProfile?.age) {
    const diff = Math.abs(myProfile.age - targetProfile.age);
    if (diff <= 5) {
      points.push({ type: 'age', label: `Tranche d'âge très harmonieuse`, icon: 'check-circle-2' });
      score += 6;
    }
  }

  if (points.length === 0) {
    points.push({ type: 'valeurs', label: "Engagement envers les valeurs de la Teranga", icon: 'shield-check' });
  }

  return { score: Math.min(score, 99), points };
}

// ==========================================
// GESTION DES DEMANDES (REQUESTS)
// ==========================================

export async function sendRequest(fromUser, toUser, customMessage) {
  if (!fromUser?.id || !toUser?.id) throw new Error("Users missing for request");
  const db = getDb();

  // Check if pending request exists
  const existingQuery = query(
    collection(db, 'requests'), 
    where('fromUserId', '==', fromUser.id), 
    where('toUserId', '==', toUser.id), 
    where('status', '==', 'pending')
  );
  
  const existingSnap = await getDocs(existingQuery);
  if (!existingSnap.empty) {
    throw new Error("Une demande est déjà en attente auprès de cette personne.");
  }

  const defaultMsg = "Assalamu alaikum, j'ai vu ton profil et ça m'intéresse. J'aimerais faire ta connaissance dans un cadre sérieux.";
  const newRequest = {
    fromUserId: fromUser.id,
    toUserId: toUser.id,
    fromUser: fromUser, // Denormalized for fast reads
    toUser: toUser,     // Denormalized for fast reads
    message: customMessage?.trim() ? customMessage.trim() : defaultMsg,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'requests'), newRequest);
  return { id: docRef.id, ...newRequest };
}

export async function getReceivedRequests(userId) {
  if (!userId) return [];
  const db = getDb();
  const q = query(
    collection(db, 'requests'), 
    where('toUserId', '==', userId), 
    where('status', '==', 'pending')
  );
  const snap = await getDocs(q);
  const requests = [];
  snap.forEach(doc => requests.push({ id: doc.id, ...doc.data() }));
  return requests;
}

export async function getSentRequests(userId) {
  if (!userId) return [];
  const db = getDb();
  const q = query(
    collection(db, 'requests'), 
    where('fromUserId', '==', userId)
  );
  const snap = await getDocs(q);
  const requests = [];
  snap.forEach(doc => requests.push({ id: doc.id, ...doc.data() }));
  return requests;
}

export async function getDailyRequestCount(userId) {
  if (!userId) return 0;
  const db = getDb();
  
  // Obtenir le début de la journée courante
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const q = query(
    collection(db, 'requests'), 
    where('fromUserId', '==', userId),
    where('createdAt', '>=', startOfDay.toISOString())
  );
  const snap = await getDocs(q);
  return snap.size;
}

export async function acceptRequest(requestId, currentProfile) {
  const db = getDb();
  const requestRef = doc(db, 'requests', requestId);
  const requestSnap = await getDoc(requestRef);
  
  if (!requestSnap.exists()) throw new Error("Demande introuvable");
  const requestData = requestSnap.data();
  
  // Mettre à jour le statut
  await updateDoc(requestRef, { status: 'accepted' });

  // Créer un Match
  const newMatch = {
    users: [requestData.fromUserId, requestData.toUserId],
    createdAt: new Date().toISOString(),
    lastMessage: "Demande acceptée ! Vous pouvez maintenant échanger en toute sérénité.",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0
  };
  
  const matchRef = await addDoc(collection(db, 'matches'), newMatch);
  return { id: matchRef.id, ...newMatch };
}

export async function rejectRequest(requestId) {
  const db = getDb();
  const requestRef = doc(db, 'requests', requestId);
  await updateDoc(requestRef, { status: 'rejected' });
  return true;
}

export async function checkRelationshipStatus(myUserId, targetUserId) {
  if (!myUserId || !targetUserId) return { status: 'none' };
  const db = getDb();
  
  // 1. Check if matched
  const matchQuery = query(collection(db, 'matches'), where('users', 'array-contains', myUserId));
  const matchSnap = await getDocs(matchQuery);
  for (const d of matchSnap.docs) {
    if (d.data().users.includes(targetUserId)) {
      return { status: 'matched', match: { id: d.id, ...d.data() } };
    }
  }

  // 2. Check if I sent a request
  const sentQuery = query(collection(db, 'requests'), where('fromUserId', '==', myUserId), where('toUserId', '==', targetUserId), where('status', '==', 'pending'));
  const sentSnap = await getDocs(sentQuery);
  if (!sentSnap.empty) return { status: 'request_sent', request: { id: sentSnap.docs[0].id, ...sentSnap.docs[0].data() } };

  // 3. Check if they sent me a request
  const receivedQuery = query(collection(db, 'requests'), where('fromUserId', '==', targetUserId), where('toUserId', '==', myUserId), where('status', '==', 'pending'));
  const receivedSnap = await getDocs(receivedQuery);
  if (!receivedSnap.empty) return { status: 'request_received', request: { id: receivedSnap.docs[0].id, ...receivedSnap.docs[0].data() } };

  return { status: 'none' };
}


// ==========================================
// GESTION DES MATCHES
// ==========================================

export async function getMatches(userId) {
  if (!userId) return [];
  const db = getDb();
  const q = query(
    collection(db, 'matches'),
    where('users', 'array-contains', userId)
  );
  const snap = await getDocs(q);
  const matches = [];
  snap.forEach(doc => matches.push({ id: doc.id, ...doc.data() }));
  return matches;
}

// ==========================================
// UTILS
// ==========================================

export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return "À l'instant";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Hier";
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
