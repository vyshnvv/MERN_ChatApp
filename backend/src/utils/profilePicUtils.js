// utils/profilePicUtils.js

/**
 * Generates a random profile picture URL using DiceBear API
 * @param {string} seed - Optional seed for consistent generation (e.g., user's email or ID)
 * @param {string} style - Optional specific style to use
 * @returns {string} Profile picture URL
 */
export const generateProfilePicture = (seed = null, style = null) => {
  // Available DiceBear styles - choose ones that look good for profile pictures
  const styles = [
    "adventurer",
    "adventurer-neutral",
    "avataaars",
    "avataaars-neutral",
    "big-ears",
    "big-ears-neutral",
    "big-smile",
    "lorelei",
    "lorelei-neutral",
    "micah",
    "open-peeps",
    "personas",
    "pixel-art",
    "pixel-art-neutral",
  ];

  // Use provided style or pick a random one
  const selectedStyle =
    style || styles[Math.floor(Math.random() * styles.length)];

  // Use provided seed or generate a random one
  const profileSeed = seed || Math.random().toString(36).substring(2, 15);

  // Additional parameters for better-looking avatars
  const params = new URLSearchParams({
    seed: profileSeed,
    backgroundColor: "transparent",
    size: "200", // Good size for profile pictures
  });

  return `https://api.dicebear.com/7.x/${selectedStyle}/svg?${params.toString()}`;
};

/**
 * Generates a profile picture based on user's email (for consistency)
 * @param {string} email - User's email address
 * @returns {string} Profile picture URL
 */
export const generateProfilePictureFromEmail = (email) => {
  // Use email as seed for consistent avatar generation
  return generateProfilePicture(email);
};

/**
 * Generates multiple profile picture options for user to choose from
 * @param {string} seed - Seed for generation
 * @param {number} count - Number of options to generate
 * @returns {Array<Object>} Array of profile picture objects with url and style
 */
export const generateProfilePictureOptions = (seed, count = 5) => {
  const styles = [
    "adventurer",
    "avataaars",
    "big-ears",
    "lorelei",
    "micah",
    "open-peeps",
    "personas",
    "pixel-art",
  ];

  const options = [];

  for (let i = 0; i < count; i++) {
    const style = styles[i % styles.length];
    const seedVariation = `${seed}-${i}`;
    const url = generateProfilePicture(seedVariation, style);

    options.push({
      id: i,
      url: url,
      style: style,
    });
  }

  return options;
};
