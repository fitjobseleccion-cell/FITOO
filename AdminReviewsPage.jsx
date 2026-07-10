import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useReviews } from '@/hooks/useReviews.js';
import ReviewCard from '@/components/ReviewCard.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AdminReviewsPage = () => {
  const { fetchReviews, updateReview } = useReviews();
  const [pending, setPending] = useState([]);
  const [reported, setReported] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const p = await fetchReviews(1, 50, 'status="pending"');
    if (p) setPending(p.items);
    
    const r = await pb.collection('review_reports').getList(1, 50, {
      filter: 'status="pending"',
      expand: 'reviewId,reviewId.userId,reviewId.serviceId',
      $autoCancel: false
    });
    setReported(r.items);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    await updateReview(id, { status: 'approved' });
    loadData();
  };

  const handleReject = async (id) => {
    await updateReview(id, { status: 'rejected' });
    loadData();
  };

  const handleResolveReport = async (reportId) => {
    await pb.collection('review_reports').update(reportId, { status: 'resolved' }, { $autoCancel: false });
    toast.success('Reporte resuelto');
    loadData();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Reseñas</h1>
        <Button variant="outline">Exportar CSV</Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pendientes ({pending.length})</TabsTrigger>
          <TabsTrigger value="reported">Reportadas ({reported.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {pending.length === 0 ? (
            <p className="text-muted-foreground">No hay reseñas pendientes.</p>
          ) : (
            pending.map(review => (
              <div key={review.id} className="relative">
                <ReviewCard review={review} />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="default" onClick={() => handleApprove(review.id)}>Aprobar</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(review.id)}>Rechazar</Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="reported" className="space-y-6">
          {reported.length === 0 ? (
            <p className="text-muted-foreground">No hay reseñas reportadas.</p>
          ) : (
            reported.map(report => (
              <div key={report.id} className="bg-card p-6 rounded-xl border border-destructive/50 shadow-sm">
                <div className="mb-4 pb-4 border-b border-border">
                  <h4 className="font-semibold text-destructive mb-1">Motivo del reporte:</h4>
                  <p className="text-sm">{report.reason}</p>
                </div>
                {report.expand?.reviewId && (
                  <ReviewCard review={report.expand.reviewId} />
                )}
                <div className="mt-4 flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleResolveReport(report.id)}>Marcar Resuelto</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(report.expand?.reviewId?.id)}>Eliminar Reseña</Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReviewsPage;