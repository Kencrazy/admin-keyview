import React,{useState} from "react";
import {topProducts} from "@/constants"
import { Star,PencilLine,Trash } from "lucide-react";
import SearchbarAndFilters from "../../components/filter";
export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredProducts = topProducts.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });
  
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleAddProduct = () => {
    console.log("Add Product button clicked");
  };

  return (
    <div>
        <h1 className="title">Products</h1>  
        <SearchbarAndFilters showSearchBar={true} searchQuery={searchQuery} onSearch={(e)=>{
            setSearchQuery(e.target.value)
            setCurrentPage(1)
        }} showFilters={false} showDateFilters={false} showExportButton={false} showAddProduct={true} addProduct={handleAddProduct}/>
        <div className="card mt-4">
            <div className="card-body p-0">
                <div className="relative h-fit w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                    <table className="table">
                        <thead className="table-header">
                            <tr className="table-row">
                                <th className="table-head">Product</th>
                                <th className="table-head">Price</th>
                                <th className="table-head">Status</th>
                                <th className="table-head">Rating</th>
                                <th className="table-head">Action</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {visibleProducts.map((product) => (
                                <tr
                                    key={product.number}
                                    className="table-row"
                                >
                                    <td className="table-cell">
                                        <div className="flex w-max gap-x-4">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="size-14 rounded-lg object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <p>{product.name}</p>
                                                <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="table-cell">${product.price}</td>
                                    <td className="table-cell">{product.status}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-x-2">
                                            <Star
                                                size={18}
                                                className="fill-yellow-600 stroke-yellow-600"
                                            />
                                            {product.rating}
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-x-4">
                                            <button className="text-blue-500 dark:text-blue-600">
                                                <PencilLine size={20} />
                                            </button>
                                            <button className="text-red-500">
                                                <Trash size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="flex justify-between items-center mt-4">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
            >
                Previous
            </button>
            <p className="text-sm">
                Page {currentPage} of {totalPages}
            </p>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    </div>
  );
}