import { getFirestore, collection, doc, query, orderBy, onSnapshot, addDoc, getDocs, where, writeBatch, updateDoc } from 'firebase/firestore';
import { firebaseState } from './firebase';

const getDb = () => {
  if (!firebaseState.db) {
    console.warn("Firestore not initialized yet, falling back to getFirestore()");
    return getFirestore();
  }
  return firebaseState.db;
};

export function initDemoConversation(chatId, otherUserName = "Aïssatou") {
  // Optionnel: On pourrait injecter des messages démo dans Firestore si le chat est vide,
  // mais en production, ce n'est pas nécessaire.
}

export function subscribeToMessages(chatId, callback) {
  const db = getDb();
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const msgs = [];
    snapshot.forEach(doc => {
      msgs.push({ id: doc.id, ...doc.data() });
    });
    callback(msgs);
  }, (error) => {
    console.error("Error subscribing to messages:", error);
  });
}

export async function sendMessage(chatId, senderId, text, options = {}) {
  if ((!text || !text.trim()) && !options.audioData) return null;
  const db = getDb();

  const newMessage = {
    senderId: senderId || 'current_user',
    text: text ? text.trim() : '',
    type: options.type || 'text',
    audioData: options.audioData || null,
    timestamp: new Date().toISOString(),
    read: false
  };

  const msgRef = await addDoc(collection(db, 'chats', chatId, 'messages'), newMessage);
  
  // Mettre à jour le dernier message dans le document match
  try {
    const matchRef = doc(db, 'matches', chatId);
    await updateDoc(matchRef, {
      lastMessage: newMessage.type === 'audio' ? '🎵 Message vocal' : newMessage.text,
      lastMessageAt: newMessage.timestamp,
    });
  } catch (err) {
    console.warn("Could not update match lastMessage", err);
  }

  return { id: msgRef.id, ...newMessage };
}

export async function markMessagesAsRead(chatId, currentUserId) {
  const db = getDb();
  
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    where('senderId', '!=', currentUserId),
    where('read', '==', false)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.forEach((messageDoc) => {
    batch.update(messageDoc.ref, { read: true });
  });

  await batch.commit();
}
