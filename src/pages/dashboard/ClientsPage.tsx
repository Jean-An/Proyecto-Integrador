"use client"

import { useState } from "react"
import { FaPlus, FaEdit, FaSearch, FaList, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCreditCard, FaTimes, FaSave } from "react-icons/fa"
import { useLiveQuery } from "dexie-react-hooks"
import { db } from "../../services/db"
import type { Cliente } from "../../types"

export function ClientesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [searchId, setSearchId] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    dni: "",
    direccion: "",
    estado: "Activo" as "Activo" | "Deshabilitado",
  })

  // Fetch clients from Dexie
  const clientes = useLiveQuery(() => db.clientes.toArray());

  const handleGuardar = async () => {
    if (formData.nombre.trim() && formData.apellido.trim() && formData.email.trim()) {
      try {
        await db.clientes.add({
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          dni: formData.dni,
          direccion: formData.direccion,
          estado: formData.estado,
        });
        resetForm();
        setShowCreateModal(false);
      } catch (error) {
        console.error("Error al guardar cliente:", error);
        alert("Error al guardar el cliente");
      }
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente)
    setFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      dni: cliente.dni,
      direccion: cliente.direccion,
      estado: (cliente.estado as "Activo" | "Deshabilitado") || "Activo",
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (selectedCliente?.id && formData.nombre.trim() && formData.apellido.trim()) {
      try {
        await db.clientes.update(selectedCliente.id, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          dni: formData.dni,
          direccion: formData.direccion,
          estado: formData.estado,
        });
        resetForm();
        setSelectedCliente(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error al actualizar cliente:", error);
        alert("Error al actualizar el cliente");
      }
    }
  }

  // Toggle Status Function
  const handleToggleStatus = async (cliente: Cliente) => {
    if (cliente.id) {
      const newStatus = cliente.estado === "Activo" ? "Deshabilitado" : "Activo";
      try {
        await db.clientes.update(cliente.id, { estado: newStatus });
      } catch (error) {
        console.error("Error al cambiar estado:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      dni: "",
      direccion: "",
      estado: "Activo",
    })
  }

  const filteredClientes = (clientes || []).filter((cliente) => 
    searchId ? cliente.id?.toString() === searchId : true
  )

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
            Clientes
          </h1>
          <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>
            Administra la información de tus clientes
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
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 12px 24px -4px rgba(59, 130, 246, 0.5)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 8px 16px -4px rgba(59, 130, 246, 0.4)"
          }}
        >
          <FaPlus size={20} />
          Nuevo Cliente
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
            Buscar Cliente por ID
          </h3>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              placeholder="Ingrese el ID del cliente..."
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
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3b82f6"
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)"
                e.currentTarget.style.boxShadow = "none"
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
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
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
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--sidebar-accent)"
              e.currentTarget.style.borderColor = "#dc2626"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--secondary)"
              e.currentTarget.style.borderColor = "var(--border)"
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
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1200px" }}>
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
                    color: "var(--foreground)",
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
                    color: "var(--foreground)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Cliente
                </th>
                <th
                  style={{
                    padding: "20px 24px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "20px 24px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Teléfono
                </th>
                <th
                  style={{
                    padding: "20px 24px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  DNI
                </th>
                <th
                  style={{
                    padding: "20px 24px",
                    textAlign: "left",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Dirección
                </th>
                <th
                  style={{
                    padding: "20px 24px",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  Estado
                </th>
                <th
                  style={{
                    padding: "20px 24px",
                    textAlign: "right",
                    fontWeight: 700,
                    color: "var(--foreground)",
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
              {filteredClientes.map((cliente, index) => (
                <tr
                  key={cliente.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "var(--card)" : "var(--secondary)",
                    borderBottom: "1px solid var(--border)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.05)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? "var(--card)" : "var(--secondary)"
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
                    #{cliente.id}
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          padding: "10px",
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          borderRadius: "8px",
                        }}
                      >
                        <FaUser size={18} style={{ color: "#3b82f6" }} />
                      </div>
                      <div>
                        <div
                          style={{
                            color: "var(--foreground)",
                            fontWeight: 600,
                            fontSize: "1rem",
                          }}
                        >
                          {cliente.nombre} {cliente.apellido}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaEnvelope size={16} style={{ color: "var(--muted-foreground)" }} />
                      <span style={{ color: "var(--foreground)", fontSize: "0.95rem" }}>{cliente.email}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaPhone size={16} style={{ color: "var(--muted-foreground)" }} />
                      <span style={{ color: "var(--foreground)", fontSize: "0.95rem" }}>{cliente.telefono}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaCreditCard size={16} style={{ color: "var(--muted-foreground)" }} />
                      <span style={{ color: "var(--foreground)", fontSize: "0.95rem" }}>{cliente.dni}</span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", maxWidth: "250px" }}>
                      <FaMapMarkerAlt size={16} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
                      <span
                        style={{
                          color: "var(--muted-foreground)",
                          fontSize: "0.9rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={cliente.direccion}
                      >
                        {cliente.direccion}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "center" }}>
                    <span
                      onClick={() => handleToggleStatus(cliente)}
                      style={{
                        display: "inline-block",
                        padding: "6px 16px",
                        borderRadius: "20px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        backgroundColor:
                          cliente.estado === "Activo" ? "rgba(34, 197, 94, 0.1)" : "rgba(107, 114, 128, 0.1)",
                        color: cliente.estado === "Activo" ? "#22c55e" : "#6b7280",
                        border: `1px solid ${cliente.estado === "Activo" ? "rgba(34, 197, 94, 0.3)" : "rgba(107, 114, 128, 0.3)"}`,
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
                      {cliente.estado}
                    </span>
                  </td>
                  <td style={{ padding: "20px 24px", textAlign: "right" }}>
                    <button
                      onClick={() => handleEdit(cliente)}
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
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.4)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.3)"
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
      </div>

      {/* Modal Crear Cliente */}
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
            animation: "fadeIn 0.2s ease",
          }}
          onClick={() => {
            setShowCreateModal(false)
            resetForm()
          }}
        >
          <div
            style={{
              backgroundColor: "var(--card)",
              borderRadius: "20px",
              padding: "32px",
              width: "90%",
              maxWidth: "720px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              border: "1px solid var(--border)",
              animation: "slideUp 0.3s ease",
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
                    }}
                  >
                    Nuevo Cliente
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginTop: "2px" }}>
                    Completa la información del cliente
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
                }}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <FaTimes size={24} style={{ color: "var(--muted-foreground)" }} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Nombre
                  <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                  placeholder="Ej: Juan"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Apellido
                  <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
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
                  placeholder="Ej: Pérez"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Email
                  <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  placeholder="Ej: juan@email.com"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
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
                  placeholder="Ej: 987654321"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  DNI
                </label>
                <input
                  type="text"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
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
                  placeholder="Ej: 12345678"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value as "Activo" | "Deshabilitado" })}
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
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <option value="Activo">Activo</option>
                  <option value="Deshabilitado">Deshabilitado</option>
                </select>
              </div>
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
                Dirección
              </label>
              <textarea
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  backgroundColor: "var(--secondary)",
                  border: "2px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  resize: "vertical",
                }}
                placeholder="Ej: Av. Principal 123, Lima"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6"
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  resetForm()
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--sidebar-accent)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary)"
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
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)"
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)"
                }}
              >
                <FaSave size={18} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Cliente */}
      {showEditModal && selectedCliente && (
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
            animation: "fadeIn 0.2s ease",
          }}
          onClick={() => {
            setShowEditModal(false)
            setSelectedCliente(null)
            resetForm()
          }}
        >
          <div
            style={{
              backgroundColor: "var(--card)",
              borderRadius: "20px",
              padding: "32px",
              width: "90%",
              maxWidth: "720px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              border: "1px solid var(--border)",
              animation: "slideUp 0.3s ease",
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
                    }}
                  >
                    Editar Cliente
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", marginTop: "2px" }}>
                    Actualiza la información del cliente
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedCliente(null)
                  resetForm()
                }}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  transition: "all 0.2s",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
              >
                <FaTimes size={24} style={{ color: "var(--muted-foreground)" }} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Nombre
                  <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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
                  placeholder="Ej: Juan"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Apellido
                  <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
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
                  placeholder="Ej: Pérez"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Email
                  <span style={{ color: "#dc2626", marginLeft: "4px" }}>*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  placeholder="Ej: juan@email.com"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
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
                  placeholder="Ej: 987654321"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  DNI
                </label>
                <input
                  type="text"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
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
                  placeholder="Ej: 12345678"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "10px",
                  }}
                >
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value as "Activo" | "Deshabilitado" })}
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
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#3b82f6"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <option value="Activo">Activo</option>
                  <option value="Deshabilitado">Deshabilitado</option>
                </select>
              </div>
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
                Dirección
              </label>
              <textarea
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  backgroundColor: "var(--secondary)",
                  border: "2px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  transition: "all 0.2s",
                  resize: "vertical",
                }}
                placeholder="Ej: Av. Principal 123, Lima"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6"
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedCliente(null)
                  resetForm()
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--sidebar-accent)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--secondary)"
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)"
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.4)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.3)"
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
  )
}
