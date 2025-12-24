import { Input } from "../ui/input";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../services/db";

export interface ProductFormData {
  nombre: string;
  descripcion: string;
  categoria: string;
  marca: string;
  stock: string;
  precio: string;
  ubicacion: string;
  estado: "Activo" | "Deshabilitado";
}

interface ProductFormProps {
  formData: ProductFormData;
  onChange: (data: ProductFormData) => void;
}

export function ProductForm({ formData, onChange }: ProductFormProps) {
  // Fetch options from DB
  const categories = useLiveQuery(() => db.categorias.toArray()) || [];
  const brands = useLiveQuery(() => db.marcas.toArray()) || [];

  const handleChange = (field: keyof ProductFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  // Shared select style to match Input
  const selectStyle = {
    flex: "1",
    height: "40px",
    width: "100%",
    padding: "0 12px",
    backgroundColor: "var(--background)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    fontSize: "0.875rem",
    color: "var(--foreground)",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      <div>
        <label className="block text-sm font-semibold mb-2">
          Nombre<span style={{ color: "#dc2626" }}>*</span>
        </label>
        <Input
          value={formData.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Marca<span style={{ color: "#dc2626" }}>*</span>
        </label>
        <select
            value={formData.marca}
            onChange={(e) => handleChange("marca", e.target.value)}
            style={selectStyle}
        >
            <option value="">Seleccione una marca</option>
            {brands.map((brand) => (
                <option key={brand.id} value={brand.nombre}>
                    {brand.nombre}
                </option>
            ))}
        </select>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <label className="block text-sm font-semibold mb-2">
          Descripción<span style={{ color: "#dc2626" }}>*</span>
        </label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => handleChange("descripcion", e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            backgroundColor: "var(--secondary)",
            border: "2px solid var(--border)",
            borderRadius: "10px",
            color: "var(--foreground)",
            fontSize: "0.9rem",
            minHeight: "80px",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Categoría<span style={{ color: "#dc2626" }}>*</span>
        </label>
        <select
            value={formData.categoria}
            onChange={(e) => handleChange("categoria", e.target.value)}
            style={selectStyle}
        >
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Ubicación<span style={{ color: "#dc2626" }}>*</span>
        </label>
        <Input
          value={formData.ubicacion}
          onChange={(e) => handleChange("ubicacion", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Stock<span style={{ color: "#dc2626" }}>*</span>
        </label>
        <Input
          type="number"
          value={formData.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Precio<span style={{ color: "#dc2626" }}>*</span>
        </label>
        <Input
          type="number"
          step="0.01"
          value={formData.precio}
          onChange={(e) => handleChange("precio", e.target.value)}
        />
      </div>
    </div>
  );
}
