
import { 
  FaHome,
  FaTags,
  FaTh,
  FaBox,
  FaTruck,
  FaUsers,
  FaUserTie,
  FaFileInvoice,
  FaFileImport,
  FaFileExport,
  FaSignOutAlt 
} from "react-icons/fa"
// import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

export function Sidebar({ activePage, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "inicio", label: "Inicio", icon: FaHome },
    { id: "brands", label: "Marcas", icon: FaTags },
    { id: "categorias", label: "Categorías", icon: FaTh },
    { id: "productos", label: "Productos", icon: FaBox },
    { id: "proveedores", label: "Proveedores", icon: FaTruck },
    { id: "transporters", label: "Transportistas", icon: FaTruck },
    { id: "clientes", label: "Clientes", icon: FaUsers },
    { id: "employees", label: "Empleados", icon: FaUserTie },
    { id: "guides", label: "Guías", icon: FaFileInvoice },
    { id: "guide-details", label: "Detalles de Guía", icon: FaFileInvoice },
    { id: "entry-guides", label: "Guías de Ingreso", icon: FaFileImport },
    { id: "exit-guides", label: "Guías de Salida", icon: FaFileExport },
  ];

  return (
    <aside
      style={{
        width: "256px",
        backgroundColor: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh", // Specific fix for layout
        flexShrink: 0
      }}
    >
      {/* Logo Header */}
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                letterSpacing: "0.05em",
                color: "var(--primary)",
                margin: 0
              }}
            >
              CYBERMANAGER
            </h1>
            <div
              style={{
                height: "4px",
                width: "64px",
                backgroundColor: "var(--primary)",
                margin: "8px auto 0",
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "var(--radius)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  transition: "all 0.2s",
                  backgroundColor: isActive
                    ? "rgba(229, 62, 150, 0.2)"
                    : "transparent",
                  color: isActive
                    ? "var(--accent)"
                    : "rgba(250, 250, 250, 0.7)",
                  border: isActive
                    ? "1px solid rgba(229, 62, 150, 0.3)"
                    : "1px solid transparent",
                  boxShadow: isActive
                    ? "0 10px 15px -3px rgba(229, 62, 150, 0.1)"
                    : "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      "var(--sidebar-accent)";
                    e.currentTarget.style.color = "var(--sidebar-foreground)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "rgba(250, 250, 250, 0.7)";
                  }
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid var(--sidebar-border)",
        }}
      >
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 16px",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            borderRadius: "var(--radius)",
            fontWeight: 600,
            transition: "background-color 0.2s",
            boxShadow: "0 10px 15px -3px rgba(213, 64, 54, 0.2)",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(213, 64, 54, 0.9)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary)";
          }}
        >
          <FaSignOutAlt size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
