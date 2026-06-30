import React from 'react';
import { formatarMoeda } from '../../utils';
import './index.less';

function AnalyticsGlobal({ dados }) {
  if (!dados) return null;

  const categoriasOrdenadas = (dados.porCategoria || [])
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  return (
    <div className="analytics-global">
      <div className="analytics-global__card">
        <span className="analytics-global__label">Total Investido</span>
        <h2 className="analytics-global__value">{formatarMoeda(dados.totalGasto)}</h2>
      </div>

      <div className="analytics-global__card">
        <span className="analytics-global__label">Viagens Planeadas</span>
        <h2 className="analytics-global__value analytics-global__value--blue">
          {dados.totalViagens}
        </h2>
      </div>

      <div className="analytics-global__card">
        <span className="analytics-global__label">Média por Viagem</span>
        <h2 className="analytics-global__value analytics-global__value--green">
          {formatarMoeda(dados.mediaPorViagem)}
        </h2>
      </div>

      <div className="analytics-global__card">
        <span className="analytics-global__label">Maiores Gastos</span>
        <div className="analytics-global__list">
          {categoriasOrdenadas.length === 0 && (
            <span className="analytics-global__list-empty">Sem registos</span>
          )}
          
          {categoriasOrdenadas.map((c, idx) => (
            <div key={idx} className="analytics-global__list-item">
              <span className="analytics-global__list-name">{c.categoria}</span>
              <span className="analytics-global__list-total">{formatarMoeda(c.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsGlobal;