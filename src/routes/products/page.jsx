import React, { useState, useEffect } from "react";
import { Star, PencilLine, Trash } from "lucide-react";
import SearchbarAndFilters from "../../components/filter";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "@/hooks/use-theme";
import striptags from "striptags";
import { updateData, updateImageToFirebase } from "../../service/updateFirebase";
import cleanQuillHtml from "../../utils/cleanQuillHtml";
import { storage } from "../../service/firebaseConfig";

export default function ProductsPage({ productData, setProductData, metaData, setMetaData }) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    newType: "",
    image: null,
    price: "",
    shippingInfo: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageUrls, setImageUrls] = useState({}); // New state to store preloaded image URLs
  const itemsPerPage = 20;

  // Initialize productTypes, ensuring "Other" is added only if not already present
  const [productTypes, setProductTypes] = useState(
    metaData?.productTypes
      ? [...new Set([...metaData.productTypes, "Other"])]
      : ["Other"]
  );

  // Quill modules for toolbar
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  // Preload image URLs when productData changes
  useEffect(() => {
    const preloadImages = async () => {
      const urls = {};
      for (const product of productData) {
        try {
          // Since product.image is already a download URL, verify it by attempting to load it
          const img = new Image();
          img.src = product.image;
          await new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`Failed to load image for ${product.name}`));
          });
          urls[product.number] = product.image; // Store valid URL
        } catch (error) {
          console.error(`Error preloading image for ${product.name}:`, error);
          urls[product.number] = "/fallback-image.jpg"; // Fallback image
        }
      }
      setImageUrls(urls);
    };
    preloadImages();
  }, [productData]);

  // Save productTypes when page is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isChanged && document.visibilityState === "hidden") {
        updateData("", { productTypes }, "");
        setIsChanged(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [productTypes, isChanged]);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description || striptags(formData.description).trim() === "") {
      newErrors.description = "Description is required";
    }
    if (!formData.type) newErrors.type = "Type is required";
    if (formData.type === "Other" && !formData.newType.trim()) {
      newErrors.newType = "New type is required";
    }
    if (!formData.image) newErrors.image = "Image is required";
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (!formData.shippingInfo.trim()) {
      newErrors.shippingInfo = "Shipping information is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  // Filter products
  const filteredProducts = productData.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Quill description change
  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  // Handle image upload
  const handleImageChange = (eJonChange) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const today = Date.now();

    // Add new type only if it doesn't already exist
    if (formData.type === "Other" && formData.newType.trim()) {
      const newType = formData.newType.trim();
      if (!productTypes.includes(newType)) {
        setIsChanged(true);
        setProductTypes((prevTypes) => [
          ...prevTypes.filter((t) => t !== "Other"),
          newType,
          "Other",
        ]);
        setMetaData((prevMetaData) => ({
          ...prevMetaData,
          productTypes: [
            ...prevMetaData.productTypes.filter((t) => t !== "Other"),
            newType,
            "Other",
          ],
        }));
      }
    }

    // Upload image using updated function (handles both File and base64)
    const imageUrl = await updateImageToFirebase(
      formData.image || imagePreview, // Prefer File, fall back to base64
      today.toString(),
      "products",
      today.toString()
    );

    if (!imageUrl) {
      console.error("Failed to upload image");
      return;
    }

    const newProduct = {
      name: formData.name,
      description: formData.description,
      type: formData.type === "Other" ? formData.newType : formData.type,
      image: imageUrl,
      price: parseFloat(formData.price),
      status: "In Stock",
      rating: 0,
      createdAt: today.toString(),
      number: productData.length ? Math.max(...productData.map(p => p.number)) + 1 : 1, // Ensure unique product.number
    };

    setProductData([...productData, newProduct]);

    await updateData("products", newProduct, today.toString());

    setFormData({
      name: "",
      description: "",
      type: "",
      newType: "",
      image: null,
      price: "",
      shippingInfo: "",
    });
    setImagePreview(null);
    setErrors({});
    setIsModalOpen(false);
  };

  const handleAddProduct = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      description: "",
      type: "",
      newType: "",
      image: null,
      price: "",
      shippingInfo: "",
    });
    setImagePreview(null);
    setErrors({});
  };

  // Compute form validity for Save button
  const isFormValid =
    formData.name.trim() &&
    striptags(formData.description).trim() &&
    formData.type &&
    (formData.type !== "Other" || formData.newType.trim()) &&
    (formData.image || imagePreview) &&
    parseFloat(formData.price) > 0 &&
    formData.shippingInfo.trim();

  return (
    <div>
      <h1 className="title">Products</h1>
      <SearchbarAndFilters
        showSearchBar={true}
        searchQuery={searchQuery}
        onSearch={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
        showFilters={false}
        showDateFilters={false}
        showExportButton={false}
        showAddProduct={true}
        addProduct={handleAddProduct}
      />
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
                  <tr key={product.number} className="table-row">
                    <td className="table-cell">
                      <div className="flex w-max gap-x-4">
                        <img
                          src={imageUrls[product.number] || "/fallback-image.jpg"}
                          alt={product.name}
                          className="size-14 rounded-lg object-cover"
                          onError={(e) => {
                            console.error(`Failed to load image for ${product.name}: ${product.image}`);
                            e.target.src = "/fallback-image.jpg";
                          }}
                        />
                        <div className="flex flex-col">
                          <p>{product.name}</p>
                          <p
                            className="font-normal text-slate-600 dark:text-slate-400"
                            dangerouslySetInnerHTML={{ __html: cleanQuillHtml(product.description) }}
                          ></p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{product.price}</td>
                    <td className="table-cell">{product.status}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-2">
                        <Star size={18} className="fill-yellow-600 stroke-yellow-600" />
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300">
          <div
            className={`relative bg-white dark:bg-slate-900 p-6 rounded-xl shadow-2xl max-w-7xl w-[90%] transform transition-transform duration-300 ${
              isModalOpen ? "scale-100" : "scale-0"
            }`}
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-700 dark:to-cyan-700 p-4 rounded-t-xl -m-6 mb-4">
              <h2 className="text-xl font-bold text-white">Add New Product</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                      errors.name ? "border-red-500 dark:border-red-500" : ""
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                      errors.price ? "border-red-500 dark:border-red-500" : ""
                    }`}
                    step="0.01"
                    min="0"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
                <ReactQuill
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={quillModules}
                  theme="snow"
                  className={`bg-white dark:bg-slate-800 text-slate-900 dark:text-white [&_.ql-toolbar]:bg-slate-100  [&_.ql-container]:border-slate-300 dark:[&_.ql-container]:border-slate-600 [&_.ql-editor]:min-h-[100px] ${
                    errors.description ? "[&_.ql-container]:border-red-500 dark:[&_.ql-container]:border-red-500" : ""
                  }`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                      errors.type ? "border-red-500 dark:border-red-500" : ""
                    }`}
                  >
                    <option value="">Select a type</option>
                    {productTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                  {formData.type === "Other" && (
                    <div className="mt-2">
                      <input
                        type="text"
                        name="newType"
                        value={formData.newType}
                        onChange={handleInputChange}
                        placeholder="Enter new type"
                        className={`w-full p-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                          errors.newType ? "border-red-500 dark:border-red-500" : ""
                        }`}
                      />
                      {errors.newType && <p className="text-red-500 text-xs mt-1">{errors.newType}</p>}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Shipping Information</label>
                  <textarea
                    name="shippingInfo"
                    value={formData.shippingInfo}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                      errors.shippingInfo ? "border-red-500 dark:border-red-500" : ""
                    }`}
                    rows="3"
                  />
                  {errors.shippingInfo && <p className="text-red-500 text-xs mt-1">{errors.shippingInfo}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Product Image</label>
                <div className="flex flex-row gap-4 items-start">
                  {imagePreview ? (
                    <div className="relative w-32 h-32">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg border-2 border-slate-300 dark:border-slate-600"
                      />
                      <button
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, image: null }));
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                        errors.image
                          ? "border-red-500 dark:border-red-500"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      <svg
                        className="w-8 h-8 text-slate-400 dark:text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16V8m0 0l-4 4m4-4l4 4m6 4v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2z"
                        />
                      </svg>
                      <span className="text-sm text-slate-600 dark:text-slate-400 mt-2">Upload Image</span>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white rounded-lg transition-colors ${
                    isFormValid
                      ? "hover:from-blue-600 hover:to-cyan-600 dark:hover:from-blue-700 dark:hover:to-cyan-700"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}