import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import JobCard from './JobCard.jsx';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FileSearch } from 'lucide-react';

const JobList = ({ searchParams, filterParams, triggerSearch }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 9;

  useEffect(() => {
    setPage(1);
    fetchJobs(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSearch]);

  const buildFilterString = () => {
    let filterArr = ['estado="publicada"'];

    if (searchParams.searchTerm) {
      filterArr.push(`(puesto ~ "${searchParams.searchTerm}" || titulo ~ "${searchParams.searchTerm}" || empresa ~ "${searchParams.searchTerm}")`);
    }

    if (searchParams.location) {
      filterArr.push(`(ciudad ~ "${searchParams.location}" || provincia ~ "${searchParams.location}")`);
    }

    if (filterParams.contrato?.length > 0) {
      const parts = filterParams.contrato.map(c => `tipo_contrato="${c}"`);
      filterArr.push(`(${parts.join(' || ')})`);
    }

    if (filterParams.jornada?.length > 0) {
      const parts = filterParams.jornada.map(j => `jornada="${j}"`);
      filterArr.push(`(${parts.join(' || ')})`);
    }

    if (filterParams.modalidad?.length > 0) {
      const parts = filterParams.modalidad.map(m => `modalidad="${m}"`);
      filterArr.push(`(${parts.join(' || ')})`);
    }

    if (filterParams.incorporacion_inmediata) {
      filterArr.push(`incorporacion_inmediata=true`);
    }

    return filterArr.join(' && ');
  };

  const fetchJobs = async (pageToFetch = 1, isNewSearch = false) => {
    setLoading(true);
    try {
      const filterStr = buildFilterString();
      const result = await pb.collection('ofertas').getList(pageToFetch, perPage, {
        filter: filterStr,
        sort: '-destacada,-fecha_publicacion',
        $autoCancel: false
      });

      if (isNewSearch) {
        setJobs(result.items);
      } else {
        setJobs(prev => [...prev, ...result.items]);
      }
      
      setTotalItems(result.totalItems);
      setHasMore(result.page < result.totalPages);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage, false);
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <Skeleton className="h-6 w-24 mb-4 rounded-full" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <div className="space-y-3 mb-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!loading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 bg-card rounded-2xl border border-dashed border-border min-h-[400px]">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <FileSearch className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold mb-2">No se encontraron ofertas</h3>
        <p className="text-muted-foreground max-w-md">
          No hay ofertas que coincidan con tu búsqueda y filtros actuales. Intenta ajustar los parámetros o limpiar los filtros.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {totalItems} {totalItems === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <Button 
            onClick={loadMore} 
            disabled={loading} 
            variant="outline" 
            size="lg" 
            className="min-w-[200px] rounded-full font-semibold border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {loading ? 'Cargando...' : 'Cargar más ofertas'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default JobList;