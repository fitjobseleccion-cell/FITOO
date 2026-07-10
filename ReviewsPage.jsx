import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, PenLine, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReviewCard from '@/components/ReviewCard.jsx';
import ReviewSEO from '@/components/ReviewSEO.jsx';
import { useReviews } from '@/hooks/useReviews.js';

const ReviewsPage = () => {
  const { fetchReviews, getReviewStats, loading } = useReviews();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0, distribution: {} });
  const [sortFilter, setSortFilter] = useState('recent');
  const [typeFilter, setTypeFilter] = useState('todas'); // Frontend filter

  const loadData = async () => {
    const s = await getReviewStats();
    setStats(s);

    let sort = '-created';
    if (sortFilter === 'highest') sort = '-rating,-created';
    if (sortFilter === 'lowest') sort = 'rating,-created';

    const res = await fetchReviews(1, 50, 'status="approved"', sort); // Fetched more to allow frontend filtering
    if (res) setReviews(res.items);
  };

  useEffect(() => {
    loadData();
  }, [sortFilter]);

  // Frontend filtering logic
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const isEmpresa = r.expand?.userId?.tipo_cuenta === 'empresa';
      const isCandidato = r.expand?.userId?.tipo_cuenta === 'candidato';

      if (typeFilter === 'empresas') return isEmpresa;
      if (typeFilter === 'candidatos') return isCandidato;
      return true; // 'todas'
    });
  }, [reviews, typeFilter]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <ReviewSEO averageRating={stats.average} reviewCount={stats.total} />
      
      <div className="container max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Opiniones de Clientes</h1>
            <p className="text-muted-foreground text-lg">Descubre lo que dicen sobre nuestros servicios</p>
          </div>
          <Link to="/reviews/new">
            <Button size="lg" className="rounded-full">
              <PenLine className="w-4 h-4 mr-2" />
              Escribir Reseña
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="text-center mb-6">
                <div className="text-6xl font-extrabold text-foreground mb-2">{stats.average}</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(stats.average) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Basado en {stats.total} reseñas</p>
              </div>

              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution[star] || 0;
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1 w-12">
                        <span>{star}</span>
                        <Star className="w-3 h-3 fill-muted-foreground text-muted-foreground" />
                      </div>
                      <Progress value={percentage} className="h-2 flex-1" />
                      <div className="w-8 text-right text-muted-foreground">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-muted-foreground mr-1 hidden sm:block" />
                <Button 
                  variant={typeFilter === 'todas' ? 'default' : 'outline'} 
                  onClick={() => setTypeFilter('todas')}
                  size="sm"
                  className="rounded-full"
                >
                  Todas
                </Button>
                <Button 
                  variant={typeFilter === 'empresas' ? 'default' : 'outline'} 
                  onClick={() => setTypeFilter('empresas')}
                  size="sm"
                  className="rounded-full"
                >
                  Empresas
                </Button>
                <Button 
                  variant={typeFilter === 'candidatos' ? 'default' : 'outline'} 
                  onClick={() => setTypeFilter('candidatos')}
                  size="sm"
                  className="rounded-full"
                >
                  Candidatos
                </Button>
              </div>

              <Select value={sortFilter} onValueChange={setSortFilter}>
                <SelectTrigger className="w-[180px] shrink-0">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="highest">Mejor valoradas</SelectItem>
                  <SelectItem value="lowest">Peor valoradas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : filteredReviews.length > 0 ? (
              <div className="space-y-6">
                {filteredReviews.map(review => (
                  <ReviewCard key={review.id} review={review} onUpdate={loadData} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-2xl border border-border border-dashed">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h4 className="text-lg font-medium mb-2">Aún no hay reseñas</h4>
                <p className="text-muted-foreground">No se encontraron reseñas con los filtros seleccionados.</p>
                {typeFilter !== 'todas' && (
                  <Button variant="link" onClick={() => setTypeFilter('todas')} className="mt-2">
                    Ver todas las reseñas
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;