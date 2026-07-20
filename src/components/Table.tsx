import React from 'react';

export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

/**
 * [THANH - MODULE 8 UI COMPONENT]: Component Table dùng chung hiển thị danh sách chứng chỉ, thống kê, lịch sử
 */
export default function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'Không có dữ liệu nào để hiển thị.',
  onRowClick,
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-[#c3c6d1] rounded-xl p-8 text-center text-[#505f76] text-sm flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-[#001e40] border-t-transparent rounded-full animate-spin"></div>
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white border border-[#c3c6d1] rounded-xl p-10 text-center text-[#505f76] text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-[#c3c6d1] rounded-xl bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f9f9fe] border-b border-[#c3c6d1] text-[11px] font-bold text-[#001e40] uppercase tracking-wider">
            {columns.map((col, idx) => (
              <th key={col.header || idx} className={`py-3.5 px-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0f1f5] text-xs font-sans text-[#1a1c1f]">
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item, index)}
              onClick={() => onRowClick && onRowClick(item)}
              className={`hover:bg-[#f9f9fe] transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col, colIdx) => (
                <td key={`${keyExtractor(item, index)}-col-${colIdx}`} className={`py-3.5 px-4 ${col.className || ''}`}>
                  {col.render
                    ? col.render(item, index)
                    : (item as any)[col.key] !== undefined
                    ? String((item as any)[col.key])
                    : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
