import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  formatarMoeda, 
  calcularOrcamento, 
  filtrarDespesas, 
  agruparDespesasPorCategoria, 
  CORES_GRAFICO 
} from '../../utils';
import './index.less';

function CartaoViagem({ 
  viagem, 
  despesas, 
  filtroTexto, 
  filtroCategoria,
  onEdit,
  onDelete,
  onEditDespesa,
  onDeleteDespesa
}) {
  const todasDespesasDaViagem = despesas.filter(d => d.viagem_id === viagem.id);
  
  const totalGastoNumerico = todasDespesasDaViagem.reduce((acc, d) => acc + d.valor, 0);
  const { totalGasto, orcamentoRestante, excedido } = calcularOrcamento(viagem.orcamento, totalGastoNumerico);
  
  const despesasFiltradas = filtrarDespesas(todasDespesasDaViagem, filtroTexto, filtroCategoria);
  const gastosPorCategoria = agruparDespesasPorCategoria(todasDespesasDaViagem);

  const corGasto = excedido ? '#dc2626' : '#16a34a';
  const corRestante = orcamentoRestante < 0 ? '#dc2626' : '#475569';

  const dadosGrafico = Object.entries(gastosPorCategoria).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="card-viagem">
      <div className="card-viagem__header">
        <h2 className="card-viagem__destino">{viagem.destino}</h2>
        <div className="card-viagem__acoes">
          <button 
            className="card-viagem__btn-edit" 
            onClick={() => onEdit(viagem)}
            title="Editar Viagem"
          >
            ✏️
          </button>
          <button 
            className="card-viagem__btn-delete" 
            onClick={() => onDelete(viagem.uid)}
            title="Apagar Viagem"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="card-viagem__datas">
        📅 {viagem.data_de_inicio} até {viagem.data_de_fim}
      </p>

      <div className="card-viagem__budget-bar">
        <div className="card-viagem__budget-resumo">
          <span>Plano: <strong>{formatarMoeda(viagem.orcamento)}</strong></span>
          <span>
            Gasto: <strong className="card-viagem__budget-gasto-valor" style={{ '--gasto-color': corGasto }}>{formatarMoeda(totalGasto)}</strong>
          </span>
        </div>
        <div className="card-viagem__budget-restante" style={{ '--restante-color': corRestante }}>
          {orcamentoRestante < 0 
            ? `Excedido em ${formatarMoeda(Math.abs(orcamentoRestante))}` 
            : `Disponível: ${formatarMoeda(orcamentoRestante)}`
          }
        </div>
      </div>

      {dadosGrafico.length > 0 && (
        <div className="card-viagem__chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dadosGrafico}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
              >
                {dadosGrafico.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CORES_GRAFICO[index % CORES_GRAFICO.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatarMoeda(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {Object.keys(gastosPorCategoria).length > 0 && (
        <div className="card-viagem__metricas">
          {Object.entries(gastosPorCategoria).map(([cat, valor], index) => (
            <span key={cat} className="card-viagem__metrica-badge" style={{ '--badge-color': CORES_GRAFICO[index % CORES_GRAFICO.length] }}>
              {cat}: {formatarMoeda(valor)}
            </span>
          ))}
        </div>
      )}

      <h4 className="card-viagem__gastos-titulo">Gastos Registados:</h4>
      <ul className="card-viagem__gastos-lista">
        {despesasFiltradas.length === 0 ? (
          <li className="card-viagem__gasto-vazio">Nenhum gasto encontrado para os filtros ativos.</li>
        ) : (
          despesasFiltradas.map(d => (
            <li key={d.uid} className="card-viagem__gasto-item">
              <div>
                <span className="card-viagem__gasto-descricao">{d.descricao}</span>
                <small className="card-viagem__gasto-tag">{d.categoria_name || d.categoria_nome}</small>
              </div>
              <div className="card-viagem__gasto-acoes">
                <span className="card-viagem__gasto-valor">{formatarMoeda(d.valor)}</span>
                <button 
                  className="card-viagem__btn-edit" 
                  onClick={() => onEditDespesa(d)}
                >
                  ✏️
                </button>
                <button 
                  className="card-viagem__btn-delete" 
                  onClick={() => onDeleteDespesa(d.uid)}
                >
                  ✖
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default CartaoViagem;