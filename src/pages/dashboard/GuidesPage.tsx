
import { useState } from "react"
import { FaPlus, FaEdit, FaFileInvoice, FaSave, FaUser, FaCalendarAlt } from "react-icons/fa"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db"
import type { Guia } from "../../types"
import { DataTable } from "../../components/ui/data-table"
import { PageHeader } from "../../components/ui/PageHeader"
import { ActionBar } from "../../components/ui/ActionBar"
import { Modal } from "../../components/ui/Modal"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"

export function GuidesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedGuia, setSelectedGuia] = useState<Guia | null>(null)
  const [searchId, setSearchId] = useState("")
  const [formData, setFormData] = useState({
    empleado: "",
    fecha: new Date().toISOString().split('T')[0],
    tipo: "Ingreso" as "Ingreso" | "Salida",
  })

  // Fetch data
  const guias = useLiveQuery(() => db.guias.toArray());
  const empleados = useLiveQuery(() => db.empleados.toArray());

  const handleGuardar = async () => {
    if (formData.empleado && formData.fecha) {
      try {
        await db.guias.add({
          empleado: formData.empleado,
          fecha: formData.fecha,
          tipo: formData.tipo,
        });
        resetForm();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar guía:", error);
        alert("Error al guardar la guía");
      }
    }
  }

  const handleEdit = (guia: Guia) => {
    setSelectedGuia(guia)
    setFormData({
      empleado: guia.empleado,
      fecha: guia.fecha,
      tipo: guia.tipo as "Ingreso" | "Salida",
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (selectedGuia?.id && formData.empleado) {
      try {
        await db.guias.update(selectedGuia.id, {
          empleado: formData.empleado,
          fecha: formData.fecha,
          tipo: formData.tipo,
        });
        resetForm();
        setSelectedGuia(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar guía:", error);
        alert("Error al actualizar la guía");
      }
    }
  }

  const resetForm = () => {
    setFormData({
      empleado: "",
      fecha: new Date().toISOString().split('T')[0],
      tipo: "Ingreso",
    })
  }

  const filteredGuias = (guias || []).filter((item) => 
    searchId ? item.id?.toString() === searchId : true
  )

  const renderFooter = (action: () => void, label: string, isUpdate = false) => (
    <>
      <Button
        variant="secondary"
        onClick={() => {
            if (isUpdate) {
                setShowEditModal(false);
                setSelectedGuia(null);
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
        title="Guías"
        description="Administra las guías de remisión"
        actionElement={
          <button
            className="btn-primary-action"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={20} />
            Nueva Guía
          </button>
        }
      />

      <ActionBar
        title="Buscar Guía por ID"
        searchVal={searchId}
        setSearchVal={setSearchId}
        placeholder="Ingrese ID..."
        onSearch={() => {}}
        onClear={() => setSearchId("")}
      />

      <div className="table-wrapper">
        <DataTable
            data={filteredGuias}
            columns={[
              {
                header: "ID",
                accessorKey: "id",
                cell: (item: Guia) => (
                  <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>#{item.id}</span>
                ),
              },
              {
                header: "Empleado",
                accessorKey: "empleado",
                cell: (item: Guia) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaUser size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontWeight: 500 }}>{item.empleado}</span>
                  </div>
                ),
              },
              {
                header: "Fecha",
                accessorKey: "fecha",
                cell: (item: Guia) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaCalendarAlt size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span>{new Date(item.fecha).toLocaleDateString()}</span>
                  </div>
                ),
              },
              {
                header: "Tipo",
                accessorKey: "tipo",
                cell: (item: Guia) => (
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      backgroundColor: item.tipo === "Ingreso" 
                        ? "rgba(34, 197, 94, 0.1)" 
                        : "rgba(239, 68, 68, 0.1)",
                      color: item.tipo === "Ingreso" ? "#22c55e" : "#ef4444",
                      border: `1px solid ${item.tipo === "Ingreso" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`
                    }}
                  >
                    {item.tipo}
                  </span>
                ),
              },
              {
                header: "Acciones",
                align: "right",
                cell: (item: Guia) => (
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
        title="Nueva Guía"
        description="Completa la información de la guía"
        maxWidth="700px"
        icon={
          <div style={{
            width: "100%", height: "100%", 
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "12px"
          }}>
            <FaFileInvoice size={24} style={{ color: "white" }} />
          </div>
        }
        footer={renderFooter(handleGuardar, "Guardar")}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Empleado<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.empleado}
              onChange={(e) => setFormData({ ...formData, empleado: e.target.value })}
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
              <option value="">Seleccione un empleado</option>
              {empleados?.map((emp) => (
                <option key={emp.id} value={`${emp.nombre} ${emp.apellido}`}>
                  {emp.nombre} {emp.apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Fecha<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Tipo<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as "Ingreso" | "Salida" })}
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
              <option value="Ingreso">Ingreso</option>
              <option value="Salida">Salida</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
            setShowEditModal(false);
            setSelectedGuia(null);
            resetForm();
        }}
        title="Editar Guía"
        description="Modificar información de la guía"
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
              Empleado<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.empleado}
              onChange={(e) => setFormData({ ...formData, empleado: e.target.value })}
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
              <option value="">Seleccione un empleado</option>
              {empleados?.map((emp) => (
                <option key={emp.id} value={`${emp.nombre} ${emp.apellido}`}>
                  {emp.nombre} {emp.apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Fecha<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
              type="date"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Tipo<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as "Ingreso" | "Salida" })}
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
              <option value="Ingreso">Ingreso</option>
              <option value="Salida">Salida</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
