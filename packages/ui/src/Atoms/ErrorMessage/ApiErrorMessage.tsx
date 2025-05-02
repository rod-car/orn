import "./ApiErrorMessage.modules.scss"

type ApiErrorMessageProps = {
  message: string;
  className?: string;
  onClose: () => void;
};

export function ApiErrorMessage({ message, className, onClose }: ApiErrorMessageProps) {
  return <div className={`alert alert-danger alert-dismissible fade show ${className}`} role="alert">
    <span>{message}</span>
    <button type="button" onClick={onClose} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
}