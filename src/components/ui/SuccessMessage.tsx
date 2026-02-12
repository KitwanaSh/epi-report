interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

export default function SuccessMessage({ message, onDismiss }: SuccessMessageProps) {
  if (!message) return null;

  return (
    <div className="success-box flex items-start justify-between gap-4">
      <p className="flex-1">{message}</p>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-status-success font-bold text-[18px] leading-none hover:opacity-70 transition-opacity shrink-0"
          aria-label="Fermer"
        >
          ×
        </button>
      )}
    </div>
  );
}