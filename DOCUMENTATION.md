# FITO AI - Translations, Notifications, and History Documentation

## 1. File Locations & Structure

### Translation Core
- **`apps/web/src/lib/fitoTranslations.js`**: Core dictionary exporting the `FITO_TRANSLATIONS` object. Keys are language codes (`es`, `en`, `fr`, `it`, `pt`), and values are nested translation strings for all menus, prompts, and chat placeholders.

### UI Components
- **`apps/web/src/components/FitoNotifications.jsx`**: A drawer/modal component that subscribes to the `notificaciones_fito` PocketBase collection. Displays unread counts, groups them by type with specific icons, and provides actions to "Mark as Read" or "Clear".
- **`apps/web/src/components/FitoLanguageSelector.jsx`**: A lightweight dropdown rendering supported languages. On change, it updates `sessionStorage` and syncs with the authenticated user's `idioma_preferido` field in PocketBase.
- **`apps/web/src/components/FitoConversationHistory.jsx`**: A prompt overlay component triggered when a pending (unfinished) conversation is detected within the last 24 hours. Offers "Continue" or "Start over" actions.

### Utilities
- **`apps/web/src/lib/notificationGenerator.js`**: Backend-agnostic frontend utility functions for generating standard system notifications (e.g., `generateNewOfferNotification`, `generateCourseRecommendationNotification`).

---

## 2. Using Translations in Components
Translations are applied by extracting the `currentLang` (from Context/State) and looking up the corresponding nested keys.

**Example Implementation:**