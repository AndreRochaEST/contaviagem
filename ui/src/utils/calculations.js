export const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(valor || 0);
};

export const calcularOrcamento = (orcamento, totalGasto) => {
  const orcamentoRestante = orcamento - totalGasto;
  const excedido = orcamentoRestante < 0;
  return { totalGasto, orcamentoRestante, excedido };
};

export const filtrarDespesas = (despesas, texto, categoria) => {
  return despesas.filter(d => {
    const matchTexto = d.descricao.toLowerCase().includes(texto.toLowerCase());
    const matchCat = categoria === 'todos' || d.categoria_name === categoria || d.categoria_nome === categoria;
    return matchTexto && matchCat;
  });
};

export const agruparDespesasPorCategoria = (despesasReais) => {
  return despesasReais.reduce((acc, d) => {
    const cat = d.categoria_name || d.categoria_nome || 'Sem Categoria';
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += d.valor;
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

export const agruparDespesasPorEtapa = (despesasReais) => {
  return despesasReais.reduce((acc, d) => {
    const etapa = d.etapa || 'Geral (Sem Etapa)';
    if (!acc[etapa]) acc[etapa] = 0;
    acc[etapa] += d.valor;
    return acc;
  }, {});
};

export const calcularTransacoesAcerto = (membrosDaViagem, todasDespesasDaViagem) => {
  if (membrosDaViagem.length < 2 || todasDespesasDaViagem.length === 0) return [];
  let saldosArray = membrosDaViagem.map(m => ({ id: String(m.id), nome: m.nome, saldo: 0 }));

  todasDespesasDaViagem.forEach(d => {
    const valor = d.valor;
    
    if (d.pago_por_id) {
      const pagador = saldosArray.find(s => s.id === String(d.pago_por_id));
      if (pagador) pagador.saldo += valor;
    }

    let usouDivisaoExata = false;
    
    if (d.divisao_exata) {
      try {
        const divisoes = JSON.parse(d.divisao_exata);
        if (Object.keys(divisoes).length > 0) {
          usouDivisaoExata = true;
          Object.entries(divisoes).forEach(([membroId, valorGasto]) => {
            const envolvido = saldosArray.find(s => s.id === String(membroId));
            if (envolvido) envolvido.saldo -= parseFloat(valorGasto);
          });
        }
      } catch (e) {
        usouDivisaoExata = false;
      }
    }

    if (!usouDivisaoExata) {
      let envolvidosIds = (d.envolvidos_ids || "").split(',').filter(id => id.trim() !== "");
      if (envolvidosIds.length === 0) envolvidosIds = membrosDaViagem.map(m => String(m.id));
      const quotaPorPessoa = valor / envolvidosIds.length;

      envolvidosIds.forEach(envId => {
        const envolvido = saldosArray.find(s => s.id === String(envId));
        if (envolvido) envolvido.saldo -= quotaPorPessoa;
      });
    }
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