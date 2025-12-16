import { FaBell, FaCog, FaChevronDown } from "react-icons/fa";

interface HeaderProps {
  username: string;
}

export function Header({ username }: HeaderProps) {
  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "var(--card)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        flexShrink: 0
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "var(--foreground)",
            margin: 0
          }}
        >
          Admin Dashboard
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Notifications */}
        <button
          style={{
            position: "relative",
            padding: "8px",
            borderRadius: "var(--radius)",
            backgroundColor: "transparent",
            transition: "background-color 0.2s",
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
          <FaBell size={20} style={{ color: "var(--muted-foreground)" }} />
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "8px",
              height: "8px",
              backgroundColor: "var(--primary)",
              borderRadius: "9999px",
            }}
          />
        </button>

        {/* Settings */}
        <button
          style={{
            padding: "8px",
            borderRadius: "var(--radius)",
            backgroundColor: "transparent",
            transition: "background-color 0.2s",
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
          <FaCog size={20} style={{ color: "var(--muted-foreground)" }} />
        </button>

        {/* User Profile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingLeft: "16px",
            borderLeft: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "9999px",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              border: "2px solid rgba(213, 64, 54, 0.2)",
            }}
          >
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--foreground)",
              }}
            >
              {username || "User"}
            </span>
            <FaChevronDown
              size={16}
              style={{ color: "var(--muted-foreground)" }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
