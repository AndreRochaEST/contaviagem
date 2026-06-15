import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatarMoeda, CORES_GRAFICO } from '../../utils';
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
  const totalGasto = todasDespesasDaViagem.reduce((acc, d) => acc + d.valor, 0);
  const orcamentoRestante = viagem.orcamento - totalGasto;

  const despesasFiltradas = todasDespesasDaViagem.filter(d => {
    const nomeCat = d.categoria_name || d.categoria_nome || '';
    const bateTexto = d.descricao.toLowerCase().includes(filtroTexto.toLowerCase());
    const bateCategoria = filtroCategoria === 'todos' || nomeCat === filtroCategoria;
    return bateTexto && bateCategoria;
  });

  const corGasto = totalGasto > viagem.orcamento ? '#dc2626' : '#16a34a';
  const corRestante = orcamentoRestante < 0 ? '#dc2626' : '#475569';

  const gastosPorCategoria = todasDespesasDaViagem.reduce((acc, d) => {
    const cat = d.categoria_name || d.categoria_nome;
    acc[cat] = (acc[cat] || 0) + d.valor;
    return acc;
  }, {});

  const dadosGrafico = Object.entries(gastosPorCategoria).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div key={viagem.uid} className="card-viagem">
      <div className="card-header">
        <h2 className="viagem-destino">{viagem.destino}</h2>
        <div className="acoes-viagem">
          <button 
            className="btn-edit-viagem" 
            onClick={() => onEdit(viagem)}
            title="Editar Viagem"
          >
            ✏️
          </button>
          <button 
            className="btn-delete-viagem" 
            onClick={() => onDelete(viagem.uid)}
            title="Apagar Viagem"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className="viagem-datas">
        📅 {viagem.data_de_inicio} até {viagem.data_de_fim}
      </p>

      <div className="budget-bar">
        <div className="budget-resumo">
          <span>Plano: <strong>{formatarMoeda(viagem.orcamento)}</strong></span>
          <span className="budget-gasto">
          Gasto: <strong className="budget-gasto-valor" style={{ '--gasto-color': corGasto }}>{formatarMoeda(totalGasto)}</strong>
          </span>
        </div>
        <div className="budget-restante" style={{ '--restante-color': corRestante }}>
          {orcamentoRestante < 0 
            ? `Excedido em ${formatarMoeda(Math.abs(orcamentoRestante))}` 
            : `Disponível: ${formatarMoeda(orcamentoRestante)}`
          }
        </div>
      </div>

      {dadosGrafico.length > 0 && (
        <div className="chart-wrapper">
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
        <div className="metricas-categoria">
          {Object.entries(gastosPorCategoria).map(([cat, valor], index) => (
            <span key={cat} className="metrica-badge" style={{ '--badge-color': CORES_GRAFICO[index % CORES_GRAFICO.length] }}>
              {cat}: {formatarMoeda(valor)}
            </span>
          ))}
        </div>
      )}

      <h4 className="gastos-titulo">Gastos Registados:</h4>
      <ul className="gastos-lista">
        {despesasFiltradas.length === 0 ? (
          <li className="gasto-vazio">Nenhum gasto encontrado para os filtros ativos.</li>
        ) : (
          despesasFiltradas.map(d => (
            <li key={d.uid} className="gasto-item">
              <span className="gasto-descricao">
                {d.descricao} 
                <small className="gasto-tag">{d.categoria_name || d.categoria_nome}</small>
              </span>
              <div className="gasto-valores-acoes">
                <span className="gasto-valor">{formatarMoeda(d.valor)}</span>
                <button 
                  className="btn-edit" 
                  onClick={() => onEditDespesa(d)}
                >
                  ✏️
                </button>
                <button 
                  className="btn-delete" 
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
