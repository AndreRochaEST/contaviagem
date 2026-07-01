import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calcularOrcamento, calcularTransacoesAcerto, formatarMoeda } from './calculations';

export const gerarPDFViagem = (viagem, despesasReais, membros) => {
  const doc = new jsPDF();
  const margemEsq = 14;

  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text(`Relatório de Viagem: ${viagem.destino}`, margemEsq, 22);

  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  const dataTexto = viagem.data_de_inicio ? `${viagem.data_de_inicio} até ${viagem.data_de_fim}` : 'Datas não definidas';
  doc.text(`Período: ${dataTexto}`, margemEsq, 30);

  const totalGastoNum = despesasReais.reduce((acc, d) => acc + d.valor, 0);
  const { orcamentoRestante, excedido } = calcularOrcamento(viagem.orcamento, totalGastoNum);
  
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('Resumo Financeiro', margemEsq, 42);
  
  doc.setFontSize(10);
  doc.text(`Orçamento Planeado: ${formatarMoeda(viagem.orcamento)}`, margemEsq, 48);
  doc.text(`Total Gasto: ${formatarMoeda(totalGastoNum)}`, margemEsq, 54);
  
  doc.setTextColor(excedido ? 220 : 22, excedido ? 38 : 163, excedido ? 38 : 74);
  doc.text(`Saldo Disponível: ${formatarMoeda(orcamentoRestante)}`, margemEsq, 60);

  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text('Lista de Gastos', margemEsq, 72);

  const dadosDespesas = despesasReais.map(d => {
    const pagador = membros.find(m => String(m.id) === String(d.pago_por_id))?.nome || 'N/A';
    const categoria = d.categoria_name || d.categoria_nome || 'Geral';
    return [d.descricao, categoria, pagador, formatarMoeda(d.valor)];
  });

  autoTable(doc, {
    startY: 76,
    head: [['Descrição do Gasto', 'Categoria', 'Pago por', 'Valor']],
    body: dadosDespesas,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 },
  });

  const transacoes = calcularTransacoesAcerto(membros, despesasReais);
  
  if (transacoes.length > 0) {
    const finalY = doc.lastAutoTable.finalY || 76;
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text('Acerto de Contas (Dívidas Ativas)', margemEsq, finalY + 12);

    const dadosTransacoes = transacoes.map(t => [t.de, '➡️', t.para, formatarMoeda(t.valor)]);

    autoTable(doc, {
      startY: finalY + 16,
      head: [['Quem deve', '', 'A quem pagar', 'Valor']],
      body: dadosTransacoes,
      theme: 'grid',
      headStyles: { fillColor: [245, 158, 11] },
      styles: { fontSize: 10, halign: 'center' },
      columnStyles: { 0: { halign: 'left' }, 2: { halign: 'left' } }
    });
  }

  // 5. Guardar o ficheiro
  const nomeFicheiro = `Relatorio_${viagem.destino.replace(/\s+/g, '_')}.pdf`;
  doc.save(nomeFicheiro);
};