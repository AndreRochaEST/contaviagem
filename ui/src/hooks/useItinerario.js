import { useState, useEffect, useCallback } from 'react';
import { callService } from '../utils';

export function useItinerario(viagemId) {
  const [itinerarios, setItinerarios] = useState([]);

  const carregarItinerarios = useCallback(async () => {
    if (!viagemId) return;
    const result = await callService({ url: `/itinerario?viagem_id=${viagemId}`, method: 'GET' });
    if (result && result.sucesso) {
      setItinerarios(result.data || []);
    }
  }, [viagemId]);

  useEffect(() => {
    carregarItinerarios();
  }, [carregarItinerarios]);

  const criarItinerario = async (dados) => {
    return await callService({ url: '/itinerario', method: 'POST', data: dados });
  };

  const atualizarItinerario = async (dados) => {
    return await callService({ url: '/itinerario/atualizar', method: 'POST', data: dados });
  };

  const apagarItinerario = async (uid) => {
    return await callService({ url: '/itinerario', method: 'DELETE', data: { uid } });
  };

  return { itinerarios, carregarItinerarios, criarItinerario, atualizarItinerario, apagarItinerario };
}