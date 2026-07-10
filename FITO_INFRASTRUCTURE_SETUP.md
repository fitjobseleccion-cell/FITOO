# FITO Infrastructure Setup & Operations Guide

## 1. Quick Start Guide
The FITO Infrastructure introduces robust localization, notifications, and persistent conversational memory. 
To guarantee it functions correctly:
1. Ensure the user is authenticated (history and notifications are tied to `usuario_id`).
2. Verify PocketBase Collections are generated exactly as defined in Section 3.
3. Trigger a notification programmatically to test real-time Socket connections.

## 2. File Checklist & Purpose
- `apps/web/src/lib/fitoTranslations.js` -> Centralized dictionary for multi-language support.
- `apps/web/src/components/FitoNotifications.jsx` -> Panel to render realtime alerts.
- `apps/web/src/components/FitoLanguageSelector.jsx` -> UI control for session + DB language updating.
- `apps/web/src/components/FitoConversationHistory.jsx` -> Render block recovering abandoned chat sessions.
- `apps/web/src/lib/notificationGenerator.js` -> Abstraction functions ensuring payload consistency when creating DB records.
- `apps/web/src/components/FitoChat.jsx` -> Core orchestrator wrapping all of the above.

## 3. PocketBase Schema Requirements
Make sure the following exact setup exists on your remote or local PocketBase server:

**Collection: `notificaciones_fito`**
- `usuario_id` (relation to users)
- `tipo` (select: `nueva_oferta_compatible`, `cambio_candidatura`, `curso_recomendado`, `recordatorio_entrevista`, `cv_incompleto`)
- `mensaje` (text)
- `leida` (bool)
- `datos_adicionales` (json)

**Collection: `conversaciones_fito`**
- `usuario_id` (relation to users)
- `mensajes` (json, required)
- `estado` (select: `activa`, `finalizada`)
- `tema_principal` (text)

**Users Collection Modification**
- Added field `idioma_preferido` (select: `es`, `en`, `fr`, `it`, `pt`).

## 4. Minimal Verification Tests
- **Database Connection**: Refresh the app. Log in. Send a message. Open PocketBase dashboard and check `conversaciones_fito`. Ensure `mensajes` JSON matches what you typed.
- **Language Synchronization**: Change language to Italian. Refresh the page. It should stay Italian (fetched from DB via user `idioma_preferido`).

## 5. Troubleshooting
- **Issue**: Notifications panel is empty, but there are records in the DB.
  **Fix**: Check your List/View access rules. They MUST be `@request.auth.id = usuario_id`. If `usuario_id` is empty on the record, it will not fetch.
- **Issue**: Real-time badge does not update.
  **Fix**: Ensure `pb.collection().subscribe('*')` is firing. Confirm no ad-blockers are blocking SSE/WebSocket connections.
- **Issue**: Conversation history does not prompt.
  **Fix**: The query checks for `estado = 'activa'`. If the previous session updated the state to `finalizada`, it correctly ignores it. Verify DB state manually.

## 6. Performance Considerations
- **Pagination**: The Notification query currently uses `getFullList()`. For production environments expecting thousands of notifications per user, refactor to `getList(1, 20)` with infinite scroll limits.
- **JSON Payload Limits**: The `conversaciones_fito.mensajes` field stores a JSON array. If conversations run extremely long, DB fetch sizes will grow. Consider archiving old messages or enforcing a soft limit in frontend logic.

## 7. Security Considerations
- The API applies API rules (`@request.auth.id = usuario_id`) guaranteeing horizontal user isolation. Users cannot see each other's chat history or notifications.
- `$autoCancel: false` is utilized on all database fetches to prevent rapid firing events from cancelling background promises.

## 8. Future Roadmap & Enhancements
- **Email Fallback**: Connect a PocketBase hook or chron job to identify users with `leida = false` > 24 hours, dispatching a batched summary email via SMTP.
- **Auto-translate Chat**: While UI is translated, user messages are raw. Connecting the bot responses to an LLM chain with a system prompt dynamically matching the user's `idioma_preferido`.
- **Advanced Typing Indicators**: Add a "Fito is typing..." state with Socket awareness when delegating tasks to slow third-party inference models.