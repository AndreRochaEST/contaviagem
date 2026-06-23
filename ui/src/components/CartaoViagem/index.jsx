import React, { useState } from 'react';
import { calcularOrcamento, filtrarDespesas, agruparDespesasPorCategoria, calcularGastosPorPessoa, agruparDespesasPorEtapa } from '../../utils';
import './index.less';

import CabecalhoOrcamento from './CabecalhoOrcamento';
import SeccaoMembros from './SeccaoMembros';
import SeccaoAcertos from './SeccaoAcertos';
import SeccaoGraficos from './SeccaoGraficos';
import SeccaoDespesas from './SeccaoDespesas';
import SeccaoChecklist from './SeccaoChecklist';
import SeccaoItinerario from './SeccaoItinerario';

function CartaoViagem({ 
  viagem, despesas, membros = [], categorias = [], tarefas = [], filtroTexto, filtroCategoria,
  onEdit, onDelete, onEditDespesa, onDeleteDespesa, onAddMembro, onDeleteMembro, onLiquidar,
  onAddTarefa, onToggleTarefa, onDeleteTarefa
}) {
  const [mostrarMembros, setMostrarMembros] = useState(false);
  const [mostrarAcertos, setMostrarAcertos] = useState(false);
  const [mostrarChecklist, setMostrarChecklist] = useState(false);
  const [mostrarItinerario, setMostrarItinerario] = useState(false);
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
  const gastosPorEtapa = agruparDespesasPorEtapa(despesasReais);

  const dadosExibicao = tipoGrafico === 'categoria' ? gastosPorCategoria : tipoGrafico === 'pessoa' ? gastosPorPessoa : gastosPorEtapa;
  const dadosGrafico = Object.entries(dadosExibicao).map(([name, value]) => ({ name, value }));

  return (
    <div className="card-viagem">
      <CabecalhoOrcamento 
        viagem={viagem} totalGasto={totalGasto} orcamentoRestante={orcamentoRestante} 
        excedido={excedido} corGasto={corGasto} corRestante={corRestante} 
        onEdit={onEdit} onDelete={onDelete} 
      />

      <SeccaoMembros 
        mostrarMembros={mostrarMembros} setMostrarMembros={setMostrarMembros} 
        setMostrarAcertos={setMostrarAcertos} setMostrarChecklist={setMostrarChecklist}
        setMostrarItinerario={setMostrarItinerario}
        membrosDaViagem={membrosDaViagem} todasDespesasDaViagem={todasDespesasDaViagem} 
        onDeleteMembro={onDeleteMembro} onAddMembro={onAddMembro} viagemId={viagem.id}
      />

      <SeccaoItinerario
        mostrarItinerario={mostrarItinerario} setMostrarItinerario={setMostrarItinerario}
        setMostrarMembros={setMostrarMembros} setMostrarAcertos={setMostrarAcertos}
        setMostrarChecklist={setMostrarChecklist} viagemId={viagem.id}
      />

      <SeccaoChecklist 
        mostrarChecklist={mostrarChecklist} setMostrarChecklist={setMostrarChecklist}
        setMostrarMembros={setMostrarMembros} setMostrarAcertos={setMostrarAcertos}
        setMostrarItinerario={setMostrarItinerario} viagemId={viagem.id} 
      />

      <SeccaoAcertos 
        mostrarAcertos={mostrarAcertos} setMostrarAcertos={setMostrarAcertos} 
        setMostrarMembros={setMostrarMembros} setMostrarChecklist={setMostrarChecklist}
        setMostrarItinerario={setMostrarItinerario}
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