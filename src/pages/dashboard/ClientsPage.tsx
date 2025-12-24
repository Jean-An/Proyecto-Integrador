
import { useState } from "react"
import { FaPlus, FaEdit, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard, FaSave } from "react-icons/fa"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db"
import type { Cliente } from "../../types"
import { DataTable } from "../../components/ui/data-table"
import { PageHeader } from "../../components/ui/PageHeader";
import { ActionBar } from "../../components/ui/ActionBar";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export function ClientesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [searchId, setSearchId] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    dni: "",
    direccion: "",
    estado: "Activo" as "Activo" | "Deshabilitado",
  })

  // Fetch clients from Dexie
  const clientes = useLiveQuery(() => db.clientes.toArray());

  const handleGuardar = async () => {
    if (formData.nombre.trim() && formData.apellido.trim() && formData.email.trim()) {
      try {
        await db.clientes.add({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          dni: formData.dni,
          direccion: formData.direccion,
          estado: formData.estado,
        });
        resetForm();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar cliente:", error);
        alert("Error al guardar el cliente");
      }
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      dni: cliente.dni,
      direccion: cliente.direccion,
      estado: (cliente.estado as "Activo" | "Deshabilitado") || "Activo",
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (selectedCliente?.id && formData.nombre.trim() && formData.apellido.trim()) {
      try {
        await db.clientes.update(selectedCliente.id, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          dni: formData.dni,
          direccion: formData.direccion,
          estado: formData.estado,
        });
        resetForm();
        setSelectedCliente(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
        alert("Error al actualizar el cliente");
      }
    }
  }

  // Toggle Status Function
  const handleToggleStatus = async (cliente: Cliente) => {
    if (cliente.id) {
      const newStatus = cliente.estado === "Activo" ? "Deshabilitado" : "Activo";
      try {
        await db.clientes.update(cliente.id, { estado: newStatus });
      } catch (error) {
        console.error("Error al cambiar estado:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      dni: "",
      direccion: "",
      estado: "Activo",
    })
  }

  const filteredClientes = (clientes || []).filter((cliente) => 
    searchId ? cliente.id?.toString() === searchId : true
  )

  const renderFooter = (action: () => void, label: string, isUpdate = false) => (
    <>
      <Button
        variant="secondary"
        onClick={() => {
            if(isUpdate) {
                setShowEditModal(false);
                setSelectedCliente(null);
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
        title="Clientes"
        description="Administra la información de tus clientes"
        actionElement={
          <button
            className="btn-primary-action"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={20} />
            Nuevo Cliente
          </button>
        }
      />

      <ActionBar
        title="Buscar Cliente por ID"
        searchVal={searchId}
        setSearchVal={setSearchId}
        placeholder="Ingrese el ID del cliente..."
        onSearch={() => {}}
        onClear={() => setSearchId("")}
      />

      <div className="table-wrapper">
        <DataTable
            data={filteredClientes}
            columns={[
              {
                header: "ID",
                accessorKey: "id",
                cell: (item: Cliente) => (
                  <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>#{item.id}</span>
                ),
              },
              {
                header: "Cliente",
                accessorKey: "nombre",
                cell: (item: Cliente) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        borderRadius: "8px",
                      }}
                    >
                      <FaUser size={18} style={{ color: "#3b82f6" }} />
                    </div>
                    <div>
                      <div
                        style={{
                          color: "var(--foreground)",
                          fontWeight: 600,
                          fontSize: "1rem",
                        }}
                      >
                        {item.nombre} {item.apellido}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                header: "Email",
                accessorKey: "email",
                cell: (item: Cliente) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaEnvelope size={16} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ color: "var(--foreground)", fontSize: "0.95rem" }}>{item.email}</span>
                  </div>
                ),
              },
              {
                header: "Teléfono",
                accessorKey: "telefono",
                cell: (item: Cliente) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaPhone size={16} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ color: "var(--foreground)", fontSize: "0.95rem" }}>{item.telefono}</span>
                  </div>
                ),
              },
              {
                header: "DNI",
                accessorKey: "dni",
                cell: (item: Cliente) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaCreditCard size={16} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ color: "var(--foreground)", fontSize: "0.95rem" }}>{item.dni}</span>
                  </div>
                ),
              },
              {
                header: "Dirección",
                accessorKey: "direccion",
                cell: (item: Cliente) => (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", maxWidth: "250px" }}>
                      <FaMapMarkerAlt size={16} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                      <span
                        style={{
                          color: "var(--muted-foreground)",
                          fontSize: "0.9rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={item.direccion}
                      >
                        {item.direccion}
                      </span>
                    </div>
                ),
              },
              {
                header: "Estado",
                align: "center",
                accessorKey: "estado",
                cell: (item: Cliente) => (
                  <span
                    onClick={() => handleToggleStatus(item)}
                    style={{
                      display: "inline-block",
                      padding: "6px 16px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      backgroundColor:
                        item.estado === "Activo" ? "rgba(34, 197, 94, 0.1)" : "rgba(107, 114, 128, 0.1)",
                      color: item.estado === "Activo" ? "#22c55e" : "#6b7280",
                      border: `1px solid ${item.estado === "Activo" ? "rgba(34, 197, 94, 0.3)" : "rgba(107, 114, 128, 0.3)"}`,
                      cursor: "pointer",
                      userSelect: "none",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.filter = "brightness(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.filter = "none";
                    }}
                    title="Haz clic para cambiar el estado"
                  >
                    {item.estado}
                  </span>
                ),
              },
              {
                header: "Acciones",
                align: "right",
                cell: (item: Cliente) => (
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      transition: "all 0.2s",
                      boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                      cursor: "pointer",
                      border: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.4)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.3)"
                    }}
                  >
                    <FaEdit size={16} />
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
        title="Nuevo Cliente"
        description="Completa la información del cliente"
        maxWidth="720px"
        icon={
          <div style={{
            width: "100%", height: "100%", 
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "12px"
          }}>
            <FaPlus size={24} style={{ color: "white" }} />
          </div>
        }
        footer={renderFooter(handleGuardar, "Guardar")}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
            <label className="block text-sm font-semibold mb-2">
                Nombre<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Apellido<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <Input
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Ej: Pérez"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Email<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: juan@email.com"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Teléfono
            </label>
            <Input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: 987654321"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                DNI
            </label>
            <Input
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                placeholder="Ej: 12345678"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Estado
            </label>
            <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as "Activo" | "Deshabilitado" })}
                style={{
                width: "100%",
                padding: "14px 16px",
                backgroundColor: "var(--secondary)",
                border: "2px solid var(--border)",
                borderRadius: "10px",
                color: "var(--foreground)",
                fontSize: "1rem",
                transition: "all 0.2s",
                }}
            >
                <option value="Activo">Activo</option>
                <option value="Deshabilitado">Deshabilitado</option>
            </select>
            </div>
            
            <div style={{ gridColumn: "1 / -1" }}>
                <label className="block text-sm font-semibold mb-2">
                Dirección
                </label>
                <textarea
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                rows={3}
                style={{
                    width: "100%",
                    padding: "14px 16px",
                    backgroundColor: "var(--secondary)",
                    border: "2px solid var(--border)",
                    borderRadius: "10px",
                    color: "var(--foreground)",
                    fontSize: "1rem",
                    transition: "all 0.2s",
                    resize: "vertical",
                }}
                placeholder="Ej: Av. Principal 123, Lima"
                />
            </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
            setShowEditModal(false);
            setSelectedCliente(null);
            resetForm();
        }}
        title="Editar Cliente"
        description="Modificar información del cliente"
        maxWidth="720px"
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
            <div>
            <label className="block text-sm font-semibold mb-2">
                Nombre<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Apellido<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <Input
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Ej: Pérez"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Email<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Ej: juan@email.com"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Teléfono
            </label>
            <Input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: 987654321"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                DNI
            </label>
            <Input
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                placeholder="Ej: 12345678"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Estado
            </label>
            <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value as "Activo" | "Deshabilitado" })}
                style={{
                width: "100%",
                padding: "14px 16px",
                backgroundColor: "var(--secondary)",
                border: "2px solid var(--border)",
                borderRadius: "10px",
                color: "var(--foreground)",
                fontSize: "1rem",
                transition: "all 0.2s",
                }}
            >
                <option value="Activo">Activo</option>
                <option value="Deshabilitado">Deshabilitado</option>
            </select>
            </div>
            
            <div style={{ gridColumn: "1 / -1" }}>
                <label className="block text-sm font-semibold mb-2">
                Dirección
                </label>
                <textarea
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                rows={3}
                style={{
                    width: "100%",
                    padding: "14px 16px",
                    backgroundColor: "var(--secondary)",
                    border: "2px solid var(--border)",
                    borderRadius: "10px",
                    color: "var(--foreground)",
                    fontSize: "1rem",
                    transition: "all 0.2s",
                    resize: "vertical",
                }}
                placeholder="Ej: Av. Principal 123, Lima"
                />
            </div>
        </div>
      </Modal>
    </div>
  );
}
