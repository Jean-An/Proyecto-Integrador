import {
  FaChartBar,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaTruck,
  FaChartLine,
} from "react-icons/fa";

export function WelcomeSection() {
  const stats = [
    {
      label: "Productos",
      value: "2,345",
      icon: FaBox,
      color: "var(--accent)", // Red/Pink
    },
    {
      label: "Clientes",
      value: "1,234",
      icon: FaUsers,
      color: "var(--primary)", // Red
    },
    {
      label: "Ventas Hoy",
      value: "89",
      icon: FaShoppingCart,
      color: "var(--chart-3)", // Teal
    },
    {
      label: "Entregas",
      value: "45",
      icon: FaTruck,
      color: "var(--chart-4)", // Orange
    },
  ];



  return (
    <div
      style={{
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      {/* Welcome Hero */}
      <div
        className="gradient-hero"
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "calc(var(--radius) + 4px)",
          padding: "48px",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div style={{ display: "inline-block", width: "fit-content" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                backgroundColor: "rgba(213, 64, 54, 0.1)",
                border: "1px solid rgba(213, 64, 54, 0.2)",
                borderRadius: "9999px",
                padding: "8px 24px",
              }}
            >
              <FaChartLine size={20} style={{ color: "var(--primary)" }} />
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                }}
              >
                Panel Administrativo
              </span>
            </div>
          </div>

          <h1
            style={{
              fontSize: "3.75rem",
              fontWeight: "bold",
              color: "var(--foreground)",
              lineHeight: 1.2,
              margin: 0
            }}
          >
            Bienvenido al <br />
            <span style={{ color: "var(--primary)" }}>CYBERMANAGER</span>
          </h1>

          <p
            style={{
              fontSize: "1.25rem",
              color: "var(--muted-foreground)",
              maxWidth: "672px",
            }}
          >
            Gestiona tu negocio de manera eficiente con todas las herramientas
            necesarias en un solo lugar
          </p>
        </div>

        {/* Decorative Elements */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "288px",
            height: "288px",
            backgroundColor: "rgba(213, 64, 54, 0.1)",
            borderRadius: "9999px",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "384px",
            height: "384px",
            backgroundColor: "rgba(229, 62, 150, 0.1)",
            borderRadius: "9999px",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-panel"
              style={{
                padding: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "var(--radius)",
                transition: "all 0.3s",
                cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(213, 64, 54, 0.3)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 15px -3px rgba(213, 64, 54, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.5)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "var(--muted-foreground)",
                      margin: 0
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    style={{
                      fontSize: "1.875rem",
                      fontWeight: "bold",
                      color: "var(--foreground)",
                      margin: 0
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className="stat-icon"
                  style={{
                    padding: "12px",
                    borderRadius: "var(--radius)",
                    backgroundColor: "rgba(0,0,0,0.03)", // Light bg for icon
                    transition: "transform 0.3s",
                  }}
                >
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.875rem",
                }}
              >
                <FaChartBar size={16} style={{ color: "var(--chart-3)" }} />
                <span
                  style={{
                    color: "var(--chart-3)",
                    fontWeight: 500,
                  }}
                >
                  +12%
                </span>
                <span style={{ color: "var(--muted-foreground)" }}>
                  vs mes anterior
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            padding: "24px",
            background:
              "linear-gradient(135deg, rgba(213, 64, 54, 0.05) 0%, rgba(213, 64, 54, 0.01) 100%)",
            border: "1px solid rgba(213, 64, 54, 0.1)",
            borderRadius: "var(--radius)",
            transition: "all 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 10px 15px -3px rgba(213, 64, 54, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(213, 64, 54, 0.1)",
                borderRadius: "var(--radius)",
                width: "fit-content",
              }}
            >
              <FaBox size={24} style={{ color: "var(--primary)" }} />
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--foreground)",
                margin: 0
              }}
            >
              Gestión de Productos
            </h3>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.875rem",
                margin: 0
              }}
            >
              Administra tu inventario y catálogo de productos
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div
          style={{
            padding: "24px",
            background:
              "linear-gradient(135deg, rgba(229, 62, 150, 0.05) 0%, rgba(229, 62, 150, 0.01) 100%)",
            border: "1px solid rgba(229, 62, 150, 0.1)",
            borderRadius: "var(--radius)",
            transition: "all 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 10px 15px -3px rgba(229, 62, 150, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(229, 62, 150, 0.1)",
                borderRadius: "var(--radius)",
                width: "fit-content",
              }}
            >
              <FaUsers size={24} style={{ color: "var(--accent)" }} />
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--foreground)",
                margin: 0
              }}
            >
              Control de Clientes
            </h3>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.875rem",
                 margin: 0
              }}
            >
              Visualiza y gestiona tu base de clientes
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div
          style={{
            padding: "24px",
            background:
              "linear-gradient(135deg, rgba(46, 184, 138, 0.05) 0%, rgba(46, 184, 138, 0.01) 100%)",
            border: "1px solid rgba(46, 184, 138, 0.1)",
            borderRadius: "var(--radius)",
            transition: "all 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 10px 15px -3px rgba(46, 184, 138, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(46, 184, 138, 0.1)",
                borderRadius: "var(--radius)",
                width: "fit-content",
              }}
            >
              <FaTruck size={24} style={{ color: "var(--chart-3)" }} />
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--foreground)",
                margin: 0
              }}
            >
              Logística
            </h3>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: "0.875rem",
                 margin: 0
              }}
            >
              Controla guías y entregas en tiempo real
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
