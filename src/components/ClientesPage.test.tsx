import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ClientesPage } from "../components/clientes";
import { db } from "../db";

// Mock Dexie
vi.mock("../db", () => {
    return {
        db: {
            clientes: {
                toArray: vi.fn(),
                add: vi.fn(),
                update: vi.fn(),
            },
        },
    };
});

// Mock dexie-react-hooks
vi.mock("dexie-react-hooks", () => ({
    useLiveQuery: (fn: any) => fn(),
}));

describe("ClientesPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the clients page title", () => {
        (db.clientes.toArray as any).mockReturnValue([]);
        render(<ClientesPage />);
        expect(screen.getByText("Clientes")).toBeInTheDocument();
        expect(screen.getByText("Administra la información de tus clientes")).toBeInTheDocument();
    });

    it("shows create modal when clicking New Client button", () => {
        (db.clientes.toArray as any).mockReturnValue([]);
        render(<ClientesPage />);
        
        fireEvent.click(screen.getByText("Nuevo Cliente"));
        
        expect(screen.getByText("Nuevo Cliente", { selector: "h3" })).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Ej: Juan")).toBeInTheDocument();
    });

    it("renders client list from Dexie", () => {
        const mockClients = [
            { id: 1, nombre: "Juan", apellido: "Perez", email: "juan@test.com", estado: "Activo" },
            { id: 2, nombre: "Maria", apellido: "Gomez", email: "maria@test.com", estado: "Deshabilitado" }
        ];
        (db.clientes.toArray as any).mockReturnValue(mockClients);

        render(<ClientesPage />);

        expect(screen.getByText("Juan Perez")).toBeInTheDocument();
        expect(screen.getByText("Maria Gomez")).toBeInTheDocument();
        expect(screen.getByText("juan@test.com")).toBeInTheDocument();
        expect(screen.getByText("maria@test.com")).toBeInTheDocument();
    });

    it("toggles client status when clicking the badge", async () => {
        const mockClient = { id: 1, nombre: "Juan", apellido: "Perez", email: "juan@test.com", estado: "Activo" };
        (db.clientes.toArray as any).mockReturnValue([mockClient]);

        render(<ClientesPage />);

        const statusBadge = screen.getByText("Activo");
        fireEvent.click(statusBadge);

        await waitFor(() => {
            expect(db.clientes.update).toHaveBeenCalledWith(1, { estado: "Deshabilitado" });
        });
    });
});
