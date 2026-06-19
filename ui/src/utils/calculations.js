export const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-PT', { 
    style: 'currency', 
    currency: 'EUR' 
  }).format(valor);
};

export const calcularOrcamento = (orcamento, totalGasto) => {
  return {
    totalGasto,
    orcamentoRestante: orcamento - totalGasto,
    percentualGasto: (totalGasto / orcamento) * 100,
    excedido: totalGasto > orcamento
  };
};

export const filtrarDespesas = (despesas, filtroTexto, filtroCategoria) => {
  return despesas.filter(d => {
    const nomeCat = d.categoria_name || d.categoria_nome || '';
    const bateTexto = d.descricao.toLowerCase().includes(filtroTexto.toLowerCase());
    const bateCategoria = filtroCategoria === 'todos' || nomeCat === filtroCategoria;
    return bateTexto && bateCategoria;
  });
};

export const agruparDespesasPorCategoria = (despesas) => {
  return despesas.reduce((acc, d) => {
    const cat = d.categoria_name || d.categoria_nome;
    acc[cat] = (acc[cat] || 0) + d.valor;
    return acc;
  }, {});
};

export const calcularGastosPorPessoa = (despesasReais, membrosDaViagem) => {
  return despesasReais.reduce((acc, d) => {
    const pagador = membrosDaViagem.find(m => String(m.id) === String(d.pago_por_id));
    const nome = pagador ? pagador.nome : 'Sem atribuição';
    if (!acc[nome]) acc[nome] = 0;
    acc[nome] += d.valor;
    return acc;
  }, {});
};

export const calcularTransacoesAcerto = (membrosDaViagem, todasDespesasDaViagem) => {
  if (membrosDaViagem.length < 2 || todasDespesasDaViagem.length === 0) return [];
  let saldosArray = membrosDaViagem.map(m => ({ id: String(m.id), nome: m.nome, saldo: 0 }));

  todasDespesasDaViagem.forEach(d => {
    const valor = d.valor;
    let envolvidosIds = (d.envolvidos_ids || "").split(',').filter(id => id.trim() !== "");
    if (envolvidosIds.length === 0) envolvidosIds = membrosDaViagem.map(m => String(m.id));
    const quotaPorPessoa = valor / envolvidosIds.length;

    if (d.pago_por_id) {
      const pagador = saldosArray.find(s => s.id === String(d.pago_por_id));
      if (pagador) pagador.saldo += valor;
    }
    envolvidosIds.forEach(envId => {
      const envolvido = saldosArray.find(s => s.id === String(envId));
      if (envolvido) envolvido.saldo -= quotaPorPessoa;
    });
  });

  let devedores = saldosArray.filter(s => s.saldo < -0.01).map(s => ({ ...s, saldo: Math.abs(s.saldo) }));
  let credores = saldosArray.filter(s => s.saldo > 0.01);
  let transacoes = [];
  let i = 0, j = 0;

  while (i < devedores.length && j < credores.length) {
    let dev = devedores[i], cred = credores[j];
    let valor = Math.min(dev.saldo, cred.saldo);
    transacoes.push({ de: dev.nome, deId: dev.id, para: cred.nome, paraId: cred.id, valor });
    dev.saldo -= valor;
    cred.saldo -= valor;
    if (dev.saldo < 0.01) i++;
    if (cred.saldo < 0.01) j++;
  }
  return transacoes;
};
