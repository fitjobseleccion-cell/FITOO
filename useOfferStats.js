import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export const useOfferStats = () => {
  const [stats, setStats] = useState({
    verifiedOffers: 0,
    candidateCount: 0,
    companyCount: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        // Use getList(1, 1) to efficiently get totalItems without fetching all records
        const [offersRes, candidatesRes, companiesRes] = await Promise.allSettled([
          pb.collection('ofertas').getList(1, 1, { 
            filter: "estado = 'publicada'", 
            $autoCancel: false 
          }),
          pb.collection('users').getList(1, 1, { 
            filter: "tipo_cuenta = 'candidato'", 
            $autoCancel: false 
          }),
          pb.collection('users').getList(1, 1, { 
            filter: "tipo_cuenta = 'empresa'", 
            $autoCancel: false 
          })
        ]);

        if (isMounted) {
          setStats({
            verifiedOffers: offersRes.status === 'fulfilled' ? offersRes.value.totalItems : 0,
            candidateCount: candidatesRes.status === 'fulfilled' ? candidatesRes.value.totalItems : 0,
            companyCount: companiesRes.status === 'fulfilled' ? companiesRes.value.totalItems : 0,
            loading: false,
            error: null
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error al obtener estadísticas:', err);
          setStats(prev => ({ 
            ...prev, 
            loading: false, 
            error: err.message || 'Error al cargar estadísticas' 
          }));
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return stats;
};