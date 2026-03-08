// src/components/auth/GoogleOneTap.tsx
import { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

declare global {
  interface Window {
    google?: any;
  }
}

export default function GoogleOneTap() {
  const { user } = useAuth();
  const oneTapRef = useRef(false);

  useEffect(() => {
    // Si ya está autenticado, no mostrar One Tap
    if (user || oneTapRef.current) return;

    // Cargar el script de Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Tu Google Client ID
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Mostrar el prompt de One Tap
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('One Tap no se mostró:', notification.getNotDisplayedReason());
          }
        });

        oneTapRef.current = true;
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [user]);

  const handleCredentialResponse = async (response: any) => {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) throw error;
      
      console.log('Usuario autenticado:', data);
    } catch (error) {
      console.error('Error en autenticación con Google One Tap:', error);
    }
  };

  return null; // Este componente no renderiza nada visible
}