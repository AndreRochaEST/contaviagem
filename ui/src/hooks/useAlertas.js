import { useEffect } from 'react';
import { useToast } from './useToast';
import { formatarMoeda } from '../utils';

export function useAlertas(viagens, despesas, membros) {
    const { mostrarErro, mostrarSucesso } = useToast();

    useEffect(() => {
        if (!viagens || !despesas) return;

        viagens.forEach(viagem => {
            const despesasViagem = despesas.filter(d => d.viagem_id === viagem.id && !d.descricao.startsWith('Liquidação:'));
            const total = despesasViagem.reduce((acc, d) => acc + d.valor, 0);
            const percent = viagem.orcamento > 0 ? (total / viagem.orcamento) * 100 : 0;
            if (percent > 90) {
                mostrarErro(`⚠️ Viagem "${viagem.destino}" gastou ${percent.toFixed(0)}% do orçamento!`);
            } else if (percent > 70) {
                mostrarSucesso(`ℹ️ Viagem "${viagem.destino}" já gastou ${percent.toFixed(0)}% do orçamento.`);
            }
        });

        const hoje = new Date();
        viagens.forEach(viagem => {
            if (viagem.data_de_inicio) {
                const inicio = new Date(viagem.data_de_inicio);
                const diff = (inicio - hoje) / (1000 * 60 * 60 * 24);
                if (diff >= 0 && diff <= 3) {
                    mostrarSucesso(`✈️ "${viagem.destino}" começa em ${Math.ceil(diff)} dias! Prepara a checklist.`);
                }
            }
        });

        viagens.forEach(viagem => {
            const membrosViagem = membros.filter(m => m.viagem_id === viagem.id);
            const despesasViagem = despesas.filter(d => d.viagem_id === viagem.id);
            import('../utils/calculations').then(({ calcularTransacoesAcerto }) => {
                const transacoes = calcularTransacoesAcerto(membrosViagem, despesasViagem);
                if (transacoes.length > 0) {
                    const totalDevido = transacoes.reduce((acc, t) => acc + t.valor, 0);
                    mostrarErro(`💸 Viagem "${viagem.destino}" tem ${transacoes.length} dívidas por liquidar (total ${formatarMoeda(totalDevido)}).`);
                }
            });
        });

    }, [viagens, despesas, membros]);
}