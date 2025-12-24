
import { useState } from "react"
import { FaPlus, FaEdit, FaUserTie, FaSave, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db"
import type { Empleado } from "../../types"
import { DataTable } from "../../components/ui/data-table"
import { PageHeader } from "../../components/ui/PageHeader"
import { ActionBar } from "../../components/ui/ActionBar"
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export function EmployeesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null)
  const [searchId, setSearchId] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    correo: "",
  })

  // Fetch empleados from Dexie
  const empleados = useLiveQuery(() => db.empleados.toArray());

  const handleGuardar = async () => {
    if (formData.nombre.trim() && formData.apellido.trim() && formData.correo.trim()) {
      try {
        await db.empleados.add({
          nombre: formData.nombre,
          apellido: formData.apellido,
          direccion: formData.direccion,
          telefono: formData.telefono,
          correo: formData.correo,
        });
        resetForm();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar empleado:", error);
        alert("Error al guardar el empleado");
      }
    }
  }

  const handleEdit = (empleado: Empleado) => {
    setSelectedEmpleado(empleado)
    setFormData({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      direccion: empleado.direccion,
      telefono: empleado.telefono,
      correo: empleado.correo,
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (selectedEmpleado?.id && formData.nombre.trim()) {
      try {
        await db.empleados.update(selectedEmpleado.id, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          direccion: formData.direccion,
          telefono: formData.telefono,
          correo: formData.correo,
        });
        resetForm();
        setSelectedEmpleado(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar empleado:", error);
        alert("Error al actualizar el empleado");
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
      correo: "",
    })
  }

  const filteredEmpleados = (empleados || []).filter((item) => 
    searchId ? item.id?.toString() === searchId : true
  )

  const renderFooter = (action: () => void, label: string, isUpdate = false) => (
    <>
      <Button
        variant="secondary"
        onClick={() => {
            if (isUpdate) {
                setShowEditModal(false);
                setSelectedEmpleado(null);
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
        title="Empleados"
        description="Gestiona el personal de la empresa"
        actionElement={
          <button
            className="btn-primary-action"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={20} />
            Nuevo Empleado
          </button>
        }
      />

      <ActionBar
        title="Buscar Empleado por ID"
        searchVal={searchId}
        setSearchVal={setSearchId}
        placeholder="Ingrese ID..."
        onSearch={() => {}}
        onClear={() => setSearchId("")}
      />

      <div className="table-wrapper">
        <DataTable
            data={filteredEmpleados}
            columns={[
              {
                header: "ID",
                accessorKey: "id",
                cell: (item: Empleado) => (
                  <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>#{item.id}</span>
                ),
              },
              {
                header: "Nombre",
                accessorKey: "nombre",
                cell: (item: Empleado) => (
                  <span style={{ fontWeight: 500 }}>{item.nombre}</span>
                ),
              },
              {
                header: "Apellido",
                accessorKey: "apellido",
                cell: (item: Empleado) => (
                  <span style={{ fontWeight: 500 }}>{item.apellido}</span>
                ),
              },
              {
                header: "Dirección",
                accessorKey: "direccion",
                cell: (item: Empleado) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", maxWidth: "200px" }}>
                    <FaMapMarkerAlt size={14} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.direccion}
                    </span>
                  </div>
                ),
              },
              {
                header: "Teléfono",
                accessorKey: "telefono",
                cell: (item: Empleado) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaPhone size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontSize: "0.9rem", fontFamily: "monospace" }}>{item.telefono}</span>
                  </div>
                ),
              },
              {
                header: "Correo",
                accessorKey: "correo",
                cell: (item: Empleado) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaEnvelope size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontSize: "0.9rem" }}>{item.correo}</span>
                  </div>
                ),
              },
              {
                header: "Acciones",
                align: "right",
                cell: (item: Empleado) => (
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
        title="Nuevo Empleado"
        description="Completa la información del empleado"
        maxWidth="700px"
        icon={
          <div style={{
            width: "100%", height: "100%", 
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "12px"
          }}>
            <FaUserTie size={24} style={{ color: "white" }} />
          </div>
        }
        footer={renderFooter(handleGuardar, "Guardar")}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
            <label className="block text-sm font-semibold mb-2">
                Nombre<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Pedro"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Apellido<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Ej: Sánchez"
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
                Correo<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                placeholder="Ej: pedro@hiraoka.com"
            />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
            <label className="block text-sm font-semibold mb-2">
                Dirección
            </label>
            <Input
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Ej: Av. Principal 123"
            />
            </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
            setShowEditModal(false);
            setSelectedEmpleado(null);
            resetForm();
        }}
        title="Editar Empleado"
        description="Modificar información del empleado"
        maxWidth="700px"
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
                Nombre<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Pedro"
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-2">
                Apellido<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Ej: Sánchez"
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
                Correo<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                placeholder="Ej: pedro@hiraoka.com"
            />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
            <label className="block text-sm font-semibold mb-2">
                Dirección
            </label>
            <Input
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Ej: Av. Principal 123"
            />
            </div>
        </div>
      </Modal>
    </div>
  )
}
