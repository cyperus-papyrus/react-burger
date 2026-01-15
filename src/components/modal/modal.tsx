import React, { useEffect } from "react";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import ModalOverlay from "./modal-overlay/modal-overlay";
import styles from "./modal.module.scss";
import Portal from "./portal/portal";

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal(props: ModalProps) {
  const title = props.title;
  const onClose = props.onClose;
  const children = props.children;

  useEffect(
    function () {
      function handleEscapeKey(event: KeyboardEvent) {
        if (event.key === "Escape") {
          onClose();
        }
      }

      document.addEventListener("keydown", handleEscapeKey);

      return function () {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    },
    [onClose]
  );

  return (
    <Portal>
      <div className={styles.modal}>
        <div className={styles.header}>
          {title && (
            <h2 className={`text text_type_main-large ${styles.title}`}>{title}</h2>
          )}
          <button className={styles.closeButton} onClick={onClose}>
            <CloseIcon type="primary" />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      <ModalOverlay onClick={onClose} />
    </Portal>
  );
}

export default Modal;
