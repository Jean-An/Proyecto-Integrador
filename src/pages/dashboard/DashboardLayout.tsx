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
      default:
        // Placeholder for other pages
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
