import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Smartphone } from 'lucide-react';
import { useConsentContext } from '@/contexts/CookieConsentContext.jsx';
import FormularioContratacion from '@/components/formularios/FormularioContratacion.jsx';

const Footer = () => {
  const { openPreferences } = useConsentContext();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <footer className="bg-slate-950 text-slate-300 py-16 mt-auto" id="footer">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            <div className="space-y-4">
              <span className="text-2xl font-extrabold text-white tracking-tight">FITJOB</span>
              <p className="text-sm leading-relaxed text-slate-400">
                Encontramos, filtramos y validamos candidatos para que solo entrevistes perfiles preparados para incorporarse.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6">Contacto</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href="mailto:fitjob.seleccion@gmail.com" className="hover:text-white transition-colors">fitjob.seleccion@gmail.com</a>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href="tel:+34919519018" className="hover:text-white transition-colors">919 519 018</a>
                </li>
                <li className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-primary shrink-0" />
                  <a href="tel:+34614971837" className="hover:text-white transition-colors">614 971 837</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6">Servicios</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/#servicios" className="hover:text-white transition-colors">Nuestros Servicios</Link>
                </li>
                <li>
                  <Link to="/#como-funciona" className="hover:text-white transition-colors">Cómo Funciona</Link>
                </li>
                <li>
                  <button onClick={() => setIsFormOpen(true)} className="text-primary hover:text-primary/80 font-medium transition-colors bg-transparent border-none p-0 cursor-pointer">Activar Selección</button>
                </li>
                <li>
                  <a href="https://forms.gle/p98HiR1LWUeCy45Z9" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Soy Candidato</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-6">Legal y Privacidad</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/aviso-legal" className="hover:text-white transition-colors">Aviso Legal</Link>
                </li>
                <li>
                  <Link to="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-white transition-colors">Política de Privacidad</Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="hover:text-white transition-colors">Política de Cookies</Link>
                </li>
                <li>
                  <button 
                    onClick={openPreferences}
                    className="hover:text-white transition-colors text-left bg-transparent border-none p-0 cursor-pointer"
                  >
                    Preferencias de Cookies
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} FITJOB SL. Todos los derechos reservados.</p>
            <div className="flex space-x-4">
              <span>Selección de Personal B2B</span>
            </div>
          </div>
        </div>
      </footer>

      <FormularioContratacion isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
};

export default Footer;