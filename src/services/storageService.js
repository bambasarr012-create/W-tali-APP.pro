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
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Optionnel : gérer la progression
      },
      (error) => {
        console.error("Erreur d'upload Firebase Storage:", error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}
