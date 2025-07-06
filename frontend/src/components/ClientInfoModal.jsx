import React from 'react';
import Modal from './Modal';
import styles from './ClientInfoModal.module.css';

export default function ClientInfoModal({ client, onClose }) {
  if (!client) return null;
  return (
    <Modal isOpen={!!client} onClose={onClose}>
      <div className={styles.content}>
        <h2>Información de Cliente</h2>
        <p><strong>Nombre:</strong> {client.name}</p>
        <p><strong>Email:</strong> {client.email}</p>
        <p><strong>Teléfono:</strong> {client.phone}</p>
        <button className={styles.closeBtn} onClick={onClose}>Cerrar</button>
      </div>
    </Modal>
  );
}
