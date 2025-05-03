import React from 'react';
import { Download } from 'lucide-react';

export default function SearchbarAndFilters({
  searchQuery,
  onSearch,
  filterStatus,
  onFilterStatus,
  statusOptions,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  showFilters,
  showDateFilters,
  showExportButton,
  showAddProduct,
  addProduct
}) {
  return (
    <div className="mt-3 grid sm:grid-cols-2 grid-cols-1 gap-4">
      <div className="flex items-center border w-full transition duration-300 pr-3 gap-2 bg-white border-gray-500/30 h-[46px] rounded-[5px] overflow-hidden">
        <input
          value={searchQuery}
          onChange={onSearch}
          type="text"
          placeholder="Search for anything..."
          className="w-full h-full pl-4 outline-none placeholder-gray-500 text-sm border-0"
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 30 30" fill="#6B7280">
          <path d="M13 3C7.5 3 3 7.5 3 13s4.5 10 10 10c2.4 0 4.6-.9 6.3-2.3l5.9 5.9a1 1 0 0 0 1.4-1.4l-5.9-5.9c1.4-1.7 2.3-3.9 2.3-6.3 0-5.5-4.5-10-10-10zm0 2c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8z"/>
        </svg>
      </div>
      
      <div className={`flex flex-col gap-2 sm:flex-row sm:items-center`}>
        {showFilters && (
          <select
            value={filterStatus}
            onChange={onFilterStatus}
            className={`${!showFilters && "hidden"} h-[46px] w-full pl-3 pr-2 text-sm bg-white border border-gray-300 rounded-md`}
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status, idx) => (
              <option key={idx} value={status}>{status}</option>
            ))}
          </select>
        )}

        {showDateFilters && (
          <div className={`${!showFilters && "hidden"} flex items-center h-[46px] gap-2 px-3 bg-white border border-gray-300 rounded-md`}>
            <input
              type="date"
              value={fromDate}
              onChange={onFromDateChange}
              className="h-full text-sm "
            />
            <span className="text-gray-500 font-semibold">-</span>
            <input
              type="date"
              value={toDate}
              onChange={onToDateChange}
              className="h-full text-sm"
            />
          </div>
        )}

        {showExportButton && (
          <div className={`${!showExportButton && "hidden"} flex items-center px-3 h-[46px] bg-white border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer`}>
            <Download size={20} className="mr-1" />
            <p className="text-sm">Export</p>
          </div>
        )}

        {showAddProduct && (
          <button
              onClick={addProduct}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded h-[46px] hover:bg-blue-600"
          >
              Add Product
          </button>
        )}
      </div>
    </div>
  );
}
