import styles from './ClientesList.module.css';

export default function ClientesList({ clients, onSelect, onEdit, onDelete, onShowInfo }) {
  return (
    <ul className={styles.clientList}>
      <li onClick={() => onSelect(null)} className={styles.clientItem + ' ' + styles.all}>
        Todos
      </li>
      {clients.map(client => (
        <li key={client.id} className={styles.clientItem}>
          <button
            id="noHover"
            className={styles.clientName}
            onClick={() => onShowInfo(client)} 
          >
            {client.name}
          </button>
          <div className={styles.buttonGroup}>
            <button
              className={styles.editBtn}
              onClick={() => onEdit(client)}
              aria-label={`Editar cliente ${client.name}`}
            >
              ✎
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(client.id)}
              aria-label={`Eliminar cliente ${client.name}`}
            >
              ✖
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
