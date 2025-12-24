import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataTable } from './data-table';

describe('DataTable', () => {
  const columns = [
    { header: 'ID', accessorKey: 'id' as const },
    { header: 'Name', accessorKey: 'name' as const },
  ];

  const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];

  it('renders empty state when data is empty or null', () => {
    const { rerender } = render(<DataTable columns={columns} data={[]} />);
    expect(screen.getByText('No hay registros disponibles')).toBeInTheDocument();

    rerender(<DataTable columns={columns} data={null} />);
    expect(screen.getByText('No hay registros disponibles')).toBeInTheDocument();
  });

  it('renders table headers and rows when data is present', () => {
    render(<DataTable columns={columns} data={data} />);
    
    // Check headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();

    // Check data
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders custom cell content', () => {
    const customColumns = [
      { 
        header: 'Custom', 
        cell: (item: { id: number; name: string }) => <span data-testid="custom-cell">{item.name.toUpperCase()}</span> 
      }
    ];
    render(<DataTable columns={customColumns} data={[{ id: 1, name: 'test' }]} />);
    
    expect(screen.getByTestId('custom-cell')).toHaveTextContent('TEST');
  });
});
