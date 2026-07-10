import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

export const useAdminAuth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'admin' && user.role !== 'reclutador') {
        toast.error('Acceso denegado: Se requieren permisos de administrador.');
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  return { isAuthorized: user && (user.role === 'admin' || user.role === 'reclutador'), user };
};

export const useOfertaForm = (initialData = {}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const addArrayItem = (field, value) => {
    if (!value?.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), value] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index) || []
    }));
  };

  return { formData, setFormData, errors, setErrors, handleChange, addArrayItem, removeArrayItem };
};

export const useCandidatoFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState('fecha_desc');
  const [page, setPage] = useState(1);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return { filters, updateFilter, sort, setSort, page, setPage };
};

export const useReporteData = (filters) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        if (isMounted) {
          setData({
            ofertasPorMes: [
              { name: 'Ene', ofertas: 4 }, { name: 'Feb', ofertas: 6 },
              { name: 'Mar', ofertas: 8 }, { name: 'Abr', ofertas: 5 }
            ],
            candidatosPorOferta: [
              { name: 'Frontend Dev', candidatos: 45 },
              { name: 'Marketing', candidatos: 82 },
              { name: 'Sistemas', candidatos: 12 }
            ],
            estadosDistribucion: [
              { name: 'Recibido', value: 400 },
              { name: 'En revisión', value: 300 },
              { name: 'Preseleccionado', value: 100 },
              { name: 'Descartado', value: 200 }
            ],
            conversionPromedio: 15.4,
            tiempoSeleccionPromedio: 12
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [JSON.stringify(filters)]);

  return { data, loading };
};