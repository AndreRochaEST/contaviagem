import React, { useState } from 'react';
import { useEtapaOrcamento } from '../../hooks';
import { formatarMoeda } from '../../utils';
import './index.less';

const OrcamentoEtapa = ({ viagem, despesas, orcamentoTotal }) => {
    const { etapasOrcamento, criarOuAtualizar, apagar } = useEtapaOrcamento(viagem.id);
    const [editandoIndex, setEditandoIndex] = useState(null);
    const [valorInput, setValorInput] = useState('');

    const gastosPorEtapa = despesas
        .filter(d => d.viagem_id === viagem.id && !d.descricao.startsWith('Liquidação:'))
        .reduce((acc, d) => {
            const etapa = d.etapa || 'Geral';
            acc[etapa] = (acc[etapa] || 0) + d.valor;
            return acc;
        }, {});

    const etapas = viagem.etapas ? viagem.etapas.split(',').map(e => e.trim()).filter(e => e) : [];
    const todasEtapas = [...new Set([viagem.destino, ...etapas])];

    const dadosEtapas = todasEtapas.map(nome => {
        const orc = etapasOrcamento.find(e => e.etapa_nome === nome);
        return {
            nome,
            orcamento: orc ? orc.orcamento : null,
            uid: orc ? orc.uid : null,
            gasto: gastosPorEtapa[nome] || 0,
        };
    });

    const handleSave = async (index) => {
        const item = dadosEtapas[index];
        const nome = item.nome;
        const uid = item.uid;
        console.log("handleSave chamado para:", nome, "valor:", valorInput);

        const novoValor = parseFloat(valorInput);
        if (isNaN(novoValor) || novoValor < 0) {
            alert("Por favor, insere um valor válido (maior ou igual a zero).");
            return;
        }

        if (novoValor > orcamentoTotal) {
            alert(`O orçamento para "${nome}" não pode exceder o orçamento total da viagem (${formatarMoeda(orcamentoTotal)}).`);
            return;
        }

        const somaAtual = dadosEtapas.reduce((acc, item, idx) => {
            const val = idx === index ? novoValor : (item.orcamento || 0);
            return acc + val;
        }, 0);

        if (somaAtual > orcamentoTotal) {
            alert(`A soma de todos os orçamentos das etapas (${formatarMoeda(somaAtual)}) excede o orçamento total da viagem (${formatarMoeda(orcamentoTotal)}).`);
            return;
        }

        try {
            const resultado = await criarOuAtualizar(nome, novoValor);
            console.log("Resultado da operação:", resultado);
            if (resultado && resultado.sucesso) {
                setEditandoIndex(null);
                setValorInput('');
            } else {
                console.error("Erro ao guardar:", resultado?.erro);
                alert("Erro ao guardar o orçamento. Tenta novamente.");
            }
        } catch (error) {
            console.error("Exceção:", error);
            alert("Ocorreu um erro inesperado.");
        }
    };

    const handleDelete = async (uid) => {
        if (window.confirm('Remover orçamento para esta etapa?')) {
            await apagar(uid);
        }
    };

    const iniciarEdicao = (index, valorAtual) => {
        setEditandoIndex(index);
        setValorInput(valorAtual !== null ? valorAtual.toString() : '');
    };

    return (
        <div className="orcamento-etapa">
            <h4 className="orcamento-etapa__titulo">Orçamento por Etapa</h4>
            <div className="orcamento-etapa__lista">
                {dadosEtapas.map((item, index) => (
                    <div key={index} className="orcamento-etapa__item">
                        <span className="orcamento-etapa__nome">{item.nome}</span>
                        <div className="orcamento-etapa__valores">
                            {item.orcamento !== null ? (
                                <>
                                    <span className="orcamento-etapa__orcamento">
                                        {formatarMoeda(item.orcamento)}
                                    </span>
                                    <span className="orcamento-etapa__gasto" style={{ color: item.gasto > item.orcamento ? '#dc2626' : '#16a34a' }}>
                                        ({formatarMoeda(item.gasto)})
                                    </span>
                                    {editandoIndex === index ? (
                                        <>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={valorInput}
                                                onChange={(e) => setValorInput(e.target.value)}
                                                className="orcamento-etapa__input"
                                            />
                                            <button onClick={() => handleSave(index)} className="orcamento-etapa__btn-save">💾</button>
                                            <button onClick={() => setEditandoIndex(null)} className="orcamento-etapa__btn-cancel">✖</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => iniciarEdicao(index, item.orcamento)} className="orcamento-etapa__btn-edit">✏️</button>
                                            <button onClick={() => handleDelete(item.uid)} className="orcamento-etapa__btn-delete">🗑️</button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span className="orcamento-etapa__sem-orc">Sem orçamento</span>
                                    <button onClick={() => iniciarEdicao(index, null)} className="orcamento-etapa__btn-add">+</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrcamentoEtapa;