import React, { useState, useEffect } from 'react';
import './index.less';

import Toast from '../../components/Toast';
import FormViagem from '../../components/FormViagem';
import FormDespesa from '../../components/FormDespesa';
import CartaoViagem from '../../components/CartaoViagem';
import FiltrosDashboard from '../../components/FiltrosDashboard';
import AcoesDashboard from '../../components/AcoesDashboard';

import { useViagem, useDespesa, useCategoria, useToast, useMembro } from '../../hooks';
import { MENSAGENS, CONFIRMACOES } from '../../utils';

function DashboardContainer() {
  const { viagens, carregarViagens, criarViagem, atualizarViagem, apagarViagem } = useViagem();
  const { despesas, criarDespesa, atualizarDespesa, apagarDespesa, carregarDespesas } = useDespesa();
  const { categorias } = useCategoria();
  const { toast, mostrarSucesso, mostrarErro } = useToast();
  const { membros, criarMembro, apagarMembro, carregarMembros } = useMembro();

  const [mostrarFormViagem, setMostrarFormViagem] = useState(false);
  const [mostrarFormDespesa, setMostrarFormDespesa] = useState(false);
  
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  const [editDespesaUid, setEditDespesaUid] = useState(null);
  const [tarefas, setTarefas] = useState([]);
  
  const [formDespesa, setFormDespesa] = useState({
    descricao: '',
    valor: '',
    viagemId: '',
    categoriaId: '',
    membroId: '',
    etapa: '',
    envolvidosIds: [],
    usarCambio: false,
    moeda: 'GBP',
    valorEstrangeiro: '',
    taxaCambio: ''
  });

  const [editViagemUid, setEditViagemUid] = useState(null);
  const [formViagem, setFormViagem] = useState({
    destino: '',
    etapas: '',
    dataInicio: '',
    dataFim: '',
    orcamento: ''
  });

  useEffect(() => {
    if (viagens.length > 0 && !formDespesa.viagemId && !editDespesaUid) {
      setFormDespesa(prev => ({ ...prev, viagemId: viagens[0].id }));
    }
  }, [viagens]);

  useEffect(() => {
    if (categorias.length > 0 && !formDespesa.categoriaId) {
      setFormDespesa(prev => ({ ...prev, categoriaId: categorias[0].id.toString() }));
    }
  }, [categorias]);

  const limparFormDespesa = () => {
    setEditDespesaUid(null);
    setFormDespesa({
      descricao: '',
      valor: '',
      viagemId: viagens[0]?.id || '',
      categoriaId: categorias[0]?.id.toString() || '',
      membroId: '',
      etapa: '',
      envolvidosIds: [],
      usarCambio: false,
      moeda: 'GBP',
      valorEstrangeiro: '',
      taxaCambio: ''
    });
  };

  const limparFormViagem = () => {
    setEditViagemUid(null);
    setFormViagem({
      destino: '',
      etapas: '',
      dataInicio: '',
      dataFim: '',
      orcamento: ''
    });
  };

  const alternarFormViagem = () => {
    if (mostrarFormViagem) limparFormViagem();
    setMostrarFormViagem(!mostrarFormViagem);
    setMostrarFormDespesa(false);
  };

  const alternarFormDespesa = () => {
    if (mostrarFormDespesa) limparFormDespesa();
    setMostrarFormDespesa(!mostrarFormDespesa);
    setMostrarFormViagem(false);
  };

  const iniciarEdicaoDespesa = (d) => {
    setEditDespesaUid(d.uid);
    setFormDespesa({
      descricao: d.descricao,
      valor: d.valor,
      viagemId: d.viagem_id,
      categoriaId: (d.categoria_id || d.categoria_id_selecionada || '').toString(),
      membroId: (d.pago_por_id || '').toString(),
      etapa: d.etapa || '',
      envolvidosIds: d.envolvidos_ids ? d.envolvidos_ids.split(',').filter(x => x) : [],
      usarCambio: false,
      moeda: 'GBP',
      valorEstrangeiro: '',
      taxaCambio: ''
    });
    setMostrarFormDespesa(true);
    setMostrarFormViagem(false);
  };

  const iniciarEdicaoViagem = (v) => {
    setEditViagemUid(v.uid);
    setFormViagem({
      destino: v.destino,
      etapas: v.etapas || '',
      dataInicio: v.data_de_inicio,
      dataFim: v.data_de_fim,
      orcamento: v.orcamento
    });
    setMostrarFormViagem(true);
    setMostrarFormDespesa(false);
  };

  const handleChangeFormDespesa = (field, value) => {
    setFormDespesa(prev => {
      const newState = { ...prev, [field]: value };
      if (newState.usarCambio && (field === 'valorEstrangeiro' || field === 'taxaCambio' || field === 'usarCambio' || field === 'moeda')) {
        const vEst = parseFloat(newState.valorEstrangeiro) || 0;
        const taxa = parseFloat(newState.taxaCambio) || 0;
        if (vEst > 0 && taxa > 0) {
          newState.valor = (vEst * taxa).toFixed(2);
        } else {
          newState.valor = '';
        }
      }
      return newState;
    });

    if ((field === 'moeda' && formDespesa.usarCambio) || (field === 'usarCambio' && value === true)) {
      const exchangeBase = field === 'moeda' ? value : formDespesa.moeda;
      fetch(`https://open.er-api.com/v6/latest/${exchangeBase}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.rates && data.rates.EUR) {
            handleChangeFormDespesa('taxaCambio', data.rates.EUR);
          }
        })
        .catch(() => {});
    }
  };

  const handleChangeFormViagem = (field, value) => {
    setFormViagem(prev => ({ ...prev, [field]: value }));
  };

  const submeterDespesa = async () => {
    if (!formDespesa.descricao || !formDespesa.valor) {
      mostrarErro(MENSAGENS.ERRO_DESPESA_VAZIA);
      return;
    }

    let descricaoFinal = formDespesa.descricao;
    if (formDespesa.usarCambio && formDespesa.valorEstrangeiro && formDespesa.taxaCambio) {
      descricaoFinal += ` (${formDespesa.valorEstrangeiro} ${formDespesa.moeda} à taxa de ${formDespesa.taxaCambio})`;
    }

    const dados = {
      descricao: descricaoFinal,
      valor: parseFloat(formDespesa.valor),
      viagem_id: parseInt(formDespesa.viagemId),
      categoria_id: parseInt(formDespesa.categoriaId),
      pago_por_id: formDespesa.membroId ? parseInt(formDespesa.membroId) : 0,
      envolvidos_ids: formDespesa.envolvidosIds.join(',')
    };

    if (formDespesa.etapa) {
      dados.etapa = formDespesa.etapa;
    }

    if (editDespesaUid) {
      dados.uid = editDespesaUid;
    }

    try {
      const result = editDespesaUid ? await atualizarDespesa(dados) : await criarDespesa(dados);
      if (result.sucesso) {
        limparFormDespesa();
        setMostrarFormDespesa(false);
        mostrarSucesso(editDespesaUid ? MENSAGENS.DESPESA_ATUALIZADA : MENSAGENS.DESPESA_CRIADA);
        if (typeof carregarDespesas === 'function') carregarDespesas();
      } else {
        mostrarErro(MENSAGENS.ERRO_SERVIDOR);
      }
    } catch (error) {
      mostrarErro(MENSAGENS.ERRO_COMUNICACAO);
    }
  };

  const handleLiquidar = async (viagemId, devedorId, credorId, valor, deNome, paraNome) => {
    if (!window.confirm(`Confirmas que o/a ${deNome} pagou ${valor.toFixed(2)}€ ao/à ${paraNome}?`)) return;

    const dados = {
      descricao: `Liquidação: ${deNome} ➡️ ${paraNome}`,
      valor: parseFloat(valor),
      viagem_id: parseInt(viagemId),
      categoria_id: categorias.length > 0 ? parseInt(categorias[0].id) : 1,
      pago_por_id: parseInt(devedorId),
      envolvidos_ids: credorId.toString()
    };

    try {
      const result = await criarDespesa(dados);
      if (result.sucesso) {
        mostrarSucesso('Dívida liquidada com sucesso!');
        if (typeof carregarDespesas === 'function') carregarDespesas();
      } else {
        mostrarErro('Erro ao liquidar dívida.');
      }
    } catch (error) {
      mostrarErro(MENSAGENS.ERRO_COMUNICACAO);
    }
  };

  const submeterViagem = async () => {
    if (!formViagem.destino || !formViagem.dataInicio || !formViagem.dataFim || !formViagem.orcamento) {
      mostrarErro(MENSAGENS.ERRO_VIAGEM_VAZIA);
      return;
    }

    const dados = {
      destino: formViagem.destino,
      etapas: formViagem.etapas,
      data_de_inicio: formViagem.dataInicio,
      data_de_fim: formViagem.dataFim,
      orcamento: parseFloat(formViagem.orcamento)
    };

    if (editViagemUid) dados.uid = editViagemUid;

    try {
      const result = editViagemUid ? await atualizarViagem(dados) : await criarViagem(dados);
      if (result.sucesso) {
        limparFormViagem();
        setMostrarFormViagem(false);
        mostrarSucesso(editViagemUid ? MENSAGENS.VIAGEM_ATUALIZADA : MENSAGENS.VIAGEM_CRIADA);
        if (typeof carregarViagens === 'function') carregarViagens();
      } else {
        mostrarErro(MENSAGENS.ERRO_SERVIDOR);
      }
    } catch (error) {
      mostrarErro(MENSAGENS.ERRO_COMUNICACAO);
    }
  };

  const handleApagarDespesa = async (uid) => {
    if (!window.confirm(CONFIRMACOES.APAGAR_DESPESA)) return;
    try {
      const result = await apagarDespesa(uid);
      if (result.sucesso) {
        mostrarSucesso(MENSAGENS.DESPESA_APAGADA);
        if (typeof carregarDespesas === 'function') carregarDespesas();
      } else {
        mostrarErro(MENSAGENS.ERRO_SERVIDOR);
      }
    } catch (error) {
      mostrarErro(MENSAGENS.ERRO_COMUNICACAO);
    }
  };

  const handleApagarViagem = async (uid) => {
    if (!window.confirm(CONFIRMACOES.APAGAR_VIAGEM)) return;
    try {
      const result = await apagarViagem(uid);
      if (result.sucesso) {
        mostrarSucesso(MENSAGENS.VIAGEM_APAGADA);
        if (typeof carregarViagens === 'function') carregarViagens();
      } else {
        mostrarErro(result.erro || MENSAGENS.ERRO_SERVIDOR);
      }
    } catch (error) {
      mostrarErro(MENSAGENS.ERRO_COMUNICACAO);
    }
  };

  const handleAddMembro = async (viagemId, nome) => {
    const result = await criarMembro({ viagem_id: viagemId, nome });
    if (result.sucesso) {
      if (typeof carregarMembros === 'function') carregarMembros();
      mostrarSucesso('Participante adicionado!');
    } else {
      mostrarErro(MENSAGENS.ERRO_SERVIDOR);
    }
  };

  const handleDeleteMembro = async (uid) => {
    if (!window.confirm('Queres mesmo remover este participante?')) return;
    const result = await apagarMembro(uid);
    if (result.sucesso) {
      if (typeof carregarMembros === 'function') carregarMembros();
      mostrarSucesso('Participante removido!');
    } else {
      mostrarErro(result.erro || MENSAGENS.ERRO_SERVIDOR);
    }
  };

  const handleAddTarefa = (viagemId, texto) => {
    const nova = { uid: Math.random().toString(36).substr(2, 9), viagem_id: viagemId, texto, feito: false };
    setTarefas(prev => [...prev, nova]);
  };

  const handleToggleTarefa = (uid, feito) => {
    setTarefas(prev => prev.map(t => t.uid === uid ? { ...t, feito } : t));
  };

  const handleDeleteTarefa = (uid) => {
    setTarefas(prev => prev.filter(t => t.uid !== uid));
  };

  const viagemSelecionada = viagens.find(v => v.id === (formDespesa.viagemId ? parseInt(formDespesa.viagemId) : null));
  
  let etapasDaViagem = [];
  if (viagemSelecionada && viagemSelecionada.etapas) {
    const extraEtapas = viagemSelecionada.etapas.split(',').map(e => e.trim()).filter(e => e !== '');
    if (extraEtapas.length > 0) {
      etapasDaViagem = [...new Set([viagemSelecionada.destino, ...extraEtapas])];
    }
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Dashboard ContaViagem ✈️</h1>
      
      <Toast toast={toast} />

      <AcoesDashboard 
        mostrarFormViagem={mostrarFormViagem}
        alternarFormViagem={alternarFormViagem}
        mostrarFormDespesa={mostrarFormDespesa}
        alternarFormDespesa={alternarFormDespesa}
      />
      
      {mostrarFormViagem && (
        <FormViagem 
          editando={!!editViagemUid}
          destino={formViagem.destino}
          etapas={formViagem.etapas}
          dataInicio={formViagem.dataInicio}
          dataFim={formViagem.dataFim}
          orcamento={formViagem.orcamento}
          onChange={handleChangeFormViagem}
          onSubmit={submeterViagem}
        />
      )}

      {mostrarFormDespesa && (
        <FormDespesa 
          editando={!!editDespesaUid}
          descricao={formDespesa.descricao}
          valor={formDespesa.valor}
          viagemId={formDespesa.viagemId}
          categoriaId={formDespesa.categoriaId}
          membroId={formDespesa.membroId}
          etapa={formDespesa.etapa}
          envolvidosIds={formDespesa.envolvidosIds}
          usarCambio={formDespesa.usarCambio}
          moeda={formDespesa.moeda}
          valorEstrangeiro={formDespesa.valorEstrangeiro}
          taxaCambio={formDespesa.taxaCambio}
          viagens={viagens}
          categorias={categorias}
          membros={membros}
          etapasDaViagem={etapasDaViagem}
          onChange={handleChangeFormDespesa}
          onSubmit={submeterDespesa}
        />
      )}

      <FiltrosDashboard 
        filtroTexto={filtroTexto}
        onFiltroTextoChange={setFiltroTexto}
        filtroCategoria={filtroCategoria}
        onFiltroCategoriaChange={setFiltroCategoria}
        categorias={categorias}
      />

      <div className="dashboard__grid">
        {viagens.map(viagem => (
          <CartaoViagem
            key={viagem.uid}
            viagem={viagem}
            despesas={despesas}
            membros={membros}
            tarefas={tarefas}
            filtroTexto={filtroTexto}
            filtroCategoria={filtroCategoria}
            onEdit={iniciarEdicaoViagem}
            onDelete={handleApagarViagem}
            onEditDespesa={iniciarEdicaoDespesa}
            onDeleteDespesa={handleApagarDespesa}
            onAddMembro={handleAddMembro}
            onDeleteMembro={handleDeleteMembro}
            onLiquidar={handleLiquidar}
            onAddTarefa={handleAddTarefa}
            onToggleTarefa={handleToggleTarefa}
            onDeleteTarefa={handleDeleteTarefa}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardContainer;