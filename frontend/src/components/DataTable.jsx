import { ChevronUp, ChevronDown } from "lucide-react";

export default function DataTable({
  columns = [],
  rows = [],
  sortBy,
  sortDir,
  onSort,
  emptyText = "No data",
}) {
  const isEmpty = !Array.isArray(rows) || rows.length === 0;

  return (
    <div className="card p-4">
      <div className="overflow-x-auto">
        <table className="ss-table">
          <thead>
            <tr>
              {columns.map((c) => {
                const active = sortBy === c.key;
                const sortable = !!c.sortable;
                return (
                  <th key={c.key} className="ss-th">
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort?.(c.key)}
                        className="inline-flex items-center gap-2 hover:opacity-90"
                      >
                        <span>{c.label}</span>
                        {active ? (
                          sortDir === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <span className="opacity-50">
                            <ChevronUp size={14} />
                          </span>
                        )}
                      </button>
                    ) : (
                      <span>{c.label}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="ss-td text-white/60"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr
                  key={r?.id ?? idx}
                  className="transition hover:bg-white/4"
                >
                  {columns.map((c) => (
                    <td key={c.key} className="ss-td align-top">
                      {c.render ? c.render(r) : String(r?.[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
