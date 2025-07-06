import React, { useState } from 'react';
import styles from './InvoiceForm.module.css';

export default function InvoiceForm({ clients, onSave, onCancel }) {
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [error, setError] = useState('');

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'description') {
      newItems[index][field] = value;
    } else {
      const parsed = parseFloat(value);
      newItems[index][field] = isNaN(parsed) ? 0 : parsed;
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }]);

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientId) {
      setError('Debes seleccionar un cliente');
      return;
    }
    if (!date) {
      setError('Debes seleccionar una fecha');
      return;
    }
    if (items.some(i => !i.description || i.quantity <= 0 || i.price <= 0)) {
      setError('Cada item debe tener descripción, cantidad y precio válidos');
      return;
    }

    setError('');
    onSave({ client_id: parseInt(clientId), date, items });
  };

  return (
    <form className={styles.invoiceForm} onSubmit={handleSubmit}>
      <label>
        Cliente:
        <select value={clientId} onChange={e => setClientId(e.target.value)} required>
          <option value="">-- Selecciona un cliente --</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      <label>
        Fecha:
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </label>

      <h4>Items</h4>
      {items.map((item, i) => (
        <div key={i} className={styles.itemRow}>
          <input
            type="text"
            placeholder="Descripción"
            value={item.description}
            onChange={e => handleItemChange(i, 'description', e.target.value)}
            required
          />
          <input
            type="number"
            min="1"
            placeholder="Cantidad"
            value={item.quantity}
            onChange={e => handleItemChange(i, 'quantity', e.target.value)}
            required
          />
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Precio"
            value={item.price}
            onChange={e => handleItemChange(i, 'price', e.target.value)}
            required
          />
          {items.length > 1 && (
            <button type="button" onClick={() => removeItem(i)} className={styles.removeBtn}>
              &times;
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addItem} className={styles.addItemBtn}>+ Añadir Item</button>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.buttons}>
        <button type="submit" className={styles.saveBtn}>Guardar Factura</button>
        <button type="button" onClick={onCancel} className={styles.cancelBtn}>Cancelar</button>
      </div>
    </form>
  );
}
