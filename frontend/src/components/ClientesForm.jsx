import React, { useState, useEffect } from 'react';
import styles from './ClientesForm.module.css';

export default function ClientesForm({ editingClient, onAddClient, onUpdateClient, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name);
      setEmail(editingClient.email);
      setPhone(editingClient.phone);
    } else {
      setName('');
      setEmail('');
      setPhone('');
    }
  }, [editingClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const client = { name, email, phone };

    if (editingClient) {
      const res = await fetch(`http://localhost:4000/api/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
      });
      const data = await res.json();
      onUpdateClient(data);
    } else {
      const res = await fetch('http://localhost:4000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client)
      });
      const data = await res.json();
      onAddClient(data);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" required />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
      <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Teléfono" required />
      <div className={styles.actions}>
        <button type="submit">{editingClient ? 'Guardar cambios' : 'Añadir Cliente'}</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
