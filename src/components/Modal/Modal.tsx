import { modalOverlay, closeButton, modalContent } from "./ModalStyles";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        {children}
        <button style={closeButton} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default Modal;
