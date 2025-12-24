import { useState } from "react";
import { FaPlus, FaEdit, FaSave, FaTag } from "react-icons/fa";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../services/db"
import type { Brand } from "../../types";
import { DataTable } from "../../components/ui/data-table";
import { PageHeader } from "../../components/ui/PageHeader";
import { ActionBar } from "../../components/ui/ActionBar";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export function BrandsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [searchId, setSearchId] = useState("");
  const [nombreMarca, setNombreMarca] = useState("");
  
  // Use live query from Dexie
  const marcas = useLiveQuery(() => db.marcas.toArray());

  const handleGuardar = async () => {
    if (nombreMarca.trim()) {
      try {
        await db.marcas.add({
          nombre: nombreMarca,
        });
        setNombreMarca("");
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar marca:", error);
        alert("Error al guardar la marca");
      }
    }
  };

  const handleEdit = (marca: Brand) => {
    setSelectedBrand(marca);
    setNombreMarca(marca.nombre);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (selectedBrand?.id && nombreMarca.trim()) {
      try {
        await db.marcas.update(selectedBrand.id, {
          nombre: nombreMarca,
        });
        setNombreMarca("");
        setSelectedBrand(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar marca:", error);
        alert("Error al actualizar la marca");
      }
    }
  };

  const filteredMarcas = (marcas || []).filter((marca) => 
    searchId ? marca.id?.toString() === searchId : true
  );


  const renderFooter = (action: () => void, label: string, isUpdate = false) => (
    <>
      <Button
        variant="secondary"
        onClick={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          setSelectedBrand(null);
          setNombreMarca("");
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
        title="Marcas"
        description="Administra las marcas de productos del sistema"
        actionElement={
          <button
            className="btn-primary-action"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={20} />
            Nueva Marca
          </button>
        }
      />

      <ActionBar
        title="Buscar Marca por ID"
        searchVal={searchId}
        setSearchVal={setSearchId}
        placeholder="Ingrese el ID de la marca..."
        onSearch={() => {}}
        onClear={() => setSearchId("")}
      />

      <div className="table-wrapper">

        <DataTable
          data={filteredMarcas}
          columns={[
            {
              header: "ID",
              accessorKey: "id",
              cell: (item: Brand) => (
                <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>#{item.id}</span>
              ),
            },
            {
              header: "Nombre",
              accessorKey: "nombre",
              cell: (item: Brand) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      padding: "8px",
                      backgroundColor: "rgba(220, 38, 38, 0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <FaTag size={18} style={{ color: "#dc2626" }} />
                  </div>
                  <span
                    style={{
                      color: "var(--foreground)",
                      fontWeight: 500,
                      fontSize: "1rem",
                    }}
                  >
                    {item.nombre}
                  </span>
                </div>
              ),
            },
            {
              header: "Acciones",
              align: "right",
              cell: (item: Brand) => (
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
        onClose={() => setShowCreateModal(false)}
        title="Nueva Marca"
        description="Ingresa la información de la marca"
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
        <div>
          <label className="block text-sm font-semibold mb-2">
            Nombre de la Marca
            <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
          </label>
          <Input
            value={nombreMarca}
            onChange={(e) => setNombreMarca(e.target.value)}
            placeholder="Ej: Samsung"
          />
        </div>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBrand(null);
        }}
        title="Editar Marca"
        description="Modificar información de la marca"
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
        <div>
          <label className="block text-sm font-semibold mb-2">
            Nombre de la Marca
            <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
          </label>
          <Input
            value={nombreMarca}
            onChange={(e) => setNombreMarca(e.target.value)}
            placeholder="Ej: Samsung"
          />
        </div>
      </Modal>
    </div>
  );
}
