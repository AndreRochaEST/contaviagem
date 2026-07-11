import { useState, useEffect, useCallback } from 'react';
import { callService } from '../utils';

export function useEtapaOrcamento(viagemId) {
    const [etapasOrcamento, setEtapasOrcamento] = useState([]);

    const carregar = useCallback(async () => {
        if (!viagemId) return;
        const result = await callService({ url: `/etapa_orcamento?viagem_id=${viagemId}`, method: 'GET' });
        if (result && result.sucesso !== false) {
            setEtapasOrcamento(result);
        }
    }, [viagemId]);

    useEffect(() => { carregar(); }, [carregar]);

    const criarOuAtualizar = async (etapaNome, orcamento) => {
        const existente = etapasOrcamento.find(e => e.etapa_nome === etapaNome);
        const data = { viagem_id: parseInt(viagemId), etapa_nome: etapaNome, orcamento: parseFloat(orcamento) };
        let result;
        if (existente) {
            result = await callService({ url: '/etapa_orcamento', method: 'PUT', data: { uid: existente.uid, orcamento: parseFloat(orcamento) } });
        } else {
            result = await callService({ url: '/etapa_orcamento', method: 'POST', data });
        }
        if (result && result.sucesso) {
            carregar();
        }
        return result;
    };

    const apagar = async (uid) => {
        const result = await callService({ url: '/etapa_orcamento', method: 'DELETE', data: { uid } });
        if (result && result.sucesso) {
            carregar();
        }
        return result;
    };

    return { etapasOrcamento, carregar, criarOuAtualizar, apagar };
}