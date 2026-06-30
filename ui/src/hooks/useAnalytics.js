import { useState, useEffect, useCallback } from 'react';
import { callService } from '../utils';

export function useAnalytics() {
  const [dados, setDados] = useState(null);

  const carregarAnalytics = useCallback(async () => {
    const result = await callService({ url: '/analytics', method: 'GET' });
    if (result && result.sucesso) {
      setDados(result);
    }
  }, []);

  useEffect(() => {
    carregarAnalytics();
  }, [carregarAnalytics]);

  return { dados, carregarAnalytics };
}