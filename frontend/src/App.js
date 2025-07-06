import React, { useEffect, useState } from 'react';
import ClientesList from './components/ClientesList';
import ClientesForm from './components/ClientesForm';
import Modal from './components/Modal';
import FacturasTable from './components/FacturasTable';
import FacturaDetalle from './components/FacturaDetalle';
import styles from './App.module.css';
import InvoiceForm from './components/InvoiceForm';

export default function App() {
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoClient, setInfoClient] = useState(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceDetailModalOpen, setInvoiceDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/clients');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const url = selectedClientId
        ? `http://localhost:4000/api/invoices?clientId=${selectedClientId}`
        : 'http://localhost:4000/api/invoices';
      const res = await fetch(url);
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddClient = (client) => {
    setClients((prev) => [...prev, client]);
    setModalOpen(false);
  };

  const handleUpdateClient = (client) => {
    setClients((prev) => prev.map((c) => (c.id === client.id ? client : c)));
    setEditingClient(null);
    setModalOpen(false);
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('¿Eliminar cliente?')) return;
    try {
      await fetch(`http://localhost:4000/api/clients/${id}`, { method: 'DELETE' });
      setClients((prev) => prev.filter((c) => c.id !== id));
      setInvoices((prev) => prev.filter((inv) => inv.client_id !== id));
      if (selectedClientId === id) setSelectedClientId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShowClientInfo = (client) => {
    setInfoClient(client);
    setInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setInfoClient(null);
    setInfoModalOpen(false);
  };

  const handleSaveInvoice = async (invoiceData) => {
    try {
      const res = await fetch('http://localhost:4000/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData),
      });
      if (!res.ok) throw new Error('Error guardando factura');
      const newInvoice = await res.json();
      setInvoices((prev) => [newInvoice, ...prev]);
      setInvoiceModalOpen(false);
    } catch (err) {
      alert('Error guardando factura');
      console.error(err);
    }
  };

  const handleViewInvoice = async (invoiceId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/invoices/${invoiceId}`);
      if (!res.ok) throw new Error('Factura no encontrada');
      const invoice = await res.json();

      const itemsRes = await fetch(`http://localhost:4000/api/items/${invoiceId}`);
      const items = itemsRes.ok ? await itemsRes.json() : [];

      setSelectedInvoice({ ...invoice, items });
      setInvoiceDetailModalOpen(true);
    } catch (err) {
      alert('Error al cargar detalles de la factura');
      console.error(err);
    }
  };

  const closeInvoiceDetailModal = () => {
    setSelectedInvoice(null);
    setInvoiceDetailModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2>Clientes</h2>
          <button
            onClick={() => {
              setModalOpen(true);
              setEditingClient(null);
            }}
          >
            + Añadir Cliente
          </button>
        </div>
        <ClientesList
          clients={clients}
          onSelect={setSelectedClientId}
          onEdit={(client) => {
            setEditingClient(client);
            setModalOpen(true);
          }}
          onDelete={handleDeleteClient}
          onShowInfo={handleShowClientInfo}
        />
      </div>

      <div className={styles.main}>
        <h2>Facturas</h2>
        <FacturasTable invoices={invoices} onViewInvoice={handleViewInvoice} />
        <button
          onClick={() => setInvoiceModalOpen(true)}
          className={styles.newInvoiceBtn}
          style={{ marginTop: '15px' }}
        >
          + Añadir Factura
        </button>
      </div>

      {/* Modal para añadir / editar cliente */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ClientesForm
          editingClient={editingClient}
          onAddClient={handleAddClient}
          onUpdateClient={handleUpdateClient}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {/* Modal info cliente */}
      <Modal isOpen={infoModalOpen} onClose={closeInfoModal}>
        {infoClient && (
          <div style={{ color: 'white', padding: 20 }}>
            <h3>Información de {infoClient.name}</h3>
            <p>
              <strong>Email:</strong> {infoClient.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {infoClient.phone}
            </p>
            <button onClick={closeInfoModal} style={{ marginTop: 15 }}>
              Cerrar
            </button>
          </div>
        )}
      </Modal>

      {/* Modal añadir factura */}
      <Modal isOpen={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)}>
        <InvoiceForm
          clients={clients}
          onSave={handleSaveInvoice}
          onCancel={() => setInvoiceModalOpen(false)}
        />
      </Modal>

      {/* Modal detalles factura */}
      <Modal isOpen={invoiceDetailModalOpen} onClose={closeInvoiceDetailModal}>
        {selectedInvoice && <FacturaDetalle invoice={selectedInvoice} />}
      </Modal>
    </div>
  );
}
