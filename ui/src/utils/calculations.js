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
