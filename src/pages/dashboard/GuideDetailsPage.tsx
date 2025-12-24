
import { useState } from "react"
import { FaPlus, FaEdit, FaBox, FaSave, FaList, FaFileInvoice } from "react-icons/fa"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db"
import type { DetalleGuia } from "../../types"
import { DataTable } from "../../components/ui/data-table"
import { PageHeader } from "../../components/ui/PageHeader"
import { ActionBar } from "../../components/ui/ActionBar"
import { Modal } from "../../components/ui/Modal"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"

export function GuideDetailsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDetalle, setSelectedDetalle] = useState<DetalleGuia | null>(null)
  const [searchId, setSearchId] = useState("")
  const [searchType, setSearchType] = useState("id")
  const [formData, setFormData] = useState({
    guiaId: "",
    producto: "",
    cantidad: "",
  })

  // Fetch data
  const detalles = useLiveQuery(() => db.detallesGuia.toArray());
  const guias = useLiveQuery(() => db.guias.toArray());
  const productos = useLiveQuery(() => db.productos.toArray());

  const handleGuardar = async () => {
    if (formData.guiaId && formData.producto && formData.cantidad) {
      try {
        await db.detallesGuia.add({
          guiaId: formData.guiaId,
          producto: formData.producto,
          cantidad: Number(formData.cantidad),
        });
        resetForm();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar detalle:", error);
        alert("Error al guardar el detalle");
      }
    }
  }

  const handleEdit = (detalle: DetalleGuia) => {
    setSelectedDetalle(detalle)
    setFormData({
      guiaId: detalle.guiaId,
      producto: detalle.producto,
      cantidad: detalle.cantidad.toString(),
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (selectedDetalle?.id && formData.guiaId) {
      try {
        await db.detallesGuia.update(selectedDetalle.id, {
          guiaId: formData.guiaId,
          producto: formData.producto,
          cantidad: Number(formData.cantidad),
        });
        resetForm();
        setSelectedDetalle(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar detalle:", error);
        alert("Error al actualizar el detalle");
      }
    }
  }

  const resetForm = () => {
    setFormData({
      guiaId: "",
      producto: "",
      cantidad: "",
    })
  }

  const filteredDetalles = (detalles || []).filter((item) => {
    if (!searchId) return true;
    const lowerSearch = searchId.toLowerCase();
    
    switch(searchType) {
      case "id":
        return item.id?.toString().includes(lowerSearch);
      case "guiaId":
        return item.guiaId?.toString().toLowerCase().includes(lowerSearch);
      case "producto":
        return item.producto.toLowerCase().includes(lowerSearch);
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
                setSelectedDetalle(null);
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
        title="Detalles de Guía"
        description="Gestiona los productos por guía"
        actionElement={
          <button
            className="btn-primary-action"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={20} />
            Nuevo Detalle
          </button>
        }
      />

      <ActionBar
        title="Buscar Detalle"
        searchVal={searchId}
        setSearchVal={setSearchId}
        placeholder={`Buscar por ${searchType === 'id' ? 'ID' : searchType === 'guiaId' ? 'Guía ID' : 'Producto'}...`}
        onSearch={() => {}}
        onClear={() => setSearchId("")}
        filterOptions={[
          { label: "Por ID Detalle", value: "id" },
          { label: "Por ID Guía", value: "guiaId" },
          { label: "Por Producto", value: "producto" },
        ]}
        currentFilter={searchType}
        onFilterChange={setSearchType}
      />

      <div className="table-wrapper">
        <DataTable
            data={filteredDetalles}
            columns={[
              {
                header: "ID",
                accessorKey: "id",
                cell: (item: DetalleGuia) => (
                  <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>#{item.id}</span>
                ),
              },
              {
                header: "Guía",
                accessorKey: "guiaId",
                cell: (item: DetalleGuia) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaFileInvoice size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontWeight: 500 }}>{item.guiaId}</span>
                  </div>
                ),
              },
              {
                header: "Producto",
                accessorKey: "producto",
                cell: (item: DetalleGuia) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaBox size={14} style={{ color: "#3b82f6" }} />
                    <span>{item.producto}</span>
                  </div>
                ),
              },
              {
                header: "Cantidad",
                accessorKey: "cantidad",
                cell: (item: DetalleGuia) => (
                  <span style={{ fontWeight: 600 }}>{item.cantidad}</span>
                ),
              },
              {
                header: "Acciones",
                align: "right",
                cell: (item: DetalleGuia) => (
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
        title="Nuevo Detalle"
        description="Agregar items a la guía"
        maxWidth="700px"
        icon={
          <div style={{
            width: "100%", height: "100%", 
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "12px"
          }}>
            <FaList size={24} style={{ color: "white" }} />
          </div>
        }
        footer={renderFooter(handleGuardar, "Guardar")}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Guía ID<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
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
              <option value="">Seleccione una guía</option>
              {guias?.map((g) => (
                <option key={g.id} value={g.id?.toString()}>
                  ID: {g.id} - {g.tipo} ({g.fecha})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Producto<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.producto}
              onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
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
              <option value="">Seleccione un producto</option>
              {productos?.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Cantidad<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              min="1"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
            setShowEditModal(false);
            setSelectedDetalle(null);
            resetForm();
        }}
        title="Editar Detalle"
        description="Modificar detalle de guía"
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
              Guía ID<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
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
              <option value="">Seleccione una guía</option>
              {guias?.map((g) => (
                <option key={g.id} value={g.id?.toString()}>
                  ID: {g.id} - {g.tipo} ({g.fecha})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Producto<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.producto}
              onChange={(e) => setFormData({ ...formData, producto: e.target.value })}
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
              <option value="">Seleccione un producto</option>
              {productos?.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Cantidad<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
              type="number"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              min="1"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
