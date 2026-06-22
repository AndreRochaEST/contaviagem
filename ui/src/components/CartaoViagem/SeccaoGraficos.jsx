import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatarMoeda, CORES_GRAFICO } from '../../utils';

const SeccaoGraficos = ({ dadosGrafico, dadosExibicao, tipoGrafico, setTipoGrafico }) => {
  if (dadosGrafico.length === 0) return null;

  return (
    <React.Fragment>
      <div className="card-viagem__grafico-toggle">
        <button className={`card-viagem__btn-grafico ${tipoGrafico === 'categoria' ? 'ativo' : ''}`} onClick={() => setTipoGrafico('categoria')}>📊 Por Categoria</button>
        <button className={`card-viagem__btn-grafico ${tipoGrafico === 'pessoa' ? 'ativo' : ''}`} onClick={() => setTipoGrafico('pessoa')}>👤 Por Pessoa</button>
        <button className={`card-viagem__btn-grafico ${tipoGrafico === 'etapa' ? 'ativo' : ''}`} onClick={() => setTipoGrafico('etapa')}>📍 Por Etapa</button>
      </div>
      <div className="card-viagem__chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={dadosGrafico} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value" animationDuration={600}>
              {dadosGrafico.map((entry, index) => <Cell key={`cell-${index}`} fill={CORES_GRAFICO[index % CORES_GRAFICO.length]} />)}
            </Pie>
            <Tooltip formatter={(value) => formatarMoeda(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="card-viagem__metricas">
        {Object.entries(dadosExibicao).map(([nome, valor], index) => (
          <span key={nome} className="card-viagem__metrica-badge" style={{ '--badge-color': CORES_GRAFICO[index % CORES_GRAFICO.length] }}>
            {nome}: {formatarMoeda(valor)}
          </span>
        ))}
      </div>
    </React.Fragment>
  );
};

export default SeccaoGraficos;