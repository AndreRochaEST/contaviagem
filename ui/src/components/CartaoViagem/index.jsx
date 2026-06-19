import React, { useState } from 'react';
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
  membros = [],
  filtroTexto, 
  filtroCategoria,
  onEdit,
  onDelete,
  onEditDespesa,
  onDeleteDespesa,
  onAddMembro,
  onDeleteMembro
}) {
  const [novoMembroNome, setNovoMembroNome] = useState('');
  const [mostrarMembros, setMostrarMembros] = useState(false);
  const [mostrarAcertos, setMostrarAcertos] = useState(false);

  const todasDespesasDaViagem = despesas.filter(d => d.viagem_id === viagem.id);
  const membrosDaViagem = membros.filter(m => m.viagem_id === viagem.id);
  
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

  const handleAddMembro = () => {
    if (!novoMembroNome.trim()) return;
    onAddMembro(viagem.id, novoMembroNome.trim());
    setNovoMembroNome('');
  };

  const calcularAcertos = () => {
    if (membrosDaViagem.length < 2 || totalGastoNumerico === 0) return [];

    const quota = totalGastoNumerico / membrosDaViagem.length;

    const saldos = membrosDaViagem.map(m => {
      const pagou = todasDespesasDaViagem
        .filter(d => String(d.pago_por_id) === String(m.id))
        .reduce((acc, curr) => acc + curr.valor, 0);
      return { nome: m.nome, saldo: pagou - quota };
    });

    let devedores = saldos.filter(s => s.saldo < -0.01).map(s => ({ ...s, saldo: Math.abs(s.saldo) }));
    let credores = saldos.filter(s => s.saldo > 0.01);

    let transacoes = [];
    let i = 0;
    let j = 0;

    while (i < devedores.length && j < credores.length) {
      let devedor = devedores[i];
      let credor = credores[j];

      let valor = Math.min(devedor.saldo, credor.saldo);

      transacoes.push({
        de: devedor.nome,
        para: credor.nome,
        valor: valor
      });

      devedor.saldo -= valor;
      credor.saldo -= valor;

      if (devedor.saldo < 0.01) i++;
      if (credor.saldo < 0.01) j++;
    }

    return transacoes;
  };

  const acertos = calcularAcertos();

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

      <div className="card-viagem__membros-container">
        <button 
          className="card-viagem__membros-toggle"
          onClick={() => { setMostrarMembros(!mostrarMembros); setMostrarAcertos(false); }}
        >
          <span>👥 Participantes ({membrosDaViagem.length})</span>
          <span>{mostrarMembros ? '▲' : '▼'}</span>
        </button>

        {mostrarMembros && (
          <div className="card-viagem__membros-content">
            <div className="card-viagem__membros-lista">
              {membrosDaViagem.length === 0 && <span className="card-viagem__membro-vazio">Nenhum participante adicionado.</span>}
              {membrosDaViagem.map(m => {
                const totalPago = todasDespesasDaViagem
                  .filter(d => String(d.pago_por_id) === String(m.id))
                  .reduce((acc, curr) => acc + curr.valor, 0);

                return (
                  <span key={m.uid} className="card-viagem__membro-badge">
                    {m.nome}
                    {totalPago > 0 && (
                      <span style={{ color: '#16a34a', fontWeight: 'bold', marginLeft: '4px' }}>
                        ({formatarMoeda(totalPago)})
                      </span>
                    )}
                    <button className="card-viagem__membro-remove" onClick={() => onDeleteMembro(m.uid)} title="Remover">✖</button>
                  </span>
                );
              })}
            </div>
            <div className="card-viagem__membros-add">
              <input 
                type="text" 
                className="card-viagem__membros-input"
                placeholder="Adicionar nome..." 
                value={novoMembroNome}
                onChange={e => setNovoMembroNome(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddMembro()}
              />
              <button className="card-viagem__membros-btn" onClick={handleAddMembro}>+</button>
            </div>
          </div>
        )}
      </div>

      <div className="card-viagem__membros-container" style={{ marginTop: '-10px' }}>
        <button 
          className="card-viagem__membros-toggle"
          onClick={() => { setMostrarAcertos(!mostrarAcertos); setMostrarMembros(false); }}
        >
          <span>⚖️ Acerto de Contas</span>
          <span>{mostrarAcertos ? '▲' : '▼'}</span>
        </button>

        {mostrarAcertos && (
          <div className="card-viagem__membros-content">
            {membrosDaViagem.length < 2 ? (
              <span className="card-viagem__membro-vazio">Adiciona pelo menos 2 participantes para fazer acertos.</span>
            ) : totalGastoNumerico === 0 ? (
              <span className="card-viagem__membro-vazio">Ainda não há gastos para dividir.</span>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
                  Quota por pessoa: <strong>{formatarMoeda(totalGastoNumerico / membrosDaViagem.length)}</strong>
                </li>
                {acertos.length === 0 ? (
                  <li className="card-viagem__membro-vazio" style={{ color: '#16a34a', fontWeight: 'bold' }}>Tudo certo! Ninguém deve a ninguém. 🎉</li>
                ) : (
                  acertos.map((t, idx) => (
                    <li key={idx} style={{ padding: '8px 0', borderBottom: idx === acertos.length - 1 ? 'none' : '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                      <span><strong>{t.de}</strong> ➡️ <strong>{t.para}</strong></span>
                      <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{formatarMoeda(t.valor)}</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        )}
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
                {d.pago_por_id && (
                  <small className="card-viagem__gasto-pagador" style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                    Pago por: <strong>{membros.find(m => String(m.id) === String(d.pago_por_id))?.nome || 'Desconhecido'}</strong>
                  </small>
                )}
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