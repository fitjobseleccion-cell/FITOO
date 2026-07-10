import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Mail, Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/reviews/new';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    
    if (result.success) {
      toast.success('¡Bienvenido de nuevo!');
      navigate(returnTo, { replace: true });
    } else {
      toast.error(result.error);
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
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Inicia sesión</h2>
            <p className="text-slate-500 mb-2">Accede a tu cuenta para compartir tu experiencia.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="!pl-11 block w-full bg-slate-50 rounded-lg text-slate-900" 
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
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="!pl-11 block w-full bg-slate-50 rounded-lg text-slate-900" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg rounded-xl" disabled={isSubmitting}>
              {isSubmitting ? 'Iniciando sesión...' : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Iniciar sesión
                </>
              )}
            </Button>
          </form>
        </div>
        
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            ¿No tienes cuenta?{' '}
            <Link to={`/signup?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;