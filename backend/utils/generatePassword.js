import crypto from 'crypto';

/**
 * Generates a cryptographically secure random password
 * @param {number} length - Desired password length (default: 14)
 * @returns {string} - Random temporary password
 */
export const generateSecurePassword = (length = 14) => {
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous chars like I, O
  const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz'; // Exclude ambiguous chars like l
  const numberChars = '23456789'; // Exclude ambiguous chars like 0, 1
  const specialChars = '!@#$%^&*()_+-=';

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  // Ensure at least one from each character set
  const required = [
    uppercaseChars[crypto.randomInt(0, uppercaseChars.length)],
    lowercaseChars[crypto.randomInt(0, lowercaseChars.length)],
    numberChars[crypto.randomInt(0, numberChars.length)],
    specialChars[crypto.randomInt(0, specialChars.length)]
  ];

  // Fill the remainder of the length
  const remainingLength = Math.max(length, 10) - required.length;
  const remaining = [];
  for (let i = 0; i < remainingLength; i++) {
    remaining.push(allChars[crypto.randomInt(0, allChars.length)]);
  }

  // Combine and cryptographically shuffle
  const combined = [...required, ...remaining];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
};
