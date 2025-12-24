import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { FaInbox } from "react-icons/fa";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
  className?: string; // Add className optional property
}

interface DataTableProps<T> {
  data: T[] | undefined | null;
  columns: Column<T>[];
  searchKey?: keyof T; // For future search implementation if needed generic
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
}: DataTableProps<T>) {
  
  // Conditional Rendering: If no data, show empty state or nothing?
  // User asked: "only show when there is data inside, otherwise no"
  // Interpret "otherwise no" as "don't show the table at all" OR "show an empty state".
  // Usually "don't show table headers with empty body" is preferred.
  // I will conditionally render the ENTIRE table container only if data length > 0.
  
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <div style={{ 
          padding: "24px", 
          backgroundColor: "rgba(0,0,0,0.03)", 
          borderRadius: "50%",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <FaInbox size={48} style={{ color: "var(--muted-foreground)", opacity: 0.5 }} />
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)" }}>
          No hay registros disponibles
        </h3>
        <p style={{ fontSize: "0.9rem" }}>
          Agrega nuevos elementos para visualizarlos aquí.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, index) => (
            <TableHead 
              key={index} 
              style={{ textAlign: col.align || "left", width: col.width }}
              className={col.className}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, rowIndex) => (
          <TableRow key={item.id || rowIndex}>
            {columns.map((col, colIndex) => (
              <TableCell 
                key={colIndex} 
                style={{ textAlign: col.align || "left" }}
                className={col.accessorKey === 'id' ? 'table-cell-muted font-mono' : ''}
              >
                {col.cell ? col.cell(item) : (col.accessorKey ? String(item[col.accessorKey]) : null)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
