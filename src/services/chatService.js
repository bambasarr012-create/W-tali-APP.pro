// Service de messagerie instantanée temps réel (Firestore & Realtime Sync)

const CHAT_MESSAGES_KEY_PREFIX = 'wetali_chat_messages_';
const chatListeners = new Map();

function getChatStorageKey(chatId) {
  return `${CHAT_MESSAGES_KEY_PREFIX}${chatId}`;
}

export function initDemoConversation(chatId, otherUserName = "Aïssatou") {
  const key = getChatStorageKey(chatId);
  if (!localStorage.getItem(key)) {
    const demoMsgs = [
      {
        id: "msg_1",
        senderId: "other_user",
        text: `Assalamu alaikum ! Merci d'avoir accepté mon invitation. J'ai été touché(e) par la clarté de vos intentions.`,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        read: true
      },
      {
        id: "msg_2",
        senderId: "current_user",
        text: `Wa alaikum assalam ! Tout le plaisir est pour moi. Bâtir un foyer sur des bases saines est essentiel pour moi.`,
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        read: true
      },
      {
        id: "msg_3",
        senderId: "other_user",
        text: `Tout à fait. J'ai vu que vous étiez également très attaché(e) aux valeurs de la famille et au respect des principes.`,
        timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
        read: true
      }
    ];
    localStorage.setItem(key, JSON.stringify(demoMsgs));
  }
}

export function subscribeToMessages(chatId, callback) {
  if (!chatListeners.has(chatId)) {
    chatListeners.set(chatId, new Set());
  }
  chatListeners.get(chatId).add(callback);

  // Initial call with current messages
  const key = getChatStorageKey(chatId);
  const raw = localStorage.getItem(key);
  const msgs = raw ? JSON.parse(raw) : [];
  callback(msgs);

  // Return unsubscribe function
  return () => {
    const subs = chatListeners.get(chatId);
    if (subs) {
      subs.delete(callback);
    }
  };
}

function notifyChatSubscribers(chatId) {
  const subs = chatListeners.get(chatId);
  if (subs) {
    const key = getChatStorageKey(chatId);
    const raw = localStorage.getItem(key);
    const msgs = raw ? JSON.parse(raw) : [];
    subs.forEach(cb => {
      try { cb(msgs); } catch (e) { console.error(e); }
    });
  }
}

export async function sendMessage(chatId, senderId, text) {
  if (!text || !text.trim()) return null;

  const key = getChatStorageKey(chatId);
  const raw = localStorage.getItem(key);
  const msgs = raw ? JSON.parse(raw) : [];

  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    senderId: senderId || 'current_user',
    text: text.trim(),
    timestamp: new Date().toISOString(),
    read: false // Affiche ✓ puis passe à ✓✓
  };

  msgs.push(newMessage);
  localStorage.setItem(key, JSON.stringify(msgs));
  notifyChatSubscribers(chatId);

  // Simulation de lecture automatique par l'interlocuteur après 2.5 secondes
  setTimeout(() => {
    const updatedRaw = localStorage.getItem(key);
    if (updatedRaw) {
      const updatedMsgs = JSON.parse(updatedRaw);
      const msg = updatedMsgs.find(m => m.id === newMessage.id);
      if (msg) {
        msg.read = true;
        localStorage.setItem(key, JSON.stringify(updatedMsgs));
        notifyChatSubscribers(chatId);
      }
    }
  }, 2500);

  return newMessage;
}

export async function markMessagesAsRead(chatId, currentUserId) {
  const key = getChatStorageKey(chatId);
  const raw = localStorage.getItem(key);
  if (!raw) return;

  const msgs = JSON.parse(raw);
  let hasChanges = false;
  msgs.forEach(m => {
    if (m.senderId !== currentUserId && !m.read) {
      m.read = true;
      hasChanges = true;
    }
  });

  if (hasChanges) {
    localStorage.setItem(key, JSON.stringify(msgs));
    notifyChatSubscribers(chatId);
  }
}
