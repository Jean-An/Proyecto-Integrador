import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { FaChartLine } from "react-icons/fa";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor complete todos los campos");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      setError("Ocurrió un error al iniciar sesión");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--background)",
        padding: "1rem",
      }}
    >
      <Card style={{ width: "100%", maxWidth: "400px" }}>
        <CardHeader style={{ textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(213, 64, 54, 0.1)",
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
              }}
            >
              <FaChartLine size={24} style={{ color: "var(--primary)" }} />
              <span
                style={{
                  fontWeight: "bold",
                  color: "var(--primary)",
                  fontSize: "1.25rem",
                }}
              >
                CYBERMANAGER
              </span>
            </div>
          </div>
          <CardTitle style={{ fontSize: "1.5rem" }}>Bienvenido</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <div
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  padding: "0.75rem",
                  borderRadius: "var(--radius)",
                  fontSize: "0.875rem",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} style={{ width: "100%" }}>
              {isLoading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter style={{ justifyContent: "center" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              style={{
                color: "var(--primary)",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              Regístrate aquí
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
