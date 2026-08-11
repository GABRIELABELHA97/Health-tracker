import type { SaveStatus } from "../hooks/useSaveStatus";

interface SaveStatusButtonProps {
  status: SaveStatus;
  onClick: () => void;
  disabled?: boolean;
}

export default function SaveStatusButton({ status, onClick, disabled = false }: SaveStatusButtonProps) {
  const getButtonText = () => {
    switch (status) {
      case "saving":
        return "💾 Salvando...";
      case "saved":
        return "✓ Salvo";
      case "error":
        return "✗ Erro ao salvar";
      default:
        return "💾 Salvar";
    }
  };

  const getButtonClass = () => {
    switch (status) {
      case "saving":
        return "btn btn-primary";
      case "saved":
        return "btn btn-success";
      case "error":
        return "btn btn-danger";
      default:
        return "btn btn-primary";
    }
  };

  return (
    <button
      className={getButtonClass()}
      onClick={onClick}
      disabled={disabled || status === "saving" || status === "saved"}
      style={{
        opacity: status === "saved" ? 0.8 : 1,
        cursor: (disabled || status === "saving" || status === "saved") ? "default" : "pointer"
      }}
    >
      {getButtonText()}
    </button>
  );
}
