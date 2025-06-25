import React from "react";
import { AlertTriangle, X, Check } from "lucide-react";
import { Button } from "./button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (close: () => void) => void | Promise<void>;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  loading = false,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
          iconBg: "bg-red-100 dark:bg-red-950",
          confirmVariant: "red" as const,
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
          iconBg: "bg-yellow-100 dark:bg-yellow-950",
          confirmVariant: "blue" as const,
        };
      case "info":
        return {
          icon: <Check className="w-6 h-6 text-blue-500" />,
          iconBg: "bg-blue-100 dark:bg-blue-950",
          confirmVariant: "true" as const,
        };
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
          iconBg: "bg-yellow-100 dark:bg-yellow-950",
          confirmVariant: "blue" as const,
        };
    }
  };

  const { icon, iconBg, confirmVariant } = getVariantStyles();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white dark:bg-[#18181c] border border-gray-200 dark:border-orange-800 shadow-2xl rounded-2xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        {/* Icon Top Center */}
        <div className="flex flex-col items-center justify-center mb-4">
          <div className={`p-3 rounded-full ${iconBg} mb-2`}>{icon}</div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-orange-100 text-center">
            {title}
          </h2>
        </div>
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
        {/* Message */}
        <div className="mb-6 mt-2">
          <p className="text-gray-600 dark:text-orange-200 leading-relaxed text-center">
            {message}
          </p>
        </div>
        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={() => onConfirm(onClose)}
            disabled={loading}
            className="px-6 py-2"
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Partial<ConfirmationDialogProps>>(
    {},
  );

  const openDialog = (dialogConfig: Partial<ConfirmationDialogProps>) => {
    setConfig(dialogConfig);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setConfig({});
  };

  const wrappedOnConfirm = () => {
    if (typeof config.onConfirm === "function") {
      config.onConfirm(closeDialog);
    } else {
      closeDialog();
    }
  };

  const ConfirmDialog = React.useCallback(
    (props: Partial<ConfirmationDialogProps>) => (
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onConfirm={wrappedOnConfirm}
        {...config}
        {...props}
      />
    ),
    [isOpen, config],
  );

  return {
    openDialog,
    closeDialog,
    ConfirmDialog,
    isOpen,
  };
}
