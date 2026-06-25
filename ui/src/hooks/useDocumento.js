import { useState, useEffect, useCallback } from 'react';
import { callService } from '../utils';

export function useDocumento(viagemId) {
  const [documentos, setDocumentos] = useState([]);

  const carregarDocumentos = useCallback(async () => {
    if (!viagemId) return;
    const result = await callService({ url: `/documento?viagem_id=${viagemId}`, method: 'GET' });
    if (result && result.sucesso) {
      setDocumentos(result.data || []);
    }
  }, [viagemId]);

  useEffect(() => {
    carregarDocumentos();
  }, [carregarDocumentos]);

  const criarDocumento = async (dados) => {
    return await callService({ url: '/documento', method: 'POST', data: dados });
  };

  const apagarDocumento = async (uid) => {
    return await callService({ url: '/documento', method: 'DELETE', data: { uid } });
  };

  return { documentos, carregarDocumentos, criarDocumento, apagarDocumento };
}