import React from 'react';
import { formatarMoeda, gerarPDFViagem } from '../../utils';

const CabecalhoOrcamento = ({ 
  viagem, totalGasto, orcamentoRestante, excedido, 
  corGasto, corRestante, onEdit, onDelete, despesas, membros, onArquivar
}) => {

  const handleExportarPDF = () => {
    const despesasDaViagem = despesas.filter(d => d.viagem_id === viagem.id);
    const despesasReais = despesasDaViagem.filter(d => !d.descricao.startsWith('Liquidação: '));
    const membrosDaViagem = membros.filter(m => m.viagem_id === viagem.id);
    
    gerarPDFViagem(viagem, despesasReais, membrosDaViagem);
  };

  return (
    <div className="card-viagem__header">
      
      <div className="card-viagem__header-top">
        <div className="card-viagem__destino-box">
          <h3 className="card-viagem__destino">
            {viagem.destino}
          </h3>
          {viagem.etapas && (
            <span className="card-viagem__etapas">
              📍 {viagem.etapas}
            </span>
          )}
        </div>
        
        <div className="card-viagem__acoes-topo">
          <button className="card-viagem__btn-pdf" onClick={handleExportarPDF} title="Exportar Relatório em PDF">
            📄 PDF
          </button>
          <button 
            onClick={() => onArquivar(viagem.uid)} 
            title={viagem.arquivada ? "Restaurar Viagem" : "Arquivar Viagem"} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0' }}
          >
            {viagem.arquivada ? '📤' : '📦'}
          </button>
          <button className="card-viagem__btn-edit" onClick={() => onEdit(viagem)} title="Editar Viagem">✏️</button>
          <button className="card-viagem__btn-delete" onClick={() => onDelete(viagem.uid)} title="Apagar Viagem">🗑️</button>
        </div>
      </div>

      <div className="card-viagem__resumo-box">
        
        <div className="card-viagem__datas">
          📅 {viagem.data_de_inicio} a {viagem.data_de_fim}
        </div>
        
        <div className="card-viagem__orcamento-row">
          <div className="card-viagem__orcamento-item">
            <span>PLANO</span>
            <strong>{formatarMoeda(viagem.orcamento)}</strong>
          </div>
          <div className="card-viagem__orcamento-item" style={{ textAlign: 'right' }}>
            <span>GASTO</span>
            <strong style={{ color: corGasto }}>{formatarMoeda(totalGasto)}</strong>
          </div>
        </div>
        
        <div className="card-viagem__orcamento-destaque" style={{ color: corRestante }}>
          <span>Disponível</span>
          <span>{formatarMoeda(orcamentoRestante)}</span>
        </div>
        
      </div>

    </div>
  );
};

export default CabecalhoOrcamento;