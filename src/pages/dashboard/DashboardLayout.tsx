import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "../../components/layout/Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  // Determine active page based on current path
  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes("/dashboard/clients")) return "clientes";
    if (path.includes("/dashboard/products")) return "productos";
    if (path.includes("/dashboard/categories")) return "categorias";
    if (path.includes("/dashboard/brands")) return "brands";
    if (path.includes("/dashboard/providers")) return "proveedores";
    if (path.includes("/dashboard/transporters")) return "transporters";
    if (path.includes("/dashboard/employees")) return "employees";
    if (path.includes("/dashboard/guide-details")) return "guide-details";
    if (path.includes("/dashboard/entry-guides")) return "entry-guides";
    if (path.includes("/dashboard/exit-guides")) return "exit-guides";
    if (path.includes("/dashboard/guides")) return "guides";
    if (path === "/dashboard") return "inicio";
    return "";
  };

  const handleNavigate = (pageId: string) => {
    switch (pageId) {
      case "inicio":
        navigate("/dashboard");
        break;
      case "clientes":
        navigate("/dashboard/clients");
        break;
      case "productos":
        navigate("/dashboard/products");
        break;
      case "categorias":
        navigate("/dashboard/categories");
        break;
      case "brands":
        navigate("/dashboard/brands");
        break;
      case "proveedores":
        navigate("/dashboard/providers");
        break;
      case "transporters":
        navigate("/dashboard/transporters");
        break;
      case "employees":
        navigate("/dashboard/employees");
        break;
      case "guides":
        navigate("/dashboard/guides");
        break;
      case "guide-details":
        navigate("/dashboard/guide-details");
        break;
      case "entry-guides":
        navigate("/dashboard/entry-guides");
        break;
      case "exit-guides":
        navigate("/dashboard/exit-guides");
        break;
      default:
        console.log("Navigating to", pageId);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "var(--background)" }}>
      <Sidebar 
        activePage={getActivePage()} 
        onNavigate={handleNavigate}
        onLogout={() => {
          logout();
          navigate("/");
        }}
      />
      <main style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        <Outlet />
      </main>
    </div>
  );
}
