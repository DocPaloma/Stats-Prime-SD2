export default function ConfirmDialog({
  open,
  title = "¿Estás seguro?",
  description = "",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onClose,
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && <p className="text-slate-400 mt-1 text-sm">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-ghost" onClick={onClose}>{cancelText}</button>
          <button
            className="btn-primary bg-rose-600 hover:bg-rose-500"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
