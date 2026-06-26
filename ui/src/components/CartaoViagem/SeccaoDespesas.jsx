import React from 'react';
import { formatarMoeda } from '../../utils';

const SeccaoDespesas = ({ despesasFiltradas, membros, onEditDespesa, onDeleteDespesa }) => (
  <React.Fragment>
    <h4 className="card-viagem__gastos-titulo">Gastos Registados:</h4>
    <ul className="card-viagem__gastos-lista">
      {despesasFiltradas.length === 0 ? (
        <li className="card-viagem__gasto-vazio">Nenhum gasto encontrado para os filtros ativos.</li>
      ) : (
        despesasFiltradas.map(d => {
          const isLiquidacao = d.descricao.startsWith('Liquidação: ');
          const isDivisaoExata = !!d.divisao_exata;
          
          return (
            <li key={d.uid} className="card-viagem__gasto-item" style={{ opacity: isLiquidacao ? 0.6 : 1 }}>
              <div>
                <span className="card-viagem__gasto-descricao">
                  {isLiquidacao ? '💸 ' : ''}{d.descricao}
                  {isDivisaoExata && !isLiquidacao && <span title="Divisão Assimétrica Exata" style={{ marginLeft: '6px', fontSize: '0.85rem' }}>⚖️</span>}
                </span>
                <small className="card-viagem__gasto-tag">{d.categoria_name || d.categoria_nome}</small>
                {d.pago_por_id && !isLiquidacao && (
                  <small className="card-viagem__gasto-pagador" style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                    Pago por: <strong>{membros.find(m => String(m.id) === String(d.pago_por_id))?.nome || 'Desconhecido'}</strong>
                    {!isDivisaoExata && d.envolvidos_ids && <span style={{ fontStyle: 'italic', marginLeft: '4px', color: '#94a3b8' }}>(apenas para alguns)</span>}
                  </small>
                )}
              </div>
              <div className="card-viagem__gasto-acoes">
                <span className="card-viagem__gasto-valor" style={{ color: isLiquidacao ? '#16a34a' : '#334155' }}>{isLiquidacao ? '+' : ''}{formatarMoeda(d.valor)}</span>
                <button className="card-viagem__btn-edit" onClick={() => onEditDespesa(d)}>✏️</button>
                <button className="card-viagem__btn-delete" onClick={() => onDeleteDespesa(d.uid)}>✖</button>
              </div>
            </li>
          );
        })
      )}
    </ul>
  </React.Fragment>
);

export default SeccaoDespesas;