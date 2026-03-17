// src/hooks/useIsAdmin.ts
import { useAuth } from '../contexts/AuthContext';

export function useIsAdmin() {
  const { user } = useAuth();
  
  // Verificar is_admin en user_metadata y app_metadata
  const isAdmin = 
    user?.user_metadata?.is_admin === true ||
    user?.app_metadata?.is_admin === true;
  
  // Debug: ver qué datos tiene el usuario
  console.log('User metadata:', user?.user_metadata);
  console.log('App metadata:', user?.app_metadata);
  console.log('Is admin:', isAdmin);
  
  return isAdmin;
}