export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  try {
    // Handle Firestore Timestamp or Date object or ISO string
    let dateObj;
    if (birthDate.toDate && typeof birthDate.toDate === 'function') {
      dateObj = birthDate.toDate();
    } else {
      dateObj = new Date(birthDate);
    }
    
    if (isNaN(dateObj.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const m = today.getMonth() - dateObj.getMonth();
    
    // Check if birthday hasn't occurred yet this year
    if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error("Erreur de calcul de l'âge:", error);
    return null;
  }
};

export const isAdult = (birthDate) => {
  const age = calculateAge(birthDate);
  return age !== null && age >= 18 && age <= 99;
};
