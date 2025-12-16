import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./screens/Login"; // Login component
import Register from "./screens/Register"; // Register component
import Dashboard from "./screens/Dashboard"; // Dashboard component
import "./App.css";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {" "}
          {/* Usamos Routes en vez de Switch */}
          <Route path="/" element={<Login />} /> {/* Ruta para Login */}
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
