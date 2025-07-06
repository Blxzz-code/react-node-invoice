import React from 'react';
import styles from './FacturasTable.module.css';

export default function FacturasTable({ invoices, onViewInvoice }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {invoices.length === 0 ? (
          <tr>
            <td colSpan="5" style={{ textAlign: 'center' }}>No hay facturas</td>
          </tr>
        ) : (
          invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.client_name || invoice.client_id}</td>
            <td>{new Date(invoice.date).toLocaleDateString()}</td> 
              <td>{Number(invoice.total).toFixed(2)} €</td>
              <td>
                <button
                  className={styles.viewBtn}
                  onClick={() => onViewInvoice(invoice.id)}
                >
                  Ver Factura
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
