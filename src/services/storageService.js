import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firebaseState } from './firebase';

const getStorageInstance = () => {
  if (!firebaseState.storage) {
    console.warn("Storage not initialized yet, falling back to getStorage()");
    return getStorage();
  }
  return firebaseState.storage;
};

export async function uploadProfilePhoto(file, userId = "user") {
  if (!file) throw new Error("Aucun fichier sélectionné");

  // On peut encore compresser l'image côté client avant l'upload si besoin,
  // mais pour l'instant on se contente d'un upload Firebase Storage classique.
  
  const storage = getStorageInstance();
  const fileExtension = file.name.split('.').pop() || 'jpg';
  const fileName = `profile_${Date.now()}.${fileExtension}`;
  const storageRef = ref(storage, `profiles/${userId}/${fileName}`);
  
  // Utilisation de uploadBytesResumable pour gérer l'upload de gros fichiers
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    // Timeout de 15 secondes pour éviter le blocage infini (Adblock, réseau faible...)
    const timeout = setTimeout(() => {
      uploadTask.cancel();
      reject(new Error("Le serveur (Storage) met trop de temps à répondre. Vérifiez votre connexion."));
    }, 15000);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Optionnel : gérer la progression
      },
      (error) => {
        clearTimeout(timeout);
        console.error("Erreur d'upload Firebase Storage:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          clearTimeout(timeout);
          resolve(downloadURL);
        } catch (err) {
          clearTimeout(timeout);
          reject(err);
        }
      }
    );
  });
}
