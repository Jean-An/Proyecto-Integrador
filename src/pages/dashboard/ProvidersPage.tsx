
import { useState } from "react";
import { FaPlus, FaEdit, FaSave, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../services/db"
import type { Provider } from "../../types";
import { DataTable } from "../../components/ui/data-table";
import { PageHeader } from "../../components/ui/PageHeader";
import { ActionBar } from "../../components/ui/ActionBar";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export function ProvidersPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [searchId, setSearchId] = useState("");
  
  const [formData, setFormData] = useState<Omit<Provider, "id">>({
    ruc: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    correo: "",
    estado: "Activo"
  });
  
  // Use live query from Dexie
  const proveedores = useLiveQuery(() => db.proveedores.toArray());

  const handleGuardar = async () => {
    if (formData.ruc && formData.nombre) {
      try {
        await db.proveedores.add(formData);
        resetForm();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar proveedor:", error);
        alert("Error al guardar el proveedor");
      }
    }
  };

  const handleEdit = (provider: Provider) => {
    setSelectedProvider(provider);
    setFormData({
      ruc: provider.ruc,
      nombre: provider.nombre,
      apellido: provider.apellido,
      direccion: provider.direccion,
      telefono: provider.telefono,
      correo: provider.correo,
      estado: provider.estado
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (selectedProvider?.id) {
      try {
        await db.proveedores.update(selectedProvider.id, formData);
        resetForm();
        setSelectedProvider(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar proveedor:", error);
        alert("Error al actualizar el proveedor");
      }
    }
  };

  const handleToggleStatus = async (provider: Provider) => {
    if (provider.id) {
        const newStatus = provider.estado === "Activo" ? "Deshabilitado" : "Activo";
        try {
            await db.proveedores.update(provider.id, { estado: newStatus });
        } catch (error) {
            console.error("Error al cambiar estado:", error);
        }
    }
  };

  const resetForm = () => {
    setFormData({
      ruc: "",
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
      correo: "",
      estado: "Activo"
    });
  };

  const filteredProviders = (proveedores || []).filter((prov) => 
    searchId ? prov.id?.toString() === searchId : true
  );

  const renderFooter = (action: () => void, label: string, isUpdate = false) => (
    <>
      <Button
        variant="secondary"
        onClick={() => {
            if (isUpdate) {
                setShowEditModal(false);
                setSelectedProvider(null);
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
        title="Proveedores"
        description="Administra la lista de proveedores"
        actionElement={
          <button
            className="btn-primary-action"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={20} />
            Nuevo Proveedor
          </button>
        }
      />

      <ActionBar
        title="Buscar Proveedor por ID"
        searchVal={searchId}
        setSearchVal={setSearchId}
        placeholder="Ingrese ID..."
        onSearch={() => {}}
        onClear={() => setSearchId("")}
      />

      <div className="table-wrapper">
        <DataTable
          data={filteredProviders}
          columns={[
            {
              header: "ID",
              accessorKey: "id",
              cell: (item: Provider) => (
                <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>#{item.id}</span>
              ),
            },
            {
              header: "RUC",
              accessorKey: "ruc",
              cell: (item: Provider) => (
                <span style={{ fontWeight: 600 }}>{item.ruc}</span>
              ),
            },
            {
              header: "Nombre",
              accessorKey: "nombre",
            },
            {
              header: "Apellido",
              accessorKey: "apellido",
            },
            {
              header: "Dirección",
              accessorKey: "direccion",
              cell: (item: Provider) => (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaMapMarkerAlt size={14} style={{ color: "var(--muted-foreground)" }} />
                  <span style={{ fontSize: "0.9rem" }}>{item.direccion}</span>
                </div>
              ),
            },
            {
              header: "Teléfono",
              accessorKey: "telefono",
              cell: (item: Provider) => (
                 <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaPhone size={14} style={{ color: "var(--muted-foreground)" }} />
                  <span style={{ fontSize: "0.9rem" }}>{item.telefono}</span>
                </div>
              ),
            },
            {
              header: "Correo",
              accessorKey: "correo",
              cell: (item: Provider) => (
                 <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FaEnvelope size={14} style={{ color: "var(--muted-foreground)" }} />
                  <span style={{ fontSize: "0.9rem" }}>{item.correo}</span>
                </div>
              ),
            },
             {
                header: "Estado",
                align: "center",
                accessorKey: "estado",
                cell: (item: Provider) => (
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
              cell: (item: Provider) => (
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
                    border: "none",
                    cursor: "pointer",
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
        title="Nuevo Proveedor"
        description="Completa la información del proveedor"
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
            <label className="block text-sm font-semibold mb-2">RUC</label>
            <Input 
                value={formData.ruc}
                onChange={(e) => setFormData({...formData, ruc: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-semibold mb-2">Nombre</label>
            <Input 
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-semibold mb-2">Apellido</label>
            <Input 
                value={formData.apellido}
                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-semibold mb-2">Dirección</label>
            <Input 
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-semibold mb-2">Teléfono</label>
            <Input 
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-semibold mb-2">Correo</label>
            <Input 
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})}
            />
            </div>
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
            setShowEditModal(false);
            setSelectedProvider(null);
            resetForm();
        }}
        title="Editar Proveedor"
        description="Modificar información del proveedor"
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
            <label className="block text-sm font-semibold mb-2">RUC</label>
            <Input 
                value={formData.ruc}
                onChange={(e) => setFormData({...formData, ruc: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-semibold mb-2">Nombre</label>
            <Input 
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-semibold mb-2">Apellido</label>
            <Input 
                value={formData.apellido}
                onChange={(e) => setFormData({...formData, apellido: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-semibold mb-2">Dirección</label>
            <Input 
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-semibold mb-2">Teléfono</label>
            <Input 
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-semibold mb-2">Correo</label>
            <Input 
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})}
            />
            </div>
        </div>
      </Modal>
    </div>
  );
}
