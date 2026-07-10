/**
 * @fileoverview Utility functions for creating natural typing delays in FITO responses.
 */

/**
 * Generates a random delay simulating human/bot typing time.
 * @returns {number} Delay in milliseconds (between 300ms and 700ms).
 */
export const getTypingDelay = () => {
  return Math.floor(Math.random() * 400) + 300;
};

/**
 * Awaits a promise simulating the typing indicator delay.
 * @param {number} [duration] - Optional custom delay in ms.
 * @returns {Promise<void>} Resolves when the delay is complete.
 */
export const showTypingIndicator = async (duration = getTypingDelay()) => {
  return new Promise(resolve => setTimeout(resolve, duration));
};