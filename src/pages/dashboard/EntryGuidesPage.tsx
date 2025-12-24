
import { useState } from "react"
import { FaPlus, FaEdit, FaTruck, FaSave, FaFileImport } from "react-icons/fa"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db"
import type { GuiaIngreso } from "../../types"
import { DataTable } from "../../components/ui/data-table"
import { PageHeader } from "../../components/ui/PageHeader"
import { ActionBar } from "../../components/ui/ActionBar"
import { Modal } from "../../components/ui/Modal"

import { Button } from "../../components/ui/button"

export function EntryGuidesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedGuia, setSelectedGuia] = useState<GuiaIngreso | null>(null)
  const [searchId, setSearchId] = useState("")
  const [searchType, setSearchType] = useState("id")
  const [formData, setFormData] = useState({
    guiaId: "",
    proveedor: "",
  })

  // Fetch data
  const guiasIngreso = useLiveQuery(() => db.guiasIngreso.toArray());
  const guias = useLiveQuery(() => db.guias.where('tipo').equals('Ingreso').toArray());
  const proveedores = useLiveQuery(() => db.proveedores.toArray());

  const handleGuardar = async () => {
    if (formData.guiaId && formData.proveedor) {
      try {
        await db.guiasIngreso.add({
          guiaId: formData.guiaId,
          proveedor: formData.proveedor,
        });
        resetForm();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar guía de ingreso:", error);
        alert("Error al guardar la guía de ingreso");
      }
    }
  }

  const handleEdit = (guia: GuiaIngreso) => {
    setSelectedGuia(guia)
    setFormData({
      guiaId: guia.guiaId,
      proveedor: guia.proveedor,
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (selectedGuia?.id && formData.guiaId) {
      try {
        await db.guiasIngreso.update(selectedGuia.id, {
          guiaId: formData.guiaId,
          proveedor: formData.proveedor,
        });
        resetForm();
        setSelectedGuia(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar guía de ingreso:", error);
        alert("Error al actualizar la guía de ingreso");
      }
    }
  }

  const resetForm = () => {
    setFormData({
      guiaId: "",
      proveedor: "",
    })
  }

  const filteredGuias = (guiasIngreso || []).filter((item) => {
    if (!searchId) return true;
    const lowerSearch = searchId.toLowerCase();

    switch(searchType) {
      case "id":
        return item.id?.toString().includes(lowerSearch);
      case "guiaId":
        return item.guiaId?.toString().toLowerCase().includes(lowerSearch);
      case "proveedor":
        return item.proveedor.toLowerCase().includes(lowerSearch);
      default:
        return item.id?.toString().includes(lowerSearch);
    }
  })

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
        title="Guías de Ingreso"
        description="Gestión de recepción de mercadería"
        actionElement={
          <button
            className="btn-primary-action"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={20} />
            Nueva Guía de Ingreso
          </button>
        }
      />

      <ActionBar
        title="Buscar Guía Ingreso"
        searchVal={searchId}
        setSearchVal={setSearchId}
        placeholder={`Buscar por ${searchType}...`}
        onSearch={() => {}}
        onClear={() => setSearchId("")}
        filterOptions={[
          { label: "Por ID Ingreso", value: "id" },
          { label: "Por ID Guía", value: "guiaId" },
          { label: "Por Proveedor", value: "proveedor" },
        ]}
        currentFilter={searchType}
        onFilterChange={setSearchType}
      />

      <div className="table-wrapper">
        <DataTable
            data={filteredGuias}
            columns={[
              {
                header: "ID",
                accessorKey: "id",
                cell: (item: GuiaIngreso) => (
                  <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>#{item.id}</span>
                ),
              },
              {
                header: "Guía",
                accessorKey: "guiaId",
                cell: (item: GuiaIngreso) => (
                  <span style={{ fontWeight: 500 }}>{item.guiaId}</span>
                ),
              },
              {
                header: "Proveedor",
                accessorKey: "proveedor",
                cell: (item: GuiaIngreso) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaTruck size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span>{item.proveedor}</span>
                  </div>
                ),
              },
              {
                header: "Acciones",
                align: "right",
                cell: (item: GuiaIngreso) => (
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
        title="Nueva Guía de Ingreso"
        description="Registrar guía de ingreso"
        maxWidth="600px"
        icon={
          <div style={{
            width: "100%", height: "100%", 
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "12px"
          }}>
            <FaFileImport size={24} style={{ color: "white" }} />
          </div>
        }
        footer={renderFooter(handleGuardar, "Guardar")}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Guía<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.guiaId}
              onChange={(e) => setFormData({ ...formData, guiaId: e.target.value })}
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
              <option value="">Seleccione una guía de tipo "Ingreso"</option>
              {guias?.map((g) => (
                <option key={g.id} value={g.id?.toString()}>
                  ID: {g.id} - {g.fecha}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Proveedor<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.proveedor}
              onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
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
              <option value="">Seleccione un proveedor</option>
              {proveedores?.map((p) => (
                <option key={p.id} value={`${p.nombre} ${p.apellido}`}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
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
        title="Editar Guía de Ingreso"
        description="Modificar guía de ingreso"
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Guía<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.guiaId}
              onChange={(e) => setFormData({ ...formData, guiaId: e.target.value })}
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
              <option value="">Seleccione una guía de tipo "Ingreso"</option>
              {guias?.map((g) => (
                <option key={g.id} value={g.id?.toString()}>
                  ID: {g.id} - {g.fecha}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Proveedor<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.proveedor}
              onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
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
              <option value="">Seleccione un proveedor</option>
              {proveedores?.map((p) => (
                <option key={p.id} value={`${p.nombre} ${p.apellido}`}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
