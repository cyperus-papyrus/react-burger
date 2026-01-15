import styles from "./modal-overlay.module.scss";

interface ModalOverlayProps {
  onClick: () => void;
}

function ModalOverlay(props: ModalOverlayProps) {
  const onClick = props.onClick;

  return <div className={styles.overlay} onClick={onClick} />;
}

export default ModalOverlay;
