import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(pb.authStore.model);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (pb.authStore.isValid) {
        try {
          // Verify and refresh token on mount to ensure session persistence
          await pb.collection('users').authRefresh({ $autoCancel: false });
          setUser(pb.authStore.model);
        } catch (error) {
          // Un token caducado o inválido al cargar es un caso esperado y
          // recuperable (no un fallo de la app): simplemente cerramos la
          // sesión local y dejamos que se muestre el login con normalidad.
          // Se usa console.warn en vez de console.error para que entornos
          // de preview que tratan cualquier error de consola como "app
          // caída" (como el de Horizons) no bloqueen la carga de la web
          // por algo que ya está gestionado correctamente aquí.
          console.warn('Sesión no válida o caducada, cerrando sesión local:', error?.message || error);
          pb.authStore.clear();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setUser(pb.authStore.model);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Correo electrónico o contraseña incorrectos.';
      if (error?.status === 404) {
        errorMessage = 'No existe ninguna cuenta asociada a este correo electrónico.';
      }
      return { success: false, error: errorMessage };
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      await pb.collection('users').create({
        email: userData.email,
        password: userData.password,
        passwordConfirm: userData.passwordConfirm,
        name: userData.name,
        tipo_cuenta: userData.tipoAccount
      }, { $autoCancel: false });

      await pb.collection('users').authWithPassword(userData.email, userData.password, { $autoCancel: false });
      setUser(pb.authStore.model);
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message || 'Error al crear la cuenta.' };
    }
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
    toast.success('Sesión cerrada correctamente');
  }, []);

  const value = {
    user,
    currentUser: user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};