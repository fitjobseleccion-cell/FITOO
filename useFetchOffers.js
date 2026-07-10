import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

export function useFetchOffers(filters = {}) {
  const [ofertas, setOfertas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let filterStr = 'estado = "publicada"';
        
        if (filters.keyword) {
          filterStr += ` && (titulo ~ "${filters.keyword}" || descripcion ~ "${filters.keyword}" || empresa ~ "${filters.keyword}")`;
        }
        if (filters.location) {
          filterStr += ` && ubicacion ~ "${filters.location}"`;
        }
        
        const records = await pb.collection('ofertas').getFullList({
          filter: filterStr,
          sort: '-created',
          $autoCancel: false
        });
        
        setOfertas(records);
        setHasMore(false);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('No se pudieron cargar las ofertas. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [filters]);

  const loadMore = () => {
    // Pagination placeholder
  };

  return { ofertas, isLoading, error, hasMore, loadMore };
}