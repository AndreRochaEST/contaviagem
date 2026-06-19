import React from 'react';
import { formatarMoeda } from '../../utils';

const SeccaoAcertos = ({ mostrarAcertos, setMostrarAcertos, setMostrarMembros, membrosDaViagem, todasDespesasDaViagem, totalGastoNumerico, viagem, onLiquidar }) => {
  
  const calcularAcertos = () => {
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

  const acertos = calcularAcertos();

  const partilharWhatsApp = () => {
    let texto = `🛫 *Resumo da Viagem: ${viagem.destino}*\n📅 ${viagem.data_de_inicio} até ${viagem.data_de_fim}\n💰 *Total Gasto:* ${formatarMoeda(totalGastoNumerico)}\n\n`;
    if (membrosDaViagem.length > 0) {
      texto += `👥 *Quem pagou o quê:*\n`;
      membrosDaViagem.forEach(m => {
        const totalPago = todasDespesasDaViagem.filter(d => String(d.pago_por_id) === String(m.id)).reduce((acc, curr) => acc + curr.valor, 0);
        texto += `- ${m.nome}: ${formatarMoeda(totalPago)}\n`;
      });
      texto += `\n`;
    }
    if (acertos.length > 0) {
      texto += `⚖️ *Acerto de Contas:*\n`;
      acertos.forEach(t => { texto += `- ${t.de} ➡️ ${t.para}: ${formatarMoeda(t.valor)}\n`; });
    } else if (membrosDaViagem.length > 1) {
      texto += `⚖️ *Acerto de Contas:*\nTudo certo! Ninguém deve a ninguém. 🎉\n`;
    }
    texto += `\n_(Gerado via ContaViagem ✈️)_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  return (
    <div className="card-viagem__membros-container" style={{ marginTop: '-10px' }}>
      <button className="card-viagem__membros-toggle" onClick={() => { setMostrarAcertos(!mostrarAcertos); setMostrarMembros(false); }}>
        <span>⚖️ Acerto de Contas</span>
        <span>{mostrarAcertos ? '▲' : '▼'}</span>
      </button>

      {mostrarAcertos && (
        <div className="card-viagem__membros-content">
          {membrosDaViagem.length < 2 ? (
            <span className="card-viagem__membro-vazio">Adiciona pelo menos 2 participantes.</span>
          ) : totalGastoNumerico === 0 ? (
            <span className="card-viagem__membro-vazio">Ainda não há gastos para dividir.</span>
          ) : (
            <React.Fragment>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '10px' }}>
                  Total a dividir: <strong>{formatarMoeda(totalGastoNumerico)}</strong>
                </li>
                {acertos.length === 0 ? (
                  <li className="card-viagem__membro-vazio" style={{ color: '#16a34a', fontWeight: 'bold' }}>Tudo certo! Ninguém deve a ninguém. 🎉</li>
                ) : (
                  acertos.map((t, idx) => (
                    <li key={idx} style={{ padding: '10px 0', borderBottom: idx === acertos.length - 1 ? 'none' : '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                      <span><strong>{t.de}</strong> ➡️ <strong>{t.para}</strong></span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#dc2626', fontWeight: 'bold' }}>{formatarMoeda(t.valor)}</span>
                        <button onClick={() => onLiquidar(viagem.id, t.deId, t.paraId, t.valor, t.de, t.para)} style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>✅ Pagar</button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
              <button onClick={partilharWhatsApp} style={{ width: '100%', marginTop: '15px', background: '#25D366', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                📱 Partilhar no WhatsApp
              </button>
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
};

export default SeccaoAcertos;