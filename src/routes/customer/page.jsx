import React, { useState } from 'react';
import { recentOrders } from '../../constants';
import SearchbarAndFilters from '../../components/filter';

export default function Customer() {
  const customerMap = {};
  const [searchQuery, setSearchQuery] = useState('');

  for (const order of recentOrders) {
    const name = order.customerName;
    if (!customerMap[name]) {
      customerMap[name] = {
        name,
        addresses: new Set(),
        phoneNumbers: new Set(),
      };
    }

    const addresses = Array.isArray(order.address) ? order.address : [order.address];
    const phoneNumbers = Array.isArray(order.phoneNumber) ? order.phoneNumber : [order.phoneNumber];

    addresses.forEach(addr => customerMap[name].addresses.add(addr));
    phoneNumbers.forEach(phone => customerMap[name].phoneNumbers.add(phone));
  }

  const sortedCustomers = Object.values(customerMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const filteredCustomers = sortedCustomers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = customer.name.toLowerCase().includes(query);
    const addressMatch = Array.from(customer.addresses)
    .some(addr => addr.toLowerCase().includes(query));
    const phoneMatch = Array.from(customer.phoneNumbers)
    .some(phone => phone.toLowerCase().includes(query));
    return nameMatch || addressMatch || phoneMatch;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  

  return (
    <div className="">
      <h2 className="title">Customer</h2>
      <SearchbarAndFilters searchQuery={searchQuery} onSearch={(e)=>{
        setSearchQuery(e.target.value)
        setCurrentPage(1)
        }} showFilters={false} showDateFilters={false} showExportButton={false} />
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100 dark:bg-slate-700 font-semibold text-black dark:text-white">
            <tr>
              <th className="border px-3 py-2">Customer Name</th>
              <th className="border px-3 py-2">Address(es)</th>
              <th className="border px-3 py-2">Phone Number(s)</th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.map((customer, idx) => (
              <tr key={idx} className="hover:bg-gray-50 text-dark-700 dark:text-gray-300">
                <td className="border px-3 py-2">{customer.name}</td>
                <td className="border px-3 py-2">
                  {Array.from(customer.addresses).join(', ')}
                </td>
                <td className="border px-3 py-2">
                  {Array.from(customer.phoneNumbers).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
