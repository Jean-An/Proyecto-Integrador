
import { useState } from "react"
import { FaPlus, FaEdit, FaSave, FaFileExport, FaUser, FaMapMarkerAlt, FaTruck } from "react-icons/fa"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db"
import type { GuiaSalida } from "../../types"
import { DataTable } from "../../components/ui/data-table"
import { PageHeader } from "../../components/ui/PageHeader"
import { ActionBar } from "../../components/ui/ActionBar"
import { Modal } from "../../components/ui/Modal"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"

export function ExitGuidesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedGuia, setSelectedGuia] = useState<GuiaSalida | null>(null)
  const [searchId, setSearchId] = useState("")
  const [searchType, setSearchType] = useState("id")
  const [formData, setFormData] = useState({
    guiaId: "",
    cliente: "",
    puertoPartida: "",
    puertoLlegada: "",
    transportista: "",
  })

  // Fetch data
  const guiasSalida = useLiveQuery(() => db.guiasSalida.toArray());
  const guias = useLiveQuery(() => db.guias.where('tipo').equals('Salida').toArray());
  const clientes = useLiveQuery(() => db.clientes.toArray());
  const transportistas = useLiveQuery(() => db.transportistas.toArray());

  const handleGuardar = async () => {
    if (formData.guiaId && formData.cliente && formData.puertoPartida && formData.puertoLlegada && formData.transportista) {
      try {
        await db.guiasSalida.add({
          guiaId: formData.guiaId,
          cliente: formData.cliente,
          puertoPartida: formData.puertoPartida,
          puertoLlegada: formData.puertoLlegada,
          transportista: formData.transportista,
        });
        resetForm();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar guía de salida:", error);
        alert("Error al guardar la guía de salida");
      }
    }
  }

  const handleEdit = (guia: GuiaSalida) => {
    setSelectedGuia(guia)
    setFormData({
      guiaId: guia.guiaId,
      cliente: guia.cliente,
      puertoPartida: guia.puertoPartida,
      puertoLlegada: guia.puertoLlegada,
      transportista: guia.transportista,
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (selectedGuia?.id && formData.guiaId) {
      try {
        await db.guiasSalida.update(selectedGuia.id, {
          guiaId: formData.guiaId,
          cliente: formData.cliente,
          puertoPartida: formData.puertoPartida,
          puertoLlegada: formData.puertoLlegada,
          transportista: formData.transportista,
        });
        resetForm();
        setSelectedGuia(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar guía de salida:", error);
        alert("Error al actualizar la guía de salida");
      }
    }
  }

  const resetForm = () => {
    setFormData({
      guiaId: "",
      cliente: "",
      puertoPartida: "",
      puertoLlegada: "",
      transportista: "",
    })
  }

  const filteredGuias = (guiasSalida || []).filter((item) => {
    if (!searchId) return true;
    const lowerSearch = searchId.toLowerCase();

    switch(searchType) {
      case "id":
        return item.id?.toString().includes(lowerSearch);
      case "guiaId":
        return item.guiaId?.toString().toLowerCase().includes(lowerSearch);
      case "cliente":
        return item.cliente.toLowerCase().includes(lowerSearch);
      case "transportista":
        return item.transportista.toLowerCase().includes(lowerSearch);
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
        title="Guías de Salida"
        description="Gestión de despacho de mercadería"
        actionElement={
          <button
            className="btn-primary-action"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={20} />
            Nueva Guía de Salida
          </button>
        }
      />

      <ActionBar
        title="Buscar Guía Salida"
        searchVal={searchId}
        setSearchVal={setSearchId}
        placeholder={`Buscar por ${searchType}...`}
        onSearch={() => {}}
        onClear={() => setSearchId("")}
        filterOptions={[
          { label: "Por ID Salida", value: "id" },
          { label: "Por ID Guía", value: "guiaId" },
          { label: "Por Cliente", value: "cliente" },
          { label: "Por Transportista", value: "transportista" },
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
                cell: (item: GuiaSalida) => (
                  <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>#{item.id}</span>
                ),
              },
              {
                header: "Guía",
                accessorKey: "guiaId",
                cell: (item: GuiaSalida) => (
                  <span style={{ fontWeight: 500 }}>{item.guiaId}</span>
                ),
              },
              {
                header: "Cliente",
                accessorKey: "cliente",
                cell: (item: GuiaSalida) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaUser size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontSize: "0.9rem" }}>{item.cliente}</span>
                  </div>
                ),
              },
              {
                header: "Puerto Partida",
                accessorKey: "puertoPartida",
                cell: (item: GuiaSalida) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaMapMarkerAlt size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontSize: "0.9rem" }}>{item.puertoPartida}</span>
                  </div>
                ),
              },
              {
                header: "Puerto Llegada",
                accessorKey: "puertoLlegada",
                cell: (item: GuiaSalida) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaMapMarkerAlt size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontSize: "0.9rem" }}>{item.puertoLlegada}</span>
                  </div>
                ),
              },
              {
                header: "Transportista",
                accessorKey: "transportista",
                cell: (item: GuiaSalida) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FaTruck size={14} style={{ color: "var(--muted-foreground)" }} />
                    <span style={{ fontSize: "0.9rem" }}>{item.transportista}</span>
                  </div>
                ),
              },
              {
                header: "Acciones",
                align: "right",
                cell: (item: GuiaSalida) => (
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
        title="Nueva Guía de Salida"
        description="Registrar guía de salida"
        maxWidth="800px"
        icon={
          <div style={{
            width: "100%", height: "100%", 
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "12px"
          }}>
            <FaFileExport size={24} style={{ color: "white" }} />
          </div>
        }
        footer={renderFooter(handleGuardar, "Guardar")}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
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
              <option value="">Seleccione una guía de tipo "Salida"</option>
              {guias?.map((g) => (
                <option key={g.id} value={g.id?.toString()}>
                  ID: {g.id} - {g.fecha}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Cliente<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.cliente}
              onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
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
              <option value="">Seleccione un cliente</option>
              {clientes?.map((c) => (
                <option key={c.id} value={`${c.nombre} ${c.apellido}`}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Puerto de Partida<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
              type="text"
              value={formData.puertoPartida}
              onChange={(e) => setFormData({ ...formData, puertoPartida: e.target.value })}
              placeholder="Ej: Almacén Central"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Puerto de Llegada<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
              type="text"
              value={formData.puertoLlegada}
              onChange={(e) => setFormData({ ...formData, puertoLlegada: e.target.value })}
              placeholder="Ej: Sucursal San Isidro"
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label className="block text-sm font-semibold mb-2">
              Transportista<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.transportista}
              onChange={(e) => setFormData({ ...formData, transportista: e.target.value })}
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
              <option value="">Seleccione un transportista</option>
              {transportistas?.map((t) => (
                <option key={t.id} value={`${t.nombre} ${t.apellido} (${t.placa})`}>
                  {t.nombre} {t.apellido} ({t.placa})
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
        title="Editar Guía de Salida"
        description="Modificar guía de salida"
        maxWidth="800px"
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
              <option value="">Seleccione una guía de tipo "Salida"</option>
              {guias?.map((g) => (
                <option key={g.id} value={g.id?.toString()}>
                  ID: {g.id} - {g.fecha}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Cliente<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.cliente}
              onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
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
              <option value="">Seleccione un cliente</option>
              {clientes?.map((c) => (
                <option key={c.id} value={`${c.nombre} ${c.apellido}`}>
                  {c.nombre} {c.apellido}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Puerto de Partida<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
              type="text"
              value={formData.puertoPartida}
              onChange={(e) => setFormData({ ...formData, puertoPartida: e.target.value })}
              placeholder="Ej: Almacén Central"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Puerto de Llegada<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <Input
              type="text"
              value={formData.puertoLlegada}
              onChange={(e) => setFormData({ ...formData, puertoLlegada: e.target.value })}
              placeholder="Ej: Sucursal San Isidro"
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label className="block text-sm font-semibold mb-2">
              Transportista<span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
            </label>
            <select
              value={formData.transportista}
              onChange={(e) => setFormData({ ...formData, transportista: e.target.value })}
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
              <option value="">Seleccione un transportista</option>
              {transportistas?.map((t) => (
                <option key={t.id} value={`${t.nombre} ${t.apellido} (${t.placa})`}>
                  {t.nombre} {t.apellido} ({t.placa})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
