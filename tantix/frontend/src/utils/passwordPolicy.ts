export interface PasswordStrength {
  score: number;
  label: string;
  colorClass: string;
}

/**
 * Pure domain utility for assessing password strength
 * Without any UI or React dependencies.
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: '', colorClass: '' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return {
      score: 25,
      label: 'Weak',
      colorClass: 'bg-[var(--accent-rose)] text-[var(--accent-rose)]',
    };
  }
  if (score <= 3) {
    return {
      score: 70,
      label: 'Good',
      colorClass: 'bg-[var(--accent-amber)] text-[var(--accent-amber)]',
    };
  }
  return {
    score: 100,
    label: 'Institutional Grade',
    colorClass: 'bg-[var(--accent-emerald)] text-[var(--accent-emerald)]',
  };
}
