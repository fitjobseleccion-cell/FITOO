import pb from '@/lib/pocketbaseClient.js';
import { getFitoMenuOptions } from './fitoConversationTree.js';

export const getUserStateData = async (userId) => {
  if (!userId) return null;
  
  try {
    const [candidatos, candidaturas, cvDrafts] = await Promise.all([
      pb.collection('candidatos').getList(1, 1, { filter: `usuario_id = "${userId}"`, $autoCancel: false }),
      pb.collection('candidaturas').getList(1, 5, { filter: `usuario_id = "${userId}"`, sort: '-created', $autoCancel: false }),
      pb.collection('cv_drafts').getList(1, 1, { filter: `userId = "${userId}"`, $autoCancel: false })
    ]);

    return {
      candidato: candidatos.items[0] || null,
      candidaturas: candidaturas.items,
      cvDraft: cvDrafts.items[0] || null,
      lastActivity: new Date()
    };
  } catch (error) {
    console.error('Error fetching user state:', error);
    return null;
  }
};

export const calculateCVCompleteness = (candidato) => {
  if (!candidato) return 0;
  let score = 0;
  if (candidato.nombre) score += 10;
  if (candidato.apellidos) score += 10;
  if (candidato.email) score += 10;
  if (candidato.telefono) score += 10;
  if (candidato.ciudad) score += 10;
  if (candidato.fecha_nacimiento) score += 10;
  if (candidato.permiso_trabajo) score += 10;
  if (candidato.curriculum) score += 30;
  return score;
};

export const getAdaptedMenuOptions = (userState, lang = 'es') => {
  const baseOptions = getFitoMenuOptions(lang);
  if (!userState) return baseOptions;

  const completeness = calculateCVCompleteness(userState.candidato);
  const adapted = [...baseOptions];

  // If CV is incomplete, prioritize CV creation/upload
  if (completeness < 100) {
    const cvIndex = adapted.findIndex(o => o.id === 'crear_cv');
    if (cvIndex > -1) {
      const cvOption = adapted.splice(cvIndex, 1)[0];
      adapted.unshift({ ...cvOption, highlight: true, label: `${cvOption.label} (Recomendado)` });
    }
  }

  // If user has active candidatures, suggest interview practice
  if (userState.candidaturas.length > 0) {
    const intIndex = adapted.findIndex(o => o.id === 'practicar_entrevista');
    if (intIndex > -1) {
      const intOption = adapted.splice(intIndex, 1)[0];
      adapted.splice(1, 0, { ...intOption, highlight: true });
    }
  }

  return adapted;
};

export const getContextualMessage = (userState, lang = 'es') => {
  if (!userState) return null;
  
  const completeness = calculateCVCompleteness(userState.candidato);
  if (completeness > 0 && completeness < 100) {
    return `He notado que tu perfil está al ${completeness}%. ¿Quieres que te ayude a completarlo para destacar más?`;
  }
  
  if (userState.candidaturas.length > 0) {
    const recent = userState.candidaturas[0];
    return `Veo que aplicaste recientemente a una oferta. ¿Te gustaría practicar para una posible entrevista?`;
  }
  
  return null;
};