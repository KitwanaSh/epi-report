interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="error-box flex items-start justify-between gap-4">
      <p className="flex-1">{message}</p>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-status-error font-bold text-[18px] leading-none hover:opacity-70 transition-opacity shrink-0"
          aria-label="Fermer"
        >
          ×
        </button>
      )}
    </div>
  );
}