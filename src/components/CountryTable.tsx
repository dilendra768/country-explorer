import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import type { Country } from '../api';

const col = createColumnHelper<Country>();

const columns = [
  col.accessor('flag', {
    header: 'Flag',
    enableSorting: false,
    cell: (c) => <img src={c.getValue()} alt={`Flag of ${c.row.original.name}`} className="h-6 w-9 rounded-sm object-cover" loading="lazy" />,
  }),
  col.accessor('name', {
    header: 'Country Name',
    cell: (c) => (
      <Link to={`/countries/${c.row.original.code}`} className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
        {c.getValue()}
      </Link>
    ),
  }),
  col.accessor('region', { header: 'Region', enableSorting: false }),
  col.accessor('population', {
    header: 'Population',
    cell: (c) => c.getValue().toLocaleString('en-US'),
  }),
];

export default function CountryTable({ data }: { data: Country[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div>
      <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className={`px-3 py-2 ${h.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{ asc: ' ▲', desc: ' ▼' }[h.column.getIsSorted() as string] ?? ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-200 dark:border-slate-700">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)} · {data.length} countries
        </span>
        <div className="flex gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded border px-3 py-1 disabled:opacity-40">Previous</button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded border px-3 py-1 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
