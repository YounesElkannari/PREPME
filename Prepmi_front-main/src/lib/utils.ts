import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export  const truncateText = (text: string | undefined, maxLength: number = 100) => {
      if (!text) return "Product Description";
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + "...";
    };

// Obfuscate user id for referral
export const obfuscateId = (id: number) => {
  return btoa(id.toString()).replace(/=/g, '');
};

// Deobfuscate id
export const deobfuscateId = (obfuscated: string) => {
  try {
    return parseInt(atob(obfuscated + '=='.slice(0, (4 - obfuscated.length % 4) % 4)));
  } catch {
    return null;
  }
};