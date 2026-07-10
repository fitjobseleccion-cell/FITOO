/**
 * @fileoverview Utility functions for managing accessibility (a11y) in FITO AI components,
 * including focus traps, ARIA attributes, and keyboard navigation.
 */

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  SPACE: ' '
};

/**
 * Returns a standardized ARIA label for FITO UI elements.
 * @param {string} type - The type of element or action.
 * @returns {string} - The ARIA label.
 */
export const getAriaLabel = (type) => {
  const labels = {
    chatButton: 'Abrir asistente FITO AI',
    closeChat: 'Cerrar asistente',
    sendMessage: 'Enviar mensaje a FITO',
    typingIndicator: 'FITO está escribiendo...',
    menuOptions: 'Opciones sugeridas de FITO'
  };
  return labels[type] || 'Elemento interactivo de FITO';
};

/**
 * Returns polite or assertive aria-live values.
 * @param {string} level - 'polite' | 'assertive' | 'off'
 * @returns {string}
 */
export const getAriaLive = (level = 'polite') => level;

export const getAriaPressed = (isPressed) => (isPressed ? 'true' : 'false');
export const getAriaExpanded = (isExpanded) => (isExpanded ? 'true' : 'false');
export const getAriaHidden = (isHidden) => (isHidden ? 'true' : 'false');

/**
 * Sets focus to an element by its ID.
 * @param {string} id - The DOM element ID.
 */
export const setFocusToElement = (id) => {
  const el = document.getElementById(id);
  if (el) el.focus();
};

/**
 * Traps focus within a specified DOM container (used for modals/drawers).
 * @param {HTMLElement} container - The wrapper element to trap focus inside.
 * @param {KeyboardEvent} e - The keydown event.
 */
export const trapFocus = (container, e) => {
  if (e.key !== KEYBOARD_KEYS.TAB) return;
  
  const focusableEls = container.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
  );
  
  const focusable = Array.from(focusableEls).filter(el => !el.disabled && !el.getAttribute('aria-hidden'));
  if (focusable.length === 0) return;

  const firstFocusable = focusable[0];
  const lastFocusable = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstFocusable) {
      lastFocusable.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastFocusable) {
      firstFocusable.focus();
      e.preventDefault();
    }
  }
};

/**
 * Handles keyboard navigation for modal/dialog components.
 * Manages Escape key to close and Tab key to trap focus.
 * @param {KeyboardEvent} e - The keyboard event.
 * @param {HTMLElement} container - The container element for focus trapping.
 * @param {Function} onEscape - Callback function when Escape is pressed.
 */
export const handleKeyboardNavigation = (e, container, onEscape) => {
  if (e.key === KEYBOARD_KEYS.ESCAPE) {
    onEscape?.();
  } else if (e.key === KEYBOARD_KEYS.TAB && container) {
    trapFocus(container, e);
  }
};

/**
 * Creates an invisible aria-live region to announce dynamic updates to screen readers.
 * @param {string} message - The message to announce.
 * @param {string} politeness - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, politeness = 'polite') => {
  let announcer = document.getElementById('fito-a11y-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'fito-a11y-announcer';
    announcer.setAttribute('aria-live', politeness);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.classList.add('sr-only');
    document.body.appendChild(announcer);
  }
  
  // Changing text triggers the announcement
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
};