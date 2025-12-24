
import { useState } from "react"
import { FaPlus, FaEdit, FaTruck, FaSave, FaIdCard } from "react-icons/fa"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db"
import type { Transportista } from "../../types"
import { DataTable } from "../../components/ui/data-table"
import { PageHeader } from "../../components/ui/PageHeader"
import { ActionBar } from "../../components/ui/ActionBar"
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export function TransportersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTransportista, setSelectedTransportista] = useState<Transportista | null>(null)
  const [searchId, setSearchId] = useState("")
  const [formData, setFormData] = useState({
    ruc: "",
    nombre: "",
    apellido: "",
    placa: "",
  })

  // Fetch transportistas from Dexie
  const transportistas = useLiveQuery(() => db.transportistas.toArray());

  const handleGuardar = async () => {
    if (formData.ruc.trim() && formData.nombre.trim() && formData.placa.trim()) {
      try {
        await db.transportistas.add({
          ruc: formData.ruc,
          nombre: formData.nombre,
          apellido: formData.apellido,
          placa: formData.placa,
        });
        resetForm();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar transportista:", error);
        alert("Error al guardar el transportista");
      }
    }
  }

  const handleEdit = (transportista: Transportista) => {
    setSelectedTransportista(transportista)
    setFormData({
      ruc: transportista.ruc,
      nombre: transportista.nombre,
      apellido: transportista.apellido,
      placa: transportista.placa,
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (selectedTransportista?.id && formData.ruc.trim()) {
      try {
        await db.transportistas.update(selectedTransportista.id, {
          ruc: formData.ruc,
          nombre: formData.nombre,
          apellido: formData.apellido,
          placa: formData.placa,
        });
        resetForm();
        setSelectedTransportista(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar transportista:", error);
        alert("Error al actualizar el transportista");
      }
    }
  }

  const resetForm = () => {
    setFormData({
      ruc: "",
      nombre: "",
      apellido: "",
      placa: "",
    })
  }

  const filteredTransportistas = (transportistas || []).filter((item) => 
    searchId ? item.id?.toString() === searchId : true
  )

  const renderFooter = (action: () => void, label: string, isUpdate = false) => (
    <>
      <Button
        variant="secondary"
        onClick={() => {
            if (isUpdate) {
                setShowEditModal(false);
                setSelectedTransportista(null);
            } else {
                setShowCreateModal(false);
            }
            resetForm();
        }}
      >
        Cancelar
      </Button>
      <Button
        onClick={action}
        style={{
          background: isUpdate 
            ? "linear-gradient(135deg, #f59e0b, #d97706)"
            : "linear-gradient(135deg, #3b82f6, #2563eb)",
          border: "none",
          color: "white"
        }}
      >
        <FaSave className="mr-2" />
        {label}
      </Button>
    </>
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Transportistas"
        description="Administra la flota de transporte"
        actionElement={
          <button
            className="btn-primary-action"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={20} />
            Nuevo Transportista
          </button>
        }
      />

      <ActionBar
        title="Buscar Transportista por ID"
        searchVal={searchId}
        setSearchVal={setSearchId}
        placeholder="Ingrese ID..."
        onSearch={() => {}}
        onClear={() => setSearchId("")}
      />

      <div className="table-wrapper">
        <DataTable
            data={filteredTransportistas}
            columns={[
              {
                header: "ID",
                accessorKey: "id",
                cell: (item: Transportista) => (
                  <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>#{item.id}</span>
                ),
              },
              {
                header: "RUC",
                accessorKey: "ruc",
                cell: (item: Transportista) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaIdCard size={16} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>{item.ruc}</span>
                  </div>
                ),
              },
              {
                header: "Nombre",
                accessorKey: "nombre",
                cell: (item: Transportista) => (
                  <span style={{ fontWeight: 500 }}>{item.nombre}</span>
                ),
              },
              {
                header: "Apellido",
                accessorKey: "apellido",
                cell: (item: Transportista) => (
                  <span style={{ fontWeight: 500 }}>{item.apellido}</span>
                ),
              },
              {
                header: "Numero de Placa",
                accessorKey: "placa",
                cell: (item: Transportista) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaTruck size={16} style={{ color: "#3b82f6" }} />
                    <span
                      style={{
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        color: "#3b82f6",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        fontFamily: "monospace",
                        border: "1px solid rgba(59, 130, 246, 0.2)",
                      }}
                    >
                      {item.placa}
                    </span>
                  </div>
                ),
              },
              {
                header: "Acciones",
                align: "right",
                cell: (item: Transportista) => (
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      transition: "all 0.2s",
                      boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <FaEdit size={14} />
                    Editar
                  </button>
                ),
              },
            ]}
        />
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
            setShowCreateModal(false);
            resetForm();
        }}
        title="Nuevo Transportista"
        description="Completa la información del transportista"
        maxWidth="600px"
        icon={
          <div style={{
            width: "100%", height: "100%", 
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "12px"
          }}>
            <FaTruck size={24} style={{ color: "white" }} />
          </div>
        }
        footer={renderFooter(handleGuardar, "Guardar")}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
            <label className="block text-sm font-semibold mb-2">
                RUC<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.ruc}
                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                placeholder="Ej: 20123456789"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Nombre<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Apellido<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Ej: Pérez"
            />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
            <label className="block text-sm font-semibold mb-2">
                Número de Placa<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                placeholder="Ej: ABC-123"
            />
            </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
            setShowEditModal(false);
            setSelectedTransportista(null);
            resetForm();
        }}
        title="Editar Transportista"
        description="Modificar información del transportista"
        maxWidth="600px"
        icon={
          <div style={{
            width: "100%", height: "100%", 
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "12px"
          }}>
            <FaEdit size={24} style={{ color: "white" }} />
          </div>
        }
        footer={renderFooter(handleUpdate, "Actualizar", true)}
      >
         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
            <label className="block text-sm font-semibold mb-2">
                RUC<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.ruc}
                onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                placeholder="Ej: 20123456789"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Nombre<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Apellido<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Ej: Pérez"
            />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
            <label className="block text-sm font-semibold mb-2">
                Número de Placa<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.placa}
                onChange={(e) => setFormData({ ...formData, placa: e.target.value })}
                placeholder="Ej: ABC-123"
            />
            </div>
        </div>
      </Modal>
    </div>
  )
}
