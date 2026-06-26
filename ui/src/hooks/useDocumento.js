import { useState, useEffect, useCallback } from 'react';
import { callService } from '../utils';
import CryptoJS from 'crypto-js';

const CHAVE_SECRETA = 'viagem_segura_aes_256';

export function useDocumento(viagemId) {
  const [documentos, setDocumentos] = useState([]);

  const carregarDocumentos = useCallback(async () => {
    if (!viagemId) return;
    const result = await callService({ url: `/documento?viagem_id=${viagemId}`, method: 'GET' });
    if (result && result.sucesso) {
      const docsDesencriptados = (result.data || []).map(doc => {
        try {
          const bytes = CryptoJS.AES.decrypt(doc.ficheiro, CHAVE_SECRETA);
          const ficheiroOriginal = bytes.toString(CryptoJS.enc.Utf8);
          return { ...doc, ficheiro: ficheiroOriginal || doc.ficheiro };
        } catch {
          return doc;
        }
      });
      setDocumentos(docsDesencriptados);
    }
  }, [viagemId]);

  useEffect(() => {
    carregarDocumentos();
  }, [carregarDocumentos]);

  const criarDocumento = async (dados) => {
    const ficheiroEncriptado = CryptoJS.AES.encrypt(dados.ficheiro, CHAVE_SECRETA).toString();
    const dadosSeguros = { ...dados, ficheiro: ficheiroEncriptado };
    return await callService({ url: '/documento', method: 'POST', data: dadosSeguros });
  };

  const apagarDocumento = async (uid) => {
    return await callService({ url: '/documento', method: 'DELETE', data: { uid } });
  };

  return { documentos, carregarDocumentos, criarDocumento, apagarDocumento };
}