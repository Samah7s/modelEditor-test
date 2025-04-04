import { useEffect } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const overlayClass = isOpen
    ? "modal-overlay modal-overlay-open"
    : "modal-overlay";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={overlayClass} onClick={handleOverlayClick}>
      <div className="modal-content">
        {children}
        {/* <button style={closeButton} onClick={onClose}>
          Закрыть
        </button> */}
      </div>
    </div>
  );
};

export default Modal;
