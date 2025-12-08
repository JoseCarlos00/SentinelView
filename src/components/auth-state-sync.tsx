'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/use-auth';

interface AuthStateSyncProps {
  accessToken: string | null;
}

/**
 * Este componente no renderiza nada. Su único propósito es sincronizar
 * el accessToken (obtenido del servidor) con el store de Zustand en el cliente.
 */
export function AuthStateSync({ accessToken }: AuthStateSyncProps) {
  const setToken = useAuth((state) => state.setToken);

  useEffect(() => {
    setToken(accessToken);
  }, [accessToken, setToken]);

  return null; // No renderiza UI
}
