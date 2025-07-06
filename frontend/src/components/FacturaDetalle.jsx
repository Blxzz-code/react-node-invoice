import React from 'react';
import styles from './FacturaDetalle.module.css';

export default function FacturaDetalle({ invoice }) {
  const items = invoice.items || [];

  const total = items.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return acc + price * qty;
  }, 0);

  return (
    <div className={styles.detalle}>
      <h3>Factura #{invoice.id}</h3>
      <p><strong>Cliente:</strong> {invoice.client_name || invoice.client_id}</p>
      <p><strong>Fecha:</strong> {new Date(invoice.date).toLocaleDateString()}</p>

      <h4>Ítems</h4>
      {items.length === 0 ? (
        <p>No hay ítems registrados.</p>
      ) : (
        <ul className={styles.itemList}>
          {items.map((item, idx) => (
            <li key={idx} className={styles.item}>
              <span>{item.description}</span>
              <span>{item.quantity} × {Number(item.price).toFixed(2)} €</span>
            </li>
          ))}
        </ul>
      )}

      <p className={styles.total}>
        <strong>Total:</strong> {total.toFixed(2)} €
      </p>
    </div>
  );
}
