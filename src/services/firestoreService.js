import { INITIAL_PROFILES } from '../data/mockProfiles';

const PROFILES_STORAGE_KEY = 'wetali_profiles';
const REQUESTS_STORAGE_KEY = 'wetali_requests';
const MATCHES_STORAGE_KEY = 'wetali_matches';

// Initialisation du stockage local persistant
function initStorage() {
  if (!localStorage.getItem(PROFILES_STORAGE_KEY)) {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(INITIAL_PROFILES));
  }
  if (!localStorage.getItem(REQUESTS_STORAGE_KEY)) {
    // Quelques demandes initiales pour démonstration
    const initialRequests = [
      {
        id: "req_demo_1",
        fromUserId: "user_cheikh_2",
        toUserId: "current_user",
        fromUser: INITIAL_PROFILES[1],
        message: "Assalamu alaikum, j'ai lu votre profil et vos repères correspondent particulièrement à mes attentes. J'aimerais faire votre connaissance dans un cadre sérieux et respectueux.",
        status: "pending",
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: "req_demo_2",
        fromUserId: "user_fatou_3",
        toUserId: "current_user",
        fromUser: INITIAL_PROFILES[2],
        message: "Assalamu alaikum wa rahmatullah. Votre démarche et votre vision du foyer m'inspirent beaucoup. Seriez-vous ouvert à échanger ?",
        status: "pending",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(initialRequests));
  }
  if (!localStorage.getItem(MATCHES_STORAGE_KEY)) {
    const initialMatches = [
      {
        id: "match_demo_1",
        users: ["current_user", "user_aissatou_1"],
        otherUser: INITIAL_PROFILES[0],
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        lastMessage: "Au plaisir de faire plus ample connaissance inch'Allah !",
        lastMessageAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        unreadCount: 1
      }
    ];
    localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(initialMatches));
  }
}

initStorage();

// Listener callbacks pour réactivité temps réel
const listeners = {
  profiles: new Set(),
  requests: new Set(),
  matches: new Set()
};

function notify(type) {
  if (listeners[type]) {
    listeners[type].forEach(cb => {
      try { cb(); } catch (e) { console.error(e); }
    });
  }
}

export function subscribeToCollection(type, callback) {
  if (!listeners[type]) listeners[type] = new Set();
  listeners[type].add(callback);
  return () => listeners[type].delete(callback);
}

// ==========================================
// GESTION DES PROFILS
// ==========================================

export async function getAllProfiles(excludeUserId = null) {
  initStorage();
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    const profiles = raw ? JSON.parse(raw) : INITIAL_PROFILES;
    if (excludeUserId) {
      return profiles.filter(p => p.id !== excludeUserId && p.id !== 'current_user');
    }
    return profiles;
  } catch (e) {
    console.error("Error reading profiles", e);
    return INITIAL_PROFILES;
  }
}

export async function getProfileById(id) {
  initStorage();
  const profiles = await getAllProfiles();
  return profiles.find(p => p.id === id) || null;
}

export async function saveUserProfile(profileData) {
  initStorage();
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    let profiles = raw ? JSON.parse(raw) : [...INITIAL_PROFILES];
    
    const existingIndex = profiles.findIndex(p => p.id === profileData.id);
    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...profileData, updatedAt: new Date().toISOString() };
    } else {
      profiles.unshift({ ...profileData, createdAt: new Date().toISOString() });
    }
    
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    localStorage.setItem('wetali_current_profile', JSON.stringify(profileData));
    notify('profiles');
    return profileData;
  } catch (e) {
    console.error("Error saving profile", e);
    throw e;
  }
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
// ALGORITHME DES POINTS COMMUNS
// ==========================================

export function calculatePointsCommuns(myProfile, targetProfile) {
  if (!targetProfile) return { score: 75, points: [] };
  
  const points = [];
  let score = 65; // Base compatibility

  // 1. Ville / Localisation
  if (myProfile?.ville && targetProfile?.ville) {
    if (myProfile.ville.trim().toLowerCase() === targetProfile.ville.trim().toLowerCase()) {
      points.push({
        type: 'ville',
        label: `Même ville de résidence (${targetProfile.ville})`,
        icon: 'map-pin'
      });
      score += 15;
    }
  }

  // 2. Dahira / Affinité spirituelle
  if (myProfile?.dahira && targetProfile?.dahira) {
    if (myProfile.dahira === targetProfile.dahira && myProfile.dahira !== 'Autre Dahira') {
      points.push({
        type: 'dahira',
        label: `Même repère spirituel (${targetProfile.dahira})`,
        icon: 'heart'
      });
      score += 12;
    }
  }

  // 3. Vision du mariage
  if (myProfile?.visionMariage && targetProfile?.visionMariage) {
    if (myProfile.visionMariage === targetProfile.visionMariage) {
      points.push({
        type: 'vision',
        label: `Vision d'engagement alignée (${targetProfile.visionMariageLabel || 'Identique'})`,
        icon: 'calendar-check'
      });
      score += 10;
    }
  }

  // 4. Centres d'intérêt partagés
  const myInterests = Array.isArray(myProfile?.interets) ? myProfile.interets : [];
  const targetInterests = Array.isArray(targetProfile?.interets) ? targetProfile.interets : [];
  const sharedInterests = myInterests.filter(i => targetInterests.includes(i));
  
  if (sharedInterests.length > 0) {
    points.push({
      type: 'interets',
      label: `${sharedInterests.length} centre(s) d'intérêt en commun : ${sharedInterests.join(', ')}`,
      icon: 'sparkles'
    });
    score += Math.min(sharedInterests.length * 4, 12);
  }

  // 5. Harmonisation des âges
  if (myProfile?.age && targetProfile?.age) {
    const diff = Math.abs(myProfile.age - targetProfile.age);
    if (diff <= 5) {
      points.push({
        type: 'age',
        label: `Tranche d'âge très harmonieuse (écart de ${diff} an${diff > 1 ? 's' : ''})`,
        icon: 'check-circle-2'
      });
      score += 6;
    }
  }

  // Points par défaut si profil neuf
  if (points.length === 0) {
    points.push({
      type: 'valeurs',
      label: "Engagement envers les valeurs de la Teranga & profil vérifié",
      icon: 'shield-check'
    });
  }

  return {
    score: Math.min(score, 99),
    points
  };
}

// ==========================================
// GESTION DES DEMANDES (REQUESTS)
// ==========================================

export async function sendRequest(fromUser, toUser, customMessage) {
  initStorage();
  try {
    const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
    const requests = raw ? JSON.parse(raw) : [];

    const existing = requests.find(r => 
      r.fromUserId === fromUser.id && r.toUserId === toUser.id && r.status === 'pending'
    );
    if (existing) {
      throw new Error("Une demande est déjà en attente auprès de cette personne.");
    }

    const defaultMsg = "Assalamu alaikum, j'ai vu ton profil et ça m'intéresse. J'aimerais faire ta connaissance dans un cadre sérieux.";
    const newRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      fromUserId: fromUser.id || 'current_user',
      toUserId: toUser.id,
      fromUser: fromUser,
      toUser: toUser,
      message: customMessage?.trim() ? customMessage.trim() : defaultMsg,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    requests.unshift(newRequest);
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
    notify('requests');
    return newRequest;
  } catch (e) {
    console.error("Error sending request", e);
    throw e;
  }
}

export async function getReceivedRequests(userId = 'current_user') {
  initStorage();
  const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
  const requests = raw ? JSON.parse(raw) : [];
  return requests.filter(r => (r.toUserId === userId || r.toUserId === 'current_user') && r.status === 'pending');
}

export async function getSentRequests(userId = 'current_user') {
  initStorage();
  const raw = localStorage.getItem(REQUESTS_STORAGE_KEY);
  const requests = raw ? JSON.parse(raw) : [];
  return requests.filter(r => (r.fromUserId === userId || r.fromUserId === 'current_user'));
}

export async function acceptRequest(requestId, currentProfile) {
  initStorage();
  try {
    const rawReqs = localStorage.getItem(REQUESTS_STORAGE_KEY);
    let requests = rawReqs ? JSON.parse(rawReqs) : [];
    
    const targetReqIndex = requests.findIndex(r => r.id === requestId);
    if (targetReqIndex === -1) throw new Error("Demande introuvable");
    
    const request = requests[targetReqIndex];
    request.status = 'accepted';
    requests[targetReqIndex] = request;
    localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));

    // Créer le Match mutuel
    const rawMatches = localStorage.getItem(MATCHES_STORAGE_KEY);
    let matches = rawMatches ? JSON.parse(rawMatches) : [];
    
    const newMatch = {
      id: `match_${Date.now()}`,
      users: [request.fromUserId, request.toUserId],
      otherUser: request.fromUser,
      createdAt: new Date().toISOString(),
      lastMessage: "Demande acceptée ! Vous pouvez maintenant échanger en toute sérénité.",
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0
    };

    matches.unshift(newMatch);
    localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(matches));
    
    notify('requests');
    notify('matches');
    return newMatch;
  } catch (e) {
    console.error("Error accepting request", e);
    throw e;
  }
}

export async function rejectRequest(requestId) {
  initStorage();
  try {
    const rawReqs = localStorage.getItem(REQUESTS_STORAGE_KEY);
    let requests = rawReqs ? JSON.parse(rawReqs) : [];
    
    const targetReqIndex = requests.findIndex(r => r.id === requestId);
    if (targetReqIndex >= 0) {
      requests[targetReqIndex].status = 'rejected';
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(requests));
      notify('requests');
    }
    return true;
  } catch (e) {
    console.error("Error rejecting request", e);
    throw e;
  }
}

// ==========================================
// GESTION DES MATCHES
// ==========================================

export async function getMatches(userId = 'current_user') {
  initStorage();
  const raw = localStorage.getItem(MATCHES_STORAGE_KEY);
  const matches = raw ? JSON.parse(raw) : [];
  return matches;
}
