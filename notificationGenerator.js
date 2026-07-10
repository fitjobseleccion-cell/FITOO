import pb from '@/lib/pocketbaseClient.js';

export const generateNewOfferNotification = async (oferta, candidatoId) => {
  try {
    await pb.collection('notificaciones_fito').create({
      usuario_id: candidatoId,
      tipo: 'nueva_oferta_compatible',
      mensaje: `¡Nueva oferta compatible! ${oferta.titulo} en ${oferta.empresa}`,
      leida: false,
      datos_adicionales: { oferta_id: oferta.id }
    }, { $autoCancel: false });
  } catch (error) {
    console.error('Failed to create new offer notification:', error);
  }
};

export const generateCandidatureChangeNotification = async (candidatura, estadoAnterior, estadoNuevo) => {
  if (!candidatura.usuario_id) return;
  try {
    await pb.collection('notificaciones_fito').create({
      usuario_id: candidatura.usuario_id,
      tipo: 'cambio_candidatura',
      mensaje: `Tu candidatura para ha cambiado de estado a: ${estadoNuevo}`,
      leida: false,
      datos_adicionales: { candidatura_id: candidatura.id, estado: estadoNuevo }
    }, { $autoCancel: false });
  } catch (error) {
    console.error('Failed to create candidature change notification:', error);
  }
};

export const generateCourseRecommendationNotification = async (usuario_id, curso) => {
  try {
    await pb.collection('notificaciones_fito').create({
      usuario_id: usuario_id,
      tipo: 'curso_recomendado',
      mensaje: `Te recomendamos este curso para mejorar tu perfil: ${curso}`,
      leida: false
    }, { $autoCancel: false });
  } catch (error) {
    console.error('Failed to create course recommendation notification:', error);
  }
};

export const generateInterviewReminderNotification = async (usuario_id, entrevistaDetalles) => {
  try {
    await pb.collection('notificaciones_fito').create({
      usuario_id: usuario_id,
      tipo: 'recordatorio_entrevista',
      mensaje: `Recordatorio: Tienes una entrevista programada mañana.`,
      leida: false,
      datos_adicionales: entrevistaDetalles
    }, { $autoCancel: false });
  } catch (error) {
    console.error('Failed to create interview reminder notification:', error);
  }
};

export const generateIncompleteCVNotification = async (usuario_id) => {
  try {
    await pb.collection('notificaciones_fito').create({
      usuario_id: usuario_id,
      tipo: 'cv_incompleto',
      mensaje: `Tu CV está incompleto. Completalo para destacar en más ofertas.`,
      leida: false
    }, { $autoCancel: false });
  } catch (error) {
    console.error('Failed to create incomplete CV notification:', error);
  }
};