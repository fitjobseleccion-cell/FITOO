import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { getCandidateDashboardData } from '@/lib/dashboardDataFetcher.js';
import { Loader2, AlertCircle } from 'lucide-react';

import CVSection from './dashboard/CVSection.jsx';
import CandidaturasSection from './dashboard/CandidaturasSection.jsx';
import PremiumServicesSection from './dashboard/PremiumServicesSection.jsx';
import CoursesSection from './dashboard/CoursesSection.jsx';
import InterviewsSection from './dashboard/InterviewsSection.jsx';
import RecommendationsSection from './dashboard/RecommendationsSection.jsx';
import ActivityTimelineSection from './dashboard/ActivityTimelineSection.jsx';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const dashboardData = await getCandidateDashboardData(user.id);
        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('No hemos podido cargar algunos datos de tu panel. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleEditCV = () => navigate('/cv-generator');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Cargando tu área profesional...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Error de conexión</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 dark:bg-background min-h-screen pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
            Mi Área Profesional
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Hola {user?.name || user?.email?.split('@')[0] || 'Candidato'}, aquí tienes un resumen de tu actividad, candidaturas y progreso profesional.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          
          {/* 1. CV Section */}
          <CVSection user={user} cvData={data?.cvData} onEditCV={handleEditCV} />

          {/* 2. Candidaturas Section */}
          <CandidaturasSection candidaturas={data?.candidaturas} />

          {/* 3. Premium Services Section */}
          <PremiumServicesSection services={data?.premiumServices} />

          {/* 4. Activity Timeline Section */}
          <ActivityTimelineSection data={data} />

          {/* 5. Courses Section (Conditional) */}
          {data?.courses && data.courses.length > 0 && (
            <CoursesSection courses={data.courses} />
          )}

          {/* 6. Interviews Section (Conditional) */}
          {data?.interviews && data.interviews.length > 0 && (
            <InterviewsSection interviews={data.interviews} />
          )}

          {/* 7. Recommendations Section (Conditional) */}
          {data?.recommendations && data.recommendations.length > 0 && (
            <RecommendationsSection recommendations={data.recommendations} />
          )}
          
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;