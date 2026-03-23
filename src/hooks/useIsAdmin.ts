// src/hooks/useIsAdmin.ts
import { useAuth } from '../contexts/AuthContext';

export function useIsAdmin() {
  const { user } = useAuth();
  
  // Verificar is_admin en user_metadata y app_metadata
  const isAdmin = user.is_admin;
  console.log(user);
  
  return isAdmin;
}