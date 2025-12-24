import { useState } from "react";
import { FaPlus, FaTimes, FaEdit, FaSearch, FaList, FaSave, FaTag } from "react-icons/fa";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../services/db"
import type { Category } from "../../types";

export function CategoriasPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Category | null>(null);
  const [searchId, setSearchId] = useState("");
  const [nombreCategoria, setNombreCategoria] = useState("");
  
  // Replace mock state with live query from Dexie
  const categorias = useLiveQuery(() => db.categorias.toArray());

  const handleGuardar = async () => {
    if (nombreCategoria.trim()) {
      try {
        await db.categorias.add({
          nombre: nombreCategoria,
        });
        setNombreCategoria("");
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar categoría:", error);
        alert("Error al guardar la categoría");
      }
    }
  };

  const handleEdit = (categoria: Category) => {
    setSelectedCategoria(categoria);
    setNombreCategoria(categoria.nombre);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (selectedCategoria?.id && nombreCategoria.trim()) {
      try {
        await db.categorias.update(selectedCategoria.id, {
          nombre: nombreCategoria,
        });
        setNombreCategoria("");
        setSelectedCategoria(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar categoría:", error);
        alert("Error al actualizar la categoría");
      }
    }
  };

  const filteredCategorias = (categorias || []).filter((cat) => 
    searchId ? cat.id?.toString() === searchId : true
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
          position: "relative",
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
            Categorías
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Administra las categorías de productos del sistema
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
          Nueva Categoría
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
            Buscar Categoría por ID
          </h3>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder="Ingrese el ID de la categoría..."
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
            onClick={() => {}}
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
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
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
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--sidebar-accent)";
              e.currentTarget.style.borderColor = "#dc2626";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--secondary)";
              e.currentTarget.style.borderColor = "var(--border)";
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
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "linear-gradient(135deg, #1a1a1a, #262626)",
                borderBottom: "2px solid rgba(220, 38, 38, 0.3)",
              }}
            >
              <th
                style={{
                  padding: "20px 24px",
                  textAlign: "left",
                  fontWeight: 700,
                  color: "white", // Explicit white text for dark header
                  fontSize: "0.9rem",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                ID
              </th>
              <th
                style={{
                  padding: "20px 24px",
                  textAlign: "left",
                  fontWeight: 700,
                  color: "white",
                  fontSize: "0.9rem",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Nombre
              </th>
              <th
                style={{
                  padding: "20px 24px",
                  textAlign: "right",
                  fontWeight: 700,
                  color: "white",
                  fontSize: "0.9rem",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCategorias.map((categoria, index) => (
              <tr
                key={categoria.id}
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
                    padding: "20px 24px",
                    color: "var(--muted-foreground)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                >
                  #{categoria.id}
                </td>
                <td style={{ padding: "20px 24px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
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
                      {categoria.nombre}
                    </span>
                  </div>
                </td>
                <td style={{ padding: "20px 24px", textAlign: "right" }}>
                  <button
                    onClick={() => handleEdit(categoria)}
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
                    <FaEdit size={16} />
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
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
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              backgroundColor: "var(--card)",
              borderRadius: "20px",
              padding: "32px",
              width: "90%",
              maxWidth: "520px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 16px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  <FaPlus size={24} style={{ color: "white" }} />
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
                    Nueva Categoría
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--muted-foreground)",
                      marginTop: "2px",
                      margin: 0,
                    }}
                  >
                    Ingresa la información de la categoría
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <FaTimes size={24} style={{ color: "var(--muted-foreground)" }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  marginBottom: "10px",
                }}
              >
                Nombre de la Categoría
                <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
              </label>
              <input
                type="text"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  backgroundColor: "var(--secondary)",
                  border: "2px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                placeholder="Ej: Electrodomésticos"
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
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "var(--secondary)",
                  color: "var(--foreground)",
                  borderRadius: "10px",
                  fontWeight: 600,
                  border: "2px solid var(--border)",
                  transition: "all 0.2s",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--sidebar-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary)";
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 28px",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: 600,
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(59, 130, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(59, 130, 246, 0.3)";
                }}
              >
                <FaSave size={18} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedCategoria && (
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
          }}
          onClick={() => {
            setShowEditModal(false);
            setSelectedCategoria(null);
            setNombreCategoria("");
          }}
        >
          <div
            style={{
              backgroundColor: "var(--card)",
              borderRadius: "20px",
              padding: "32px",
              width: "90%",
              maxWidth: "520px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              border: "1px solid var(--border)",
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 16px rgba(245, 158, 11, 0.3)",
                  }}
                >
                  <FaEdit size={24} style={{ color: "white" }} />
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
                    Editar Categoría
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--muted-foreground)",
                      marginTop: "2px",
                      margin: 0,
                    }}
                  >
                    Modificar información de la categoría
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCategoria(null);
                  setNombreCategoria("");
                }}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <FaTimes size={24} style={{ color: "var(--muted-foreground)" }} />
              </button>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "var(--foreground)",
                  marginBottom: "10px",
                }}
              >
                Nombre de la Categoría
                <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
              </label>
              <input
                type="text"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  backgroundColor: "var(--secondary)",
                  border: "2px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  outline: "none",
                }}
                placeholder="Ej: Electrodomésticos"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f59e0b";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(245, 158, 11, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
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
                  setShowEditModal(false);
                  setSelectedCategoria(null);
                  setNombreCategoria("");
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "var(--secondary)",
                  color: "var(--foreground)",
                  borderRadius: "10px",
                  fontWeight: 600,
                  border: "2px solid var(--border)",
                  transition: "all 0.2s",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--sidebar-accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary)";
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdate}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 28px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  color: "white",
                  borderRadius: "10px",
                  fontWeight: 600,
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(245, 158, 11, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(245, 158, 11, 0.3)";
                }}
              >
                <FaSave size={18} />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
