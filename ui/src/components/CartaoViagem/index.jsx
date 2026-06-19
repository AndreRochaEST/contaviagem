import React, { useState } from 'react';
import { calcularOrcamento, filtrarDespesas, agruparDespesasPorCategoria, calcularGastosPorPessoa } from '../../utils';
import './index.less';

import CabecalhoOrcamento from './CabecalhoOrcamento';
import SeccaoMembros from './SeccaoMembros';
import SeccaoAcertos from './SeccaoAcertos';
import SeccaoGraficos from './SeccaoGraficos';
import SeccaoDespesas from './SeccaoDespesas';

function CartaoViagem({ 
  viagem, despesas, membros = [], filtroTexto, filtroCategoria,
  onEdit, onDelete, onEditDespesa, onDeleteDespesa, onAddMembro, onDeleteMembro, onLiquidar
}) {
  const [mostrarMembros, setMostrarMembros] = useState(false);
  const [mostrarAcertos, setMostrarAcertos] = useState(false);
  const [tipoGrafico, setTipoGrafico] = useState('categoria');

  const todasDespesasDaViagem = despesas.filter(d => d.viagem_id === viagem.id);
  const membrosDaViagem = membros.filter(m => m.viagem_id === viagem.id);
  const despesasReais = todasDespesasDaViagem.filter(d => !d.descricao.startsWith('Liquidação: '));
  
  const totalGastoNumerico = despesasReais.reduce((acc, d) => acc + d.valor, 0);
  const { totalGasto, orcamentoRestante, excedido } = calcularOrcamento(viagem.orcamento, totalGastoNumerico);
  const corGasto = excedido ? '#dc2626' : '#16a34a';
  const corRestante = orcamentoRestante < 0 ? '#dc2626' : '#475569';

  const despesasFiltradas = filtrarDespesas(todasDespesasDaViagem, filtroTexto, filtroCategoria);
  
  const gastosPorCategoria = agruparDespesasPorCategoria(despesasReais);
  const gastosPorPessoa = calcularGastosPorPessoa(despesasReais, membrosDaViagem);

  const dadosExibicao = tipoGrafico === 'categoria' ? gastosPorCategoria : gastosPorPessoa;
  const dadosGrafico = Object.entries(dadosExibicao).map(([name, value]) => ({ name, value }));

  return (
    <div className="card-viagem">
      <CabecalhoOrcamento 
        viagem={viagem} totalGasto={totalGasto} orcamentoRestante={orcamentoRestante} 
        excedido={excedido} corGasto={corGasto} corRestante={corRestante} 
        onEdit={onEdit} onDelete={onDelete} 
      />

      <SeccaoMembros 
        mostrarMembros={mostrarMembros} setMostrarMembros={setMostrarMembros} setMostrarAcertos={setMostrarAcertos}
        membrosDaViagem={membrosDaViagem} todasDespesasDaViagem={todasDespesasDaViagem} 
        onDeleteMembro={onDeleteMembro} onAddMembro={onAddMembro} viagemId={viagem.id}
      />

      <SeccaoAcertos 
        mostrarAcertos={mostrarAcertos} setMostrarAcertos={setMostrarAcertos} setMostrarMembros={setMostrarMembros}
        membrosDaViagem={membrosDaViagem} todasDespesasDaViagem={todasDespesasDaViagem} 
        totalGastoNumerico={totalGastoNumerico} viagem={viagem} onLiquidar={onLiquidar}
      />

      <SeccaoGraficos 
        dadosGrafico={dadosGrafico} dadosExibicao={dadosExibicao} 
        tipoGrafico={tipoGrafico} setTipoGrafico={setTipoGrafico}
      />

      <SeccaoDespesas 
        despesasFiltradas={despesasFiltradas} membros={membros}
        onEditDespesa={onEditDespesa} onDeleteDespesa={onDeleteDespesa}
      />
    </div>
  );
}

export default CartaoViagem;