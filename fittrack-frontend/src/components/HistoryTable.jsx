function HistoryTable({ columns, rows, renderActions }) {
  return (
    <div className="history-table-wrap">
      <table className="history-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.label}>{column.label}</th>
            ))}
            <th className="history-th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => {
                const content = column.render(row);
                const classes = [
                  column.title ? 'history-cell-title' : '',
                  content === '—' ? 'history-cell-empty' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <td
                    key={column.label}
                    data-label={column.label}
                    className={classes || undefined}
                  >
                    {content}
                  </td>
                );
              })}
              <td data-label="Actions">{renderActions(row)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryTable;