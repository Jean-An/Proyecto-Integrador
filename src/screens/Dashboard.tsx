import { useState } from "react";
import { Sidebar } from "../components/sidebar";
import { Header } from "../components/header";
import { WelcomeSection } from "../components/welcome-section";
import { ProductosPage } from "../components/productos-page";
import { ClientesPage } from "../components/clientes";
import { CategoriasPage } from "../components/categorias-page";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("inicio");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activePage) {
      case "productos":
        return <ProductosPage />;
      case "categorias":
        return <CategoriasPage />;
      case "clientes":
        return <ClientesPage />;
      default:
        return <WelcomeSection activePage={activePage} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--background)",
        width: "100vw"
      }}
    >
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={handleLogout}
      />
      
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Header username={user?.name || "Admin"} />
        
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "var(--background)",
            padding: "24px"
          }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
