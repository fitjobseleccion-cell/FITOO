import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import FormularioContratacion from '@/components/formularios/FormularioContratacion.jsx';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return null;
  }

  const navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Hacer CV', href: '/cv-generator' },
    { label: 'Ofertas de Trabajo', href: '/ofertas-de-trabajo' },
    { label: 'Servicios', href: '/#servicios' },
    { label: 'Cómo Funciona', href: '/#como-funciona' },
    { label: 'Contacto', href: '#footer' }
  ];

  const handleNavClick = (e, href) => {
    setIsMobileMenuOpen(false);
    if (isHomePage && href.startsWith('/#')) {
      e.preventDefault();
      const element = document.querySelector(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href === '#footer') {
      e.preventDefault();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const headerBgClass = isScrolled || !isHomePage
    ? 'bg-background/95 backdrop-blur-md shadow-sm border-border'
    : 'bg-transparent border-transparent';

  const textColorClass = !isHomePage || isScrolled ? 'text-foreground' : 'text-white';
  const navTextColorClass = !isHomePage || isScrolled ? 'text-foreground/80' : 'text-white/90 hover:text-white';
  const adminLinkColorClass = !isHomePage || isScrolled ? 'text-primary' : 'text-white hover:text-white/80';
  const borderColorClass = !isHomePage || isScrolled ? 'border-border' : 'border-white/20';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${headerBgClass}`}>
        <div className="container h-full flex items-center justify-center">
          <div className="navbar-main-container">
            
            {/* LEFT BLOCK: Logo */}
            <div className="navbar-left-block">
              <Link to="/" className="flex items-center space-x-2">
                <span className={`text-2xl font-extrabold tracking-tight ${textColorClass}`}>
                  FITJOB
                </span>
              </Link>
            </div>

            {/* CENTER BLOCK: Navigation Links */}
            <nav className="navbar-center-block">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`navbar-nav-link ${
                    location.pathname === item.href ? 'text-primary' : navTextColorClass
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`navbar-nav-link flex items-center !font-bold ${adminLinkColorClass}`}
                >
                  <ShieldAlert className="w-4 h-4 mr-1" />
                  Administración
                </Link>
              )}
            </nav>

            {/* RIGHT BLOCK: Actions */}
            <div className="navbar-right-block">
              <Button size="sm" onClick={() => setIsFormOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-sm transition-transform active:scale-[0.98] rounded-full px-5">
                Activar Selección
              </Button>

              <a href="https://wa.me/34614971837" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className={`font-semibold rounded-full transition-colors ${!isHomePage || isScrolled ? 'text-foreground border-border hover:bg-muted' : 'bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white'}`}>
                  Hablar con un asesor
                </Button>
              </a>

              {isAuthenticated && currentUser?.tipo_cuenta === 'candidato' && (
                <Link to="/mi-area-profesional">
                  <Button variant="ghost" size="sm" className={`font-medium rounded-full transition-colors ${!isHomePage || isScrolled ? 'text-foreground hover:bg-muted' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}>
                    Mi Área Profesional
                  </Button>
                </Link>
              )}

              {isAuthenticated && currentUser?.tipo_cuenta === 'empresa' && (
                <Link to="/panel-empresa">
                  <Button variant="ghost" size="sm" className={`font-medium rounded-full transition-colors ${!isHomePage || isScrolled ? 'text-foreground hover:bg-muted' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}>
                    Panel de Empresa
                  </Button>
                </Link>
              )}

              {isAuthenticated ? (
                <Link to="/reviews/new">
                  <Button variant="ghost" size="sm" className={`font-medium rounded-full transition-colors ${!isHomePage || isScrolled ? 'text-foreground hover:bg-muted' : 'text-white/90 hover:bg-white/10 hover:text-white'}`}>
                    Escribir reseña
                  </Button>
                </Link>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-not-allowed">
                        <Button variant="ghost" size="sm" disabled className={`font-medium rounded-full pointer-events-none ${!isHomePage || isScrolled ? 'text-muted-foreground' : 'text-white/60'}`}>
                          Escribir reseña
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Debes iniciar sesión para escribir una reseña</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <div className={`pl-3 border-l ${borderColorClass} flex items-center gap-2`}>
                {isAuthenticated ? (
                  <>
                    <div className={`hidden xl:flex items-center gap-2 text-sm font-medium ${!isHomePage || isScrolled ? 'text-foreground' : 'text-white'}`}>
                      <User className="w-4 h-4" />
                      <span className="max-w-[100px] truncate">{currentUser?.name || currentUser?.email?.split('@')[0]}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout} title="Cerrar sesión" className={`rounded-full ${!isHomePage || isScrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'}`}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className={`font-medium rounded-full ${!isHomePage || isScrolled ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10 hover:text-white'}`}>
                      Iniciar sesión
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* RESPONSIVE: Mobile Block */}
            <div className="navbar-mobile-block">
              <Button size="sm" onClick={() => setIsFormOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-sm transition-transform active:scale-[0.98] rounded-full px-4 text-xs md:text-sm">
                Activar Selección
              </Button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 transition-colors ${
                  !isHomePage || isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-white/80'
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="xl:hidden bg-background border-b border-border shadow-lg absolute w-full left-0 top-20 max-h-[calc(100vh-80px)] overflow-y-auto">
            <nav className="container py-6 flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && currentUser?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-primary py-2 flex items-center">
                  <ShieldAlert className="w-5 h-5 mr-2" />
                  Administración
                </Link>
              )}
              
              <div className="pt-4 border-t border-border flex flex-col gap-3">
                <a href="https://wa.me/34614971837" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="lg" className="w-full font-semibold rounded-full">
                    Hablar con un asesor
                  </Button>
                </a>

                {isAuthenticated && currentUser?.tipo_cuenta === 'candidato' && (
                  <Link to="/mi-area-profesional" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" size="lg" className="w-full font-medium rounded-full">
                      Mi Área Profesional
                    </Button>
                  </Link>
                )}

                {isAuthenticated && currentUser?.tipo_cuenta === 'empresa' && (
                  <Link to="/panel-empresa" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="secondary" size="lg" className="w-full font-medium rounded-full">
                      Panel de Empresa
                    </Button>
                  </Link>
                )}

                {isAuthenticated ? (
                  <>
                    <Link to="/reviews/new" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="secondary" size="lg" className="w-full font-medium rounded-full">
                        Escribir reseña
                      </Button>
                    </Link>
                    <div className="pt-4 mt-2 border-t border-border/50 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground px-2">
                        <User className="w-4 h-4" />
                        <span>{currentUser?.name || currentUser?.email?.split('@')[0]}</span>
                      </div>
                      <Button variant="ghost" size="lg" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full rounded-full justify-start text-muted-foreground">
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar sesión
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button size="lg" disabled className="w-full bg-muted text-muted-foreground font-medium rounded-full">
                      Escribir reseña (Requiere login)
                    </Button>
                    <div className="pt-4 mt-2 border-t border-border/50">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="ghost" size="lg" className="w-full rounded-full">
                          Iniciar sesión
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <FormularioContratacion isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
};

export default Header;