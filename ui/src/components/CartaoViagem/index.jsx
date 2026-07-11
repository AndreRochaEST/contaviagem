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
import SeccaoMapa from './SeccaoMapa';
import SeccaoCofre from './SeccaoCofre';
import SeccaoTransportes from './SeccaoTransportes';
import OrcamentoEtapa from '../OrcamentoEtapa';

function CartaoViagem({ 
  viagem, despesas, membros = [], categorias = [], tarefas = [], filtroTexto, filtroCategoria,
  onEdit, onDelete, onEditDespesa, onDeleteDespesa, onAddMembro, onDeleteMembro, onLiquidar,
  onAddTarefa, onToggleTarefa, onDeleteTarefa, onArquivar
}) {
  const [mostrarMembros, setMostrarMembros] = useState(false);
  const [mostrarAcertos, setMostrarAcertos] = useState(false);
  const [mostrarChecklist, setMostrarChecklist] = useState(false);
  const [mostrarItinerario, setMostrarItinerario] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [mostrarCofre, setMostrarCofre] = useState(false);
  const [mostrarTransportes, setMostrarTransportes] = useState(false);
  const [tipoGrafico, setTipoGrafico] = useState('categoria');
  const [mostrarOrcamentoEtapa, setMostrarOrcamentoEtapa] = useState(false);

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
        despesas={todasDespesasDaViagem} membros={membrosDaViagem}
        onArquivar={onArquivar}
      />

      <div className="card-viagem__membros-container">
        <button 
          className="card-viagem__membros-toggle" 
          onClick={() => setMostrarOrcamentoEtapa(!mostrarOrcamentoEtapa)}
        >
          <span>📊 Orçamento por Etapa</span>
          <span>{mostrarOrcamentoEtapa ? '▲' : '▼'}</span>
        </button>
        {mostrarOrcamentoEtapa && (
          <div className="card-viagem__membros-content">
            <OrcamentoEtapa viagem={viagem} despesas={despesas} orcamentoTotal={viagem.orcamento} />
          </div>
        )}
      </div>

      <SeccaoMembros 
        mostrarMembros={mostrarMembros} setMostrarMembros={setMostrarMembros} 
        setMostrarAcertos={setMostrarAcertos} setMostrarChecklist={setMostrarChecklist}
        setMostrarItinerario={setMostrarItinerario} setMostrarMapa={setMostrarMapa}
        setMostrarCofre={setMostrarCofre} setMostrarTransportes={setMostrarTransportes}
        membrosDaViagem={membrosDaViagem} todasDespesasDaViagem={todasDespesasDaViagem} 
        onDeleteMembro={onDeleteMembro} onAddMembro={onAddMembro} viagemId={viagem.id}
      />

      <SeccaoCofre
        mostrarCofre={mostrarCofre} setMostrarCofre={setMostrarCofre}
        setMostrarMembros={setMostrarMembros} setMostrarAcertos={setMostrarAcertos}
        setMostrarChecklist={setMostrarChecklist} setMostrarItinerario={setMostrarItinerario}
        setMostrarMapa={setMostrarMapa} setMostrarTransportes={setMostrarTransportes}
        viagemId={viagem.id}
        membros={membros}
      />

      <SeccaoTransportes
        mostrarTransportes={mostrarTransportes} setMostrarTransportes={setMostrarTransportes}
        setMostrarMembros={setMostrarMembros} setMostrarAcertos={setMostrarAcertos}
        setMostrarChecklist={setMostrarChecklist} setMostrarItinerario={setMostrarItinerario}
        setMostrarMapa={setMostrarMapa} setMostrarCofre={setMostrarCofre}
        viagemId={viagem.id}
      />

      <SeccaoItinerario
        mostrarItinerario={mostrarItinerario} setMostrarItinerario={setMostrarItinerario}
        setMostrarMembros={setMostrarMembros} setMostrarAcertos={setMostrarAcertos}
        setMostrarChecklist={setMostrarChecklist} setMostrarMapa={setMostrarMapa}
        setMostrarCofre={setMostrarCofre} setMostrarTransportes={setMostrarTransportes}
        viagem={viagem}
      />

      <SeccaoMapa
        mostrarMapa={mostrarMapa} setMostrarMapa={setMostrarMapa}
        setMostrarMembros={setMostrarMembros} setMostrarAcertos={setMostrarAcertos}
        setMostrarChecklist={setMostrarChecklist} setMostrarItinerario={setMostrarItinerario}
        setMostrarCofre={setMostrarCofre} setMostrarTransportes={setMostrarTransportes}
        viagem={viagem}
      />

      <SeccaoChecklist 
        mostrarChecklist={mostrarChecklist} setMostrarChecklist={setMostrarChecklist}
        setMostrarMembros={setMostrarMembros} setMostrarAcertos={setMostrarAcertos}
        setMostrarItinerario={setMostrarItinerario} setMostrarMapa={setMostrarMapa}
        setMostrarCofre={setMostrarCofre} setMostrarTransportes={setMostrarTransportes}
        viagemId={viagem.id} 
      />

      <SeccaoAcertos 
        mostrarAcertos={mostrarAcertos} setMostrarAcertos={setMostrarAcertos} 
        setMostrarMembros={setMostrarMembros} setMostrarChecklist={setMostrarChecklist}
        setMostrarItinerario={setMostrarItinerario} setMostrarMapa={setMostrarMapa}
        setMostrarCofre={setMostrarCofre} setMostrarTransportes={setMostrarTransportes}
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