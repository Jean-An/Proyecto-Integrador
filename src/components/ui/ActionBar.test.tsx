import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActionBar } from './ActionBar';

describe('ActionBar', () => {
  it('renders title and placeholder', () => {
    render(
      <ActionBar
        title="Test Title"
        searchVal=""
        setSearchVal={() => {}}
        placeholder="Search here..."
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search here...')).toBeInTheDocument();
  });

  it('calls setSearchVal on input change', () => {
    const handleSearchVal = vi.fn();
    render(
      <ActionBar
        title="Test Title"
        searchVal=""
        setSearchVal={handleSearchVal}
      />
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(handleSearchVal).toHaveBeenCalledWith('New Value');
  });

  it('calls onSearch when search button is clicked', () => {
    const handleSearch = vi.fn();
    render(
      <ActionBar
        title="Test Title"
        searchVal=""
        setSearchVal={() => {}}
        onSearch={handleSearch}
      />
    );
    const button = screen.getByText('Buscar');
    fireEvent.click(button);
    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  it('renders filter dropdown when options are provided', () => {
    const handleFilterChange = vi.fn();
    const options = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ];

    render(
      <ActionBar
        title="Test Title"
        searchVal=""
        setSearchVal={() => {}}
        filterOptions={options}
        currentFilter="opt1"
        onFilterChange={handleFilterChange}
      />
    );

    // Title should NOT be present (replaced by dropdown)
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    
    // Dropdown should be present
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('opt1');

    fireEvent.change(select, { target: { value: 'opt2' } });
    expect(handleFilterChange).toHaveBeenCalledWith('opt2');
  });

  it('renders standard title if not enough filter options', () => {
     render(
      <ActionBar
        title="Test Title"
        searchVal=""
        setSearchVal={() => {}}
        filterOptions={[{ label: 'Only One', value: '1' }]} // Only 1 option
        currentFilter="1"
        onFilterChange={() => {}}
      />
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
});
