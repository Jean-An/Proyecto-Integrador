import { useState } from "react";
import { FaPlus, FaEdit, FaSearch, FaList, FaSave, FaBox, FaTimes } from "react-icons/fa";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type Product } from "../db";

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
      descripcion: producto.descripcion || "", // Optional in db, required for form
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


  const renderModal = (isEdit: boolean) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        overflowY: "auto",
        padding: "20px",
      }}
      onClick={() => {
          if (isEdit) {
            setShowEditModal(false);
            setSelectedProducto(null);
          } else {
            setShowCreateModal(false);
          }
      }}
    >
      <div
        style={{
          backgroundColor: "var(--card)",
          borderRadius: "20px",
          padding: "32px",
          width: "90%",
          maxWidth: "800px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          border: "1px solid var(--border)",
          margin: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "28px",
            paddingBottom: "20px",
            borderBottom: "2px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: isEdit
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : "linear-gradient(135deg, #3b82f6, #2563eb)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isEdit
                  ? "0 8px 16px rgba(245, 158, 11, 0.3)"
                  : "0 8px 16px rgba(59, 130, 246, 0.3)",
              }}
            >
              {isEdit ? <FaEdit size={24} style={{ color: "white" }} /> : <FaPlus size={24} style={{ color: "white" }} />}
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                {isEdit ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted-foreground)",
                  marginTop: "2px",
                  margin: 0,
                }}
              >
                {isEdit ? "Modificar información del producto" : "Complete la información del producto"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
                if (isEdit) {
                    setShowEditModal(false);
                    setSelectedProducto(null);
                } else {
                    setShowCreateModal(false);
                }
            }}
            style={{
              padding: "8px",
              borderRadius: "8px",
              transition: "all 0.2s",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaTimes size={24} style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "28px",
          }}
        >
          <div>
            <label className="block text-sm font-semibold mb-2">
              Nombre<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="input-styled"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Marca<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.marca}
              onChange={(e) =>
                setFormData({ ...formData, marca: e.target.value })
              }
              className="input-styled"
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="block text-sm font-semibold mb-2">
              Descripción<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px 14px",
                backgroundColor: "var(--secondary)",
                border: "2px solid var(--border)",
                borderRadius: "10px",
                color: "var(--foreground)",
                fontSize: "0.9rem",
                minHeight: "80px",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Categoría<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value })
              }
              className="input-styled"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Ubicación<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) =>
                setFormData({ ...formData, ubicacion: e.target.value })
              }
              className="input-styled"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Stock<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: e.target.value })
              }
              className="input-styled"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">
              Precio<span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.precio}
              onChange={(e) =>
                setFormData({ ...formData, precio: e.target.value })
              }
              className="input-styled"
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={() => {
                if (isEdit) {
                    setShowEditModal(false);
                    setSelectedProducto(null);
                } else {
                    setShowCreateModal(false);
                }
            }}
            style={{
              padding: "12px 24px",
              backgroundColor: "var(--secondary)",
              color: "var(--foreground)",
              borderRadius: "10px",
              fontWeight: 600,
              border: "2px solid var(--border)",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={isEdit ? handleUpdate : handleGuardar}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              background: isEdit
                  ? "linear-gradient(135deg, #f59e0b, #d97706)"
                  : "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              borderRadius: "10px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            }}
          >
            <FaSave size={18} />
            {isEdit ? "Actualizar" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "40px", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
          paddingBottom: "24px",
          borderBottom: "2px solid rgba(220, 38, 38, 0.2)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              background: "linear-gradient(135deg, #dc2626, #ef4444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "8px",
            }}
          >
            Productos
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Administra el inventario de productos del sistema
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 28px",
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            color: "white",
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "0.95rem",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 16px -4px rgba(59, 130, 246, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 12px 24px -4px rgba(59, 130, 246, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 8px 16px -4px rgba(59, 130, 246, 0.4)";
          }}
        >
          <FaPlus size={20} />
          Nuevo Producto
        </button>
      </div>

      <div
        style={{
          backgroundColor: "var(--card)",
          borderRadius: "16px",
          padding: "28px",
          marginBottom: "32px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "10px",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderRadius: "10px",
            }}
          >
            <FaSearch size={22} style={{ color: "#3b82f6" }} />
          </div>
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            Buscar Producto por ID
          </h3>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder="Ingrese el ID del producto..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                paddingLeft: "44px",
                backgroundColor: "var(--secondary)",
                border: "2px solid var(--border)",
                borderRadius: "10px",
                color: "var(--foreground)",
                fontSize: "0.95rem",
                transition: "all 0.2s",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <FaSearch
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--muted-foreground)",
              }}
            />
          </div>
          <button
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              borderRadius: "10px",
              fontWeight: 600,
              transition: "all 0.2s",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Buscar
          </button>
          <button
            onClick={() => setSearchId("")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 24px",
              backgroundColor: "var(--secondary)",
              color: "var(--foreground)",
              borderRadius: "10px",
              fontWeight: 600,
              border: "2px solid var(--border)",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            <FaList size={18} />
            Ver Todos
          </button>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "var(--card)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "1400px",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(135deg, #1a1a1a, #262626)",
                  borderBottom: "2px solid rgba(220, 38, 38, 0.3)",
                }}
              >
                {[
                  "ID",
                  "Nombre",
                  "Descripción",
                  "Categoría",
                  "Marca",
                  "Stock",
                  "Precio",
                  "Ubicación",
                  "Estado",
                  "Acciones",
                ].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: "20px 16px",
                      textAlign: "left",
                      fontWeight: 700,
                      color: "white",
                      fontSize: "0.85rem",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((producto, index) => (
                <tr
                  key={producto.id}
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "var(--card)" : "var(--secondary)",
                    borderBottom: "1px solid var(--border)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(59, 130, 246, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? "var(--card)" : "var(--secondary)";
                  }}
                >
                  <td
                    style={{
                      padding: "18px 16px",
                      color: "var(--muted-foreground)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    #{producto.id}
                  </td>
                  <td style={{ padding: "18px 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          padding: "6px",
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          borderRadius: "6px",
                        }}
                      >
                        <FaBox size={16} style={{ color: "#3b82f6" }} />
                      </div>
                      <span
                        style={{
                          color: "var(--foreground)",
                          fontWeight: 500,
                          fontSize: "0.9rem",
                        }}
                      >
                        {producto.nombre}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "18px 16px",
                      color: "var(--muted-foreground)",
                      fontSize: "0.85rem",
                      maxWidth: "200px",
                    }}
                  >
                    {producto.descripcion}
                  </td>
                  <td
                    style={{
                      padding: "18px 16px",
                      color: "var(--foreground)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {producto.categoria}
                  </td>
                  <td
                    style={{
                      padding: "18px 16px",
                      color: "var(--foreground)",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                  >
                    {producto.marca}
                  </td>
                  <td style={{ padding: "18px 16px" }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        backgroundColor:
                          producto.stock > 20
                            ? "rgba(34, 197, 94, 0.15)"
                            : "rgba(234, 179, 8, 0.15)",
                        color: producto.stock > 20 ? "#22c55e" : "#eab308",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                      }}
                    >
                      {producto.stock}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "18px 16px",
                      color: "var(--foreground)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    ${producto.precio}
                  </td>
                  <td
                    style={{
                      padding: "18px 16px",
                      color: "var(--muted-foreground)",
                      fontSize: "0.85rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {producto.ubicacion}
                  </td>
                  <td style={{ padding: "18px 16px" }}>
                    <span
                      onClick={() => handleToggleStatus(producto)}
                      style={{
                        display: "inline-block",
                        padding: "6px 14px",
                        backgroundColor:
                          producto.estado === "Activo" ? "rgba(59, 130, 246, 0.15)" : "rgba(107, 114, 128, 0.15)",
                        color: producto.estado === "Activo" ? "#3b82f6" : "#6b7280",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        border: `1px solid ${producto.estado === "Activo" ? "rgba(59, 130, 246, 0.3)" : "rgba(107, 114, 128, 0.3)"}`,
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
                      {producto.estado}
                    </span>
                  </td>
                  <td style={{ padding: "18px 16px" }}>
                    <button
                      onClick={() => handleEdit(producto)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "10px 18px",
                        background:
                          "linear-gradient(135deg, #f59e0b, #d97706)",
                        color: "white",
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        transition: "all 0.2s",
                        boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 16px rgba(245, 158, 11, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(245, 158, 11, 0.3)";
                      }}
                    >
                      <FaEdit size={14} />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && renderModal(false)}
      {showEditModal && renderModal(true)}
    </div>
  );
}
