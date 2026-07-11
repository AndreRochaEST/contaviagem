import { useState, useEffect, useCallback } from 'react';
import { callService } from '../utils';

export function useTransporte(viagemId) {
  const [transportes, setTransportes] = useState([]);

  const carregarTransportes = useCallback(async () => {
    if (!viagemId) return;
    const result = await callService({ url: `/transporte?viagem_id=${viagemId}`, method: 'GET' });
    if (result && result.sucesso) setTransportes(result.data || []);
  }, [viagemId]);

  useEffect(() => { carregarTransportes(); }, [carregarTransportes]);

  const criarTransporte = async (dados) => await callService({ url: '/transporte', method: 'POST', data: dados });
  const apagarTransporte = async (uid) => await callService({ url: '/transporte', method: 'DELETE', data: { uid } });
  const atualizarTransporte = async (dados) => await callService({ url: '/transporte', method: 'PUT', data: dados });

  return { transportes, carregarTransportes, criarTransporte, atualizarTransporte, apagarTransporte };
}