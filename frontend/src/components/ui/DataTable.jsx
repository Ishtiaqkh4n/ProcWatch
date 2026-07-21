export function DataTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-700">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left py-2 px-3 text-gray-400 font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-900/50" : ""}>
              {row.map((cell, j) => (
                <td key={j} className="py-2 px-3 text-gray-200">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
