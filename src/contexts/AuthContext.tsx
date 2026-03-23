// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserWithAdmin extends User {
  is_admin?: boolean;
}

interface AuthContextType {
  user: UserWithAdmin | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithAdmin | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener datos del usuario incluyendo is_admin desde la tabla authors
  const getUserWithAdmin = async (authUser: User | null): Promise<UserWithAdmin | null> => {
    if (!authUser) return null;

    try {
      // Buscar is_admin en la tabla authors por email
      const { data, error } = await supabase
        .from('users')
        .select('is_admin')
        .eq('email', authUser.email)
        .single();
        console.log(data);

      if (error) {
        console.log('Usuario no encontrado en authors, usando is_admin = false');
        return { ...authUser, is_admin: false };
      }

      console.log('✅ Usuario encontrado en authors:', data);
      return { ...authUser, is_admin: data?.is_admin || false };
    } catch (error) {
      console.error('Error buscando is_admin:', error);
      return { ...authUser, is_admin: false };
    }
  };

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const userWithAdmin = await getUserWithAdmin(session?.user ?? null);
      setUser(userWithAdmin);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const userWithAdmin = await getUserWithAdmin(session?.user ?? null);
      setUser(userWithAdmin);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}