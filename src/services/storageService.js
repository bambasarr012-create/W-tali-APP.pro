// Service de stockage des photos (Firebase Storage & Fallback haute qualité)

export async function uploadProfilePhoto(file, userId = "user") {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("Aucun fichier sélectionné"));
    }

    // Compression forte pour éviter le dépassement de quota du localStorage (Base64)
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; // Forte réduction pour le localStorage
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Qualité 0.6 pour réduire drastiquement le poids du base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Format d'image non valide"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
    reader.readAsDataURL(file);
  });
}

