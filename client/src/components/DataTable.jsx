export default function DataTable({ columns, rows, rowKey, onRowClick, emptyMessage = 'No records found.' }) {
  if (!rows || rows.length === 0) {
    return <p className="text-sm text-ink-500 text-center py-10">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line">
            {columns.map((col) => (
              <th key={col.key} className="text-left font-medium text-ink-500 px-4 py-3 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-line last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-navy-50/50' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
