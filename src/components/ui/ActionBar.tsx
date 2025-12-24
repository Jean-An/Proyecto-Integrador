
import type { ReactNode } from "react";
import { FaSearch, FaList } from "react-icons/fa";

interface ActionBarProps {
  searchVal: string;
  setSearchVal: (val: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  placeholder?: string;
  children?: ReactNode;
  title: string;
  filterOptions?: { label: string; value: string }[];
  currentFilter?: string;
  onFilterChange?: (value: string) => void;
}

export function ActionBar({ 
  searchVal, 
  setSearchVal, 
  onSearch, 
  onClear, 
  placeholder = "Buscar...", 
  children,
  title,
  filterOptions,
  currentFilter,
  onFilterChange
}: ActionBarProps) {
  return (
    <div className="action-bar">
      <div className="action-bar-title">
        <div className="icon-wrapper">
          <FaSearch size={22} style={{ color: "#3b82f6" }} />
        </div>
        {filterOptions && filterOptions.length > 1 && onFilterChange ? (
          <select
            value={currentFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "var(--radius)",
              border: "2px solid transparent",
              backgroundColor: "transparent",
              color: "var(--foreground)",
              fontSize: "1.2rem",
              fontWeight: 600,
              cursor: "pointer",
              outline: "none",
              transition: "all 0.2s",
              appearance: "auto",
              backgroundImage: "none"
            }}
            onMouseEnter={(e) => {
               (e.target as HTMLElement).style.backgroundColor = "var(--secondary)";
            }}
            onMouseLeave={(e) => {
               (e.target as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <h3>{title}</h3>
        )}
      </div>
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <FaSearch size={18} className="search-icon" />
        </div>
        {onSearch && (
          <button className="btn-secondary-action" onClick={onSearch}>
            Buscar
          </button>
        )}
        {onClear && (
          <button className="btn-outline-action" onClick={onClear}>
            <FaList size={18} />
            Ver Todos
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
