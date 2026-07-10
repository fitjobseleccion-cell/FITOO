import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, UserPlus, Building, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirm: '', tipoAccount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/reviews/new';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirm) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    if (!formData.tipoAccount) {
      toast.error('Por favor, selecciona tu tipo de cuenta.');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    const result = await signup(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('¡Cuenta creada con éxito!');
      navigate(returnTo, { replace: true });
    } else {
      toast.error(result.error || 'Error al crear la cuenta.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
      >
        <div className="px-8 pt-10 pb-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Crear Cuenta</h2>
            <p className="text-slate-500">Únete a FITJOB y comparte tu experiencia</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="!pl-11 block w-full bg-slate-50 rounded-lg text-slate-900 focus:ring-primary focus:border-primary border-slate-200"
                  placeholder="Juan Pérez"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="!pl-11 block w-full bg-slate-50 rounded-lg text-slate-900 focus:ring-primary focus:border-primary border-slate-200"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="!pl-11 block w-full bg-slate-50 rounded-lg text-slate-900 focus:ring-primary focus:border-primary border-slate-200"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
                  className="!pl-11 block w-full bg-slate-50 rounded-lg text-slate-900 focus:ring-primary focus:border-primary border-slate-200"
                  placeholder="Repite tu contraseña"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de cuenta *</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, tipoAccount: 'empresa'})}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    formData.tipoAccount === 'empresa' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                  }`}
                >
                  <Building className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">Soy empresa</span>
                  <span className="text-xs opacity-80 mt-1">Busco candidatos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, tipoAccount: 'candidato'})}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    formData.tipoAccount === 'candidato' 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">Soy candidato</span>
                  <span className="text-xs opacity-80 mt-1">Busco empleo</span>
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg rounded-xl mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Creando cuenta...'
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Regístrate
                </>
              )}
            </Button>
          </form>
        </div>
        
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            ¿Ya tienes cuenta?{' '}
            <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;