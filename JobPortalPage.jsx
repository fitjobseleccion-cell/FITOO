import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import JobSearchBar from '@/components/JobSearchBar.jsx';
import JobFilters from '@/components/JobFilters.jsx';
import JobList from '@/components/JobList.jsx';

const JobPortalPage = () => {
  const [searchParams, setSearchParams] = useState({ searchTerm: '', location: '' });
  const [filterParams, setFilterParams] = useState({
    contrato: [],
    jornada: [],
    modalidad: [],
    incorporacion_inmediata: false
  });
  const [triggerSearch, setTriggerSearch] = useState(0);

  const handleSearch = (params) => {
    setSearchParams(params);
    setTriggerSearch(prev => prev + 1);
  };

  const handleApplyFilters = () => {
    setTriggerSearch(prev => prev + 1);
  };

  const handleClearFilters = () => {
    setFilterParams({
      contrato: [],
      jornada: [],
      modalidad: [],
      incorporacion_inmediata: false
    });
    setTriggerSearch(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-24 pt-28">
      <Helmet>
        <title>Ofertas de Trabajo | FITJOB</title>
        <meta name="description" content="Encuentra tu próximo empleo. Explora cientos de ofertas de trabajo en las mejores empresas con FITJOB." />
      </Helmet>

      {/* Header Search Section */}
      <section className="bg-primary pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Encuentra tu próximo empleo
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
            Explora las mejores oportunidades laborales diseñadas para tu perfil profesional.
          </p>
          <div className="max-w-4xl mx-auto">
            <JobSearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 xl:w-1/5 shrink-0">
            <JobFilters 
              filters={filterParams} 
              setFilters={setFilterParams} 
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
          </aside>

          {/* Job List */}
          <main className="w-full lg:w-3/4 xl:w-4/5 pt-4 lg:pt-0">
            <JobList 
              searchParams={searchParams} 
              filterParams={filterParams} 
              triggerSearch={triggerSearch} 
            />
          </main>
        </div>
      </section>
    </div>
  );
};

export default JobPortalPage;