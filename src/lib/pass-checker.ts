export function getPasswordStrength(password: string = ""): number {
  let score = 0;
  const length = password.length;

  if (length === 0) {
    return 0;
  }

  if (length >= 8) score++; // Baseline minimale
  if (length >= 12) score++; // Longueur robuste
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++; // Majuscules + minuscules
  if (/\d/.test(password)) score++; // Chiffres
  if (/[^A-Za-z0-9]/.test(password)) score++; // Caractères spéciaux

  // Ajustements pour éviter des scores trop élevés avec de faibles critères
  if (length < 8) return 1; // Trop court = très faible sécurité
  if (score === 5 && length < 10) score--; // Évite un score max avec un mot de passe trop court

  return Math.min(score, 5);
}

export function gradientVariantFromScore(score: number) {
  if (score <= 1) {
    return "from-red-5 to-red-3";
  } else if (score <= 2) {
    return "from-red-4 to-orange-3";
  } else if (score <= 3) {
    return "from-red-3 to-green-3";
  } else if (score <= 4) {
    return "from-orange-3 to-green-4";
  } else {
    return "from-green-4 to-green-4";
  }
}
