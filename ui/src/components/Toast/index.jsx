function Toast({ toast }) {
  if (!toast) return null;
  
  return (
    <div className={`toast-container ${toast.type}`}>
      {toast.message}
    </div>
  );
}

export default Toast;
