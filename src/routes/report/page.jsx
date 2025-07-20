import React, { useState } from 'react';
import SearchbarAndFilters from '../../components/filter';
import { updateData } from '../../service/updateFirebase';

export default function ReportPage({ orderData }) {
  const itemsPerPage = 20;
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [orders, setOrders] = useState(orderData);

  const statusOptions = Array.from(new Set(orders.map(o => o.status)));
  const statusCycle = ['Delivered', 'On delivery', 'Cancelled'];

  const handleStatusChange = async (orderId) => {
    const currentOrder = orders.find(order => order.orderId === orderId);
    if (!currentOrder) {
      console.error('Order not found:', orderId);
      return;
    }

    const currentIndex = statusCycle.indexOf(currentOrder.status);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    const previousOrders = [...orders];
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderId === orderId ? { ...order, status: nextStatus } : order
      )
    );

    try {
      await updateData('orders', { status: nextStatus }, orderId);
    } catch (error) {
      console.error('Failed to update status in Firebase:', error);
      setOrders(previousOrders);
      alert('Failed to update order status. Please try again.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      order.orderId.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.products.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query) ||
      order.address.toLowerCase().includes(query) ||
      order.phoneNumber.toLowerCase().includes(query);
  
    const matchStatus = filterStatus ? order.status === filterStatus : true;
  
    const orderDate = new Date(order.orderedDate).toISOString().split('T')[0]; 
    const matchFromDate = fromDate ? orderDate >= fromDate : true;
    const matchToDate = toDate ? orderDate <= toDate : true;
  
    return matchSearch && matchStatus && matchFromDate && matchToDate;
  });  

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const currentPageOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const goToPreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="p-4">
      <h1 className="title">Reports</h1>
      <SearchbarAndFilters
        showSearchBar={true}
        searchQuery={searchQuery}
        onSearch={e => {
          setSearchQuery(e.target.value);
          setPage(0);
        }}
        filterStatus={filterStatus}
        onFilterStatus={e => {
          setFilterStatus(e.target.value);
          setPage(0);
        }}
        showFilters={true}
        statusOptions={statusOptions}
        fromDate={fromDate}
        toDate={toDate}
        showDateFilters={true}
        onFromDateChange={e => {
          setFromDate(e.target.value);
          setPage(0);
        }}
        onToDateChange={e => {
          setToDate(e.target.value);
          setPage(0);
        }}
        showExportButton={true}
      />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100 dark:bg-slate-700 font-semibold">
            <tr>
              <th className="border px-3 py-2 text-black dark:text-white">Order ID</th>
              <th className="border px-3 py-2 text-black dark:text-white">Customer Name</th>
              <th className="border px-3 py-2 text-black dark:text-white">Products</th>
              <th className="border px-3 py-2 text-black dark:text-white">Quantity</th>
              <th className="border px-3 py-2 text-black dark:text-white">Price Each</th>
              <th className="border px-3 py-2 text-black dark:text-white">Status</th>
              <th className="border px-3 py-2 text-black dark:text-white">Ordered Date</th>
              <th className="border px-3 py-2 text-black dark:text-white">Address</th>
              <th className="border px-3 py-2 text-black dark:text-white">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {currentPageOrders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50 text-dark-700 dark:text-gray-300">
                <td className="border px-3 py-2">{order.orderId}</td>
                <td className="border px-3 py-2">{order.customerName}</td>
                <td className="border px-3 py-2">{order.products}</td>
                <td className="border px-3 py-2">{order.quantityOrdered}</td>
                <td className="border px-3 py-2">${order.priceEach.toFixed(2)}</td>
                <td 
                  className="border px-3 py-2 cursor-pointer hover:text-blue-500" 
                  onClick={() => handleStatusChange(order.orderId)}
                >
                  {order.status}
                </td>
                <td className="border px-3 py-2">
                  {new Date(order.orderedDate).toLocaleString()}
                </td>
                <td className="border px-3 py-2">{order.address}</td>
                <td className="border px-3 py-2">{order.phoneNumber}</td>
              </tr>
            ))}
            {currentPageOrders.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={page === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={page >= totalPages - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}