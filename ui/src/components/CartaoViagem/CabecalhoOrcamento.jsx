import React from 'react';
import { formatarMoeda } from '../../utils';

const CabecalhoOrcamento = ({ viagem, totalGasto, orcamentoRestante, excedido, corGasto, corRestante, onEdit, onDelete }) => (
  <React.Fragment>
    <div className="card-viagem__header">
      <h2 className="card-viagem__destino">{viagem.destino}</h2>
      <div className="card-viagem__acoes">
        <button className="card-viagem__btn-edit" onClick={() => onEdit(viagem)} title="Editar Viagem">✏️</button>
        <button className="card-viagem__btn-delete" onClick={() => onDelete(viagem.uid)} title="Apagar Viagem">🗑️</button>
      </div>
    </div>
    <p className="card-viagem__datas">📅 {viagem.data_de_inicio} até {viagem.data_de_fim}</p>
    <div className="card-viagem__budget-bar">
      <div className="card-viagem__budget-resumo">
        <span>Plano: <strong>{formatarMoeda(viagem.orcamento)}</strong></span>
        <span>Gasto: <strong className="card-viagem__budget-gasto-valor" style={{ '--gasto-color': corGasto }}>{formatarMoeda(totalGasto)}</strong></span>
      </div>
      <div className="card-viagem__budget-restante" style={{ '--restante-color': corRestante }}>
        {orcamentoRestante < 0 ? `Excedido em ${formatarMoeda(Math.abs(orcamentoRestante))}` : `Disponível: ${formatarMoeda(orcamentoRestante)}`}
      </div>
    </div>
  </React.Fragment>
);

export default CabecalhoOrcamento;