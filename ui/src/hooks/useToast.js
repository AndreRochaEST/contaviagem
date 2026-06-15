import { useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const mostrarToast = (mensagem, tipo = 'toast-sucesso') => {
    setToast({ message: mensagem, type: tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const mostrarSucesso = (mensagem) => mostrarToast(mensagem, 'toast-sucesso');
  const mostrarErro = (mensagem) => mostrarToast(mensagem, 'toast-erro');

  return {
    toast,
    mostrarToast,
    mostrarSucesso,
    mostrarErro
  };
}
