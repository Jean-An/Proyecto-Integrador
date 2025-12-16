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

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor complete todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const success = await register(name, email, password);
      if (success) {
        navigate("/"); // Redirect to login after successful registration
      } else {
        setError("Error al registrar usuario");
      }
    } catch (err) {
      setError("Ocurrió un error en el registro");
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
          <CardTitle style={{ fontSize: "1.5rem" }}>Crear Cuenta</CardTitle>
          <CardDescription>
            Regístrate para comenzar a usar el sistema
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
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading} style={{ width: "100%" }}>
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter style={{ justifyContent: "center" }}>
          <div style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/"
              style={{
                color: "var(--primary)",
                textDecoration: "underline",
                fontWeight: "500",
              }}
            >
              Inicia sesión aquí
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
