
import { useState } from "react";
import { FaPlus, FaEdit, FaSave, FaBox } from "react-icons/fa";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../services/db"
import type { Product } from "../../types";
import { DataTable } from "../../components/ui/data-table";
import { PageHeader } from "../../components/ui/PageHeader";
import { ActionBar } from "../../components/ui/ActionBar";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/button";
import { ProductForm } from "../../components/dashboard/ProductForm";

export function ProductosPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Product | null>(null);
  const [searchId, setSearchId] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    marca: "",
    stock: "",
    precio: "",
    ubicacion: "",
    estado: "Activo" as "Activo" | "Deshabilitado",
  });

  // Replace mock state with live query from Dexie
  const productos = useLiveQuery(() => db.productos.toArray());

  const handleGuardar = async () => {
    if (
      formData.nombre.trim() &&
      formData.descripcion.trim() &&
      formData.categoria.trim() &&
      formData.marca.trim() &&
      formData.stock &&
      formData.precio &&
      formData.ubicacion.trim()
    ) {
      try {
        await db.productos.add({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          categoria: formData.categoria,
          marca: formData.marca,
          stock: Number.parseInt(formData.stock),
          precio: Number.parseFloat(formData.precio),
          ubicacion: formData.ubicacion,
          estado: formData.estado,
        });
        setFormData({
          nombre: "",
          descripcion: "",
          categoria: "",
          marca: "",
          stock: "",
          precio: "",
          ubicacion: "",
          estado: "Activo",
        });
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar producto:", error);
        alert("Error al guardar el producto");
      }
    }
  };

  const handleToggleStatus = async (producto: Product) => {
    if (producto.id) {
      const newStatus = producto.estado === "Activo" ? "Deshabilitado" : "Activo";
      try {
        await db.productos.update(producto.id, { estado: newStatus });
      } catch (error) {
        console.error("Error al cambiar estado:", error);
      }
    }
  };

  const handleEdit = (producto: Product) => {
    setSelectedProducto(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "", 
      categoria: producto.categoria,
      marca: producto.marca,
      stock: producto.stock.toString(),
      precio: producto.precio.toString(),
      ubicacion: producto.ubicacion || "",
      estado: (producto.estado as "Activo" | "Deshabilitado") || "Activo",
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (
      selectedProducto?.id &&
      formData.nombre.trim()
    ) {
      try {
        await db.productos.update(selectedProducto.id, {
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          categoria: formData.categoria,
          marca: formData.marca,
          stock: Number.parseInt(formData.stock),
          precio: Number.parseFloat(formData.precio),
          ubicacion: formData.ubicacion,
          estado: formData.estado,
        });
        setFormData({
          nombre: "",
          descripcion: "",
          categoria: "",
          marca: "",
          stock: "",
          precio: "",
          ubicacion: "",
          estado: "Activo",
        });
        setSelectedProducto(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar producto:", error);
        alert("Error al actualizar el producto");
      }
    }
  };
  
  const filteredProductos = (productos || []).filter((prod) => 
    searchId ? prod.id?.toString() === searchId : true
  );


  const renderFooter = (action: () => void, label: string, isUpdate = false) => (
    <>
      <Button
        variant="secondary"
        onClick={() => {
            if (isUpdate) {
                setShowEditModal(false);
                setSelectedProducto(null);
            } else {
                setShowCreateModal(false);
            }
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
        title="Productos"
        description="Administra el inventario de productos del sistema"
        actionElement={
          <button
            className="btn-primary-action"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={20} />
            Nuevo Producto
          </button>
        }
      />

      <ActionBar
        title="Buscar Producto por ID"
        searchVal={searchId}
        setSearchVal={setSearchId}
        placeholder="Ingrese el ID del producto..."
        onSearch={() => {}}
        onClear={() => setSearchId("")}
      />

      <div className="table-wrapper">

        <DataTable
            data={filteredProductos}
            columns={[
              {
                header: "ID",
                accessorKey: "id",
                cell: (item: Product) => (
                  <span style={{ fontWeight: 600, color: "var(--muted-foreground)" }}>#{item.id}</span>
                ),
              },
              {
                header: "Nombre",
                accessorKey: "nombre",
                cell: (item: Product) => (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        padding: "6px",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        borderRadius: "6px",
                      }}
                    >
                      <FaBox size={16} style={{ color: "#3b82f6" }} />
                    </div>
                    <span style={{ color: "var(--foreground)", fontWeight: 500, fontSize: "0.9rem" }}>
                      {item.nombre}
                    </span>
                  </div>
                ),
              },
              {
                header: "Descripción",
                accessorKey: "descripcion",
                cell: (item: Product) => (
                  <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                    {item.descripcion}
                  </span>
                ),
              },
              { header: "Categoría", accessorKey: "categoria" },
              { header: "Marca", accessorKey: "marca" },
              {
                header: "Stock",
                accessorKey: "stock",
                cell: (item: Product) => (
                  <span
                    style={{
                      padding: "6px 12px",
                      backgroundColor:
                        item.stock > 20
                          ? "rgba(34, 197, 94, 0.15)"
                          : "rgba(234, 179, 8, 0.15)",
                      color: item.stock > 20 ? "#22c55e" : "#eab308",
                      borderRadius: "8px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    {item.stock}
                  </span>
                ),
              },
              {
                header: "Precio",
                accessorKey: "precio",
                cell: (item: Product) => (
                  <span style={{ fontWeight: 600 }}>${item.precio}</span>
                ),
              },
              {
                header: "Ubicación",
                accessorKey: "ubicacion",
                cell: (item: Product) => (
                  <span style={{ fontFamily: "monospace", color: "var(--muted-foreground)" }}>
                    {item.ubicacion}
                  </span>
                ),
              },
              {
                header: "Estado",
                accessorKey: "estado",
                cell: (item: Product) => (
                  <span
                    onClick={() => handleToggleStatus(item)}
                    style={{
                      display: "inline-block",
                      width: "120px",
                      textAlign: "center",
                      padding: "6px 0",
                      backgroundColor:
                        item.estado === "Activo" ? "rgba(59, 130, 246, 0.15)" : "rgba(107, 114, 128, 0.15)",
                      color: item.estado === "Activo" ? "#3b82f6" : "#6b7280",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      border: `1px solid ${item.estado === "Activo" ? "rgba(59, 130, 246, 0.3)" : "rgba(107, 114, 128, 0.3)"}`,
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
                cell: (item: Product) => (
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "10px 18px",
                      background: "linear-gradient(135deg, #f59e0b, #d97706)",
                      color: "white",
                      borderRadius: "10px",
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
        onClose={() => setShowCreateModal(false)}
        title="Nuevo Producto"
        description="Complete la información del producto"
        maxWidth="800px"
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
        <ProductForm formData={formData} onChange={setFormData} />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
            setShowEditModal(false);
            setSelectedProducto(null);
        }}
        title="Editar Producto"
        description="Modificar información del producto"
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
        <ProductForm formData={formData} onChange={setFormData} />
      </Modal>
    </div>
  );
}
