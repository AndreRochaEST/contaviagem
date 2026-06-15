const API_BASE_URL = 'http://localhost:9000/services';

export const apiClient = {
  // Viagens
  async getViagens() {
    const res = await fetch(`${API_BASE_URL}/viagens`);
    if (!res.ok) throw new Error('Erro ao carregar viagens');
    return res.json();
  },

  async criarViagem(viagem) {
    const res = await fetch(`${API_BASE_URL}/viagens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(viagem)
    });
    return res.json();
  },

  async atualizarViagem(viagem) {
    const res = await fetch(`${API_BASE_URL}/viagens`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(viagem)
    });
    return res.json();
  },

  async apagarViagem(uid) {
    const res = await fetch(`${API_BASE_URL}/viagens?uid=${uid}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Despesas
  async getDespesas() {
    const res = await fetch(`${API_BASE_URL}/despesas`);
    if (!res.ok) throw new Error('Erro ao carregar despesas');
    return res.json();
  },

  async criarDespesa(despesa) {
    const res = await fetch(`${API_BASE_URL}/despesas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(despesa)
    });
    return res.json();
  },

  async atualizarDespesa(despesa) {
    const res = await fetch(`${API_BASE_URL}/despesas`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(despesa)
    });
    return res.json();
  },

  async apagarDespesa(uid) {
    const res = await fetch(`${API_BASE_URL}/despesas?uid=${uid}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Categorias
  async getCategorias() {
    const res = await fetch(`${API_BASE_URL}/categorias`);
    if (!res.ok) throw new Error('Erro ao carregar categorias');
    return res.json();
  }
};
