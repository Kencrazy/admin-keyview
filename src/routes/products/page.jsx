import React, { useState, useEffect } from "react";
import { Star, PencilLine, Trash } from "lucide-react";
import SearchbarAndFilters from "../../components/filter";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "@/hooks/use-theme";
import striptags from "striptags";
import { updateData, updateImageToFirebase } from "../../service/updateFirebase";
import { deleteData, deleteImageFromFirebase } from "../../service/deleteFirebase";
import cleanQuillHtml from "../../utils/cleanQuillHtml";
import { auth } from "../../service/firebaseConfig";
import productImage from "../../assets/product-image.jpg";

export default function ProductsPage({ productData, setProductData, metaData, setMetaData }) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    newType: "",
    image: null,
    price: "",
    discount: "",
    shippingInfo: "",
  });
  const [discountRanges, setDiscountRanges] = useState(metaData?.discountRanges || []);
  const [discountForm, setDiscountForm] = useState({
    minPrice: "",
    maxPrice: "",
    discount: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [discountErrors, setDiscountErrors] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const [productTypes, setProductTypes] = useState(
    metaData?.productTypes
      && [...new Set([...metaData.productTypes, "Other"])]
  );
  const itemsPerPage = 20;

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  useEffect(() => {
    const preloadImages = async () => {
      const urls = {};
      for (const product of productData) {
        try {
          urls[product.number] = product.image;
        } catch (error) {
          console.error(`Error preloading image for ${product.name}:`, error);
          urls[product.number] = productImage;
        }
      }
      setImageUrls(urls);
    };
    preloadImages();
  }, [productData]);

  useEffect(() => {
    // Sync productTypes with metaData.productTypes when metaData changes
    if (metaData?.productTypes) {
      setProductTypes([...new Set([...metaData.productTypes, "Other"])]);
    }
  }, [metaData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isChanged && document.visibilityState === "hidden") {
        updateData("", { productTypes, discountRanges }, "settings");
        setIsChanged(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [productTypes, discountRanges, isChanged]);

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
    if (!editingProduct && !formData.image) newErrors.image = "Image is required";
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (formData.discount && (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      newErrors.discount = "Discount must be between 0 and 100";
    }
    if (!formData.shippingInfo.trim()) {
      newErrors.shippingInfo = "Shipping information is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDiscountForm = () => {
    const newErrors = {};
    if (discountForm.minPrice && parseFloat(discountForm.minPrice) < 0) {
      newErrors.minPrice = "Minimum price must be a non-negative number";
    }
    if (discountForm.maxPrice && discountForm.minPrice && parseFloat(discountForm.maxPrice) <= parseFloat(discountForm.minPrice)) {
      newErrors.maxPrice = "Maximum price must be greater than minimum price";
    }
    if (!discountForm.discount || parseFloat(discountForm.discount) < 0 || parseFloat(discountForm.discount) > 100) {
      newErrors.discount = "Discount must be between 0 and 100";
    }
    setDiscountErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [formData, editingProduct]);

  useEffect(() => {
    validateDiscountForm();
  }, [discountForm]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscountInputChange = (e) => {
    const { name, value } = e.target;
    setDiscountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleImageChange = (e) => {
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

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) return;
    if (!auth.currentUser) {
      alert("You must be logged in to delete a product.");
      return;
    }

    try {
      setProductData((prev) => prev.filter((p) => p.createdAt !== product.createdAt));
      setImageUrls((prev) => {
        const newUrls = { ...prev };
        delete newUrls[product.number];
        return newUrls;
      });
      await deleteImageFromFirebase(product.createdAt, product.createdAt, "products");
      await deleteData("products", product.createdAt);
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      type: productTypes.includes(product.type) ? product.type : "Other",
      newType: productTypes.includes(product.type) ? "" : product.type,
      image: null,
      price: product.price.toString(),
      discount: (product.discount || 0).toString(),
      shippingInfo: product.shippingInfo || "",
    });
    setImagePreview(product.image);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (product) => {
    if (!auth.currentUser) {
      alert("You must be logged in to update product status.");
      return;
    }

    const newStatus = product.status === "In Stock" ? "Out of Stock" : "In Stock";
    const updatedProduct = { ...product, status: newStatus };

    try {
      await updateData("products", updatedProduct, product.createdAt);
      setProductData((prev) =>
        prev.map((p) => (p.createdAt === product.createdAt ? updatedProduct : p))
      );
      alert(`Product status updated to ${newStatus}.`);
    } catch (error) {
      console.error("Error updating product status:", error);
      alert("Failed to update product status. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!auth.currentUser) {
      alert("You must be logged in to save a product.");
      return;
    }

    const today = Date.now();
    let newProductTypes = [...productTypes];

    // Handle new product type
    if (formData.type === "Other" && formData.newType.trim()) {
      const newType = formData.newType.trim();
      if (!newProductTypes.includes(newType)) {
        newProductTypes = [...newProductTypes.filter((t) => t !== "Other"), newType, "Other"];
        setProductTypes(newProductTypes);
        setMetaData((prevMetaData) => ({
          ...prevMetaData,
          productTypes: newProductTypes,
        }));
        setIsChanged(true);
      }
    }

    let imageUrl = editingProduct ? editingProduct.image : null;
    if (formData.image) {
      imageUrl = await updateImageToFirebase(
        formData.image,
        editingProduct ? editingProduct.createdAt : today.toString(),
        "products",
        editingProduct ? editingProduct.createdAt : today.toString()
      );
      if (!imageUrl) {
        console.error("Failed to upload image");
        alert("Failed to upload image. Please try again.");
        return;
      }
    }

    const productPayload = {
      name: formData.name,
      description: formData.description,
      type: formData.type === "Other" ? formData.newType : formData.type,
      image: imageUrl,
      price: parseFloat(formData.price),
      discount: formData.discount ? parseFloat(formData.discount) : 0,
      status: editingProduct ? editingProduct.status : "In Stock",
      rating: editingProduct ? editingProduct.rating : 0,
      createdAt: editingProduct ? editingProduct.createdAt : today.toString(),
      number: editingProduct ? editingProduct.number : productData.length ? Math.max(...productData.map((p) => p.number)) + 1 : 1,
      shippingInfo: formData.shippingInfo,
    };

    try {
      await updateData("products", productPayload, productPayload.createdAt);
      if (editingProduct) {
        setProductData((prev) =>
          prev.map((p) => (p.createdAt === editingProduct.createdAt ? productPayload : p))
        );
        setImageUrls((prev) => ({
          ...prev,
          [productPayload.number]: imageUrl,
        }));
      } else {
        setProductData((prev) => [...prev, productPayload]);
        setImageUrls((prev) => ({
          ...prev,
          [productPayload.number]: imageUrl,
        }));
      }

      // Update settings with new product types
      if (isChanged) {
        await updateData("", { productTypes: newProductTypes, discountRanges }, "settings");
        setIsChanged(false);
      }

      setFormData({
        name: "",
        description: "",
        type: "",
        newType: "",
        image: null,
        price: "",
        discount: "",
        shippingInfo: "",
      });
      setImagePreview(null);
      setErrors({});
      setEditingProduct(null);
      setIsModalOpen(false);
      alert(editingProduct ? "Product updated successfully." : "Product added successfully.");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleAddProduct = () => {
    if (!auth.currentUser) {
      alert("You must be logged in to add a product.");
      return;
    }
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      type: "",
      newType: "",
      image: null,
      price: "",
      discount: "",
      shippingInfo: "",
    });
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleOpenDiscountModal = () => {
    if (!auth.currentUser) {
      alert("You must be logged in to manage discounts.");
      return;
    }
    setDiscountForm({
      minPrice: "",
      maxPrice: "",
      discount: "",
    });
    setDiscountErrors({});
    setIsDiscountModalOpen(true);
  };

  const handleCloseDiscountModal = () => {
    setIsDiscountModalOpen(false);
    setDiscountForm({
      minPrice: "",
      maxPrice: "",
      discount: "",
    });
    setDiscountErrors({});
  };

  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    if (!validateDiscountForm()) return;
    if (!auth.currentUser) {
      alert("You must be logged in to set discounts.");
      return;
    }

    const minPrice = discountForm.minPrice ? parseFloat(discountForm.minPrice) : 0;
    const maxPrice = discountForm.maxPrice ? parseFloat(discountForm.maxPrice) : Infinity;
    const discount = parseFloat(discountForm.discount);

    const newDiscountRange = { minPrice, maxPrice, discount, id: Date.now().toString() };

    try {
      const updatedDiscountRanges = [...discountRanges, newDiscountRange];
      setDiscountRanges(updatedDiscountRanges);
      setMetaData((prevMetaData) => ({
        ...prevMetaData,
        discountRanges: updatedDiscountRanges,
      }));
      setIsChanged(true);

      await updateData("", { productTypes, discountRanges: updatedDiscountRanges }, "settings");

      setIsDiscountModalOpen(false);
      setDiscountForm({
        minPrice: "",
        maxPrice: "",
        discount: "",
      });
      setDiscountErrors({});
      alert(`Discount range added: ${discount}% for products between ${minPrice} and ${maxPrice === Infinity ? "Infinity" : maxPrice}.`);
    } catch (error) {
      console.error("Error saving discount range:", error);
      alert("Failed to save discount range. Please try again.");
    }
  };

  const handleDeleteDiscountRange = async (rangeId) => {
    if (!auth.currentUser) {
      alert("You must be logged in to delete discounts.");
      return;
    }

    try {
      const updatedDiscountRanges = discountRanges.filter((range) => range.id !== rangeId);
      setDiscountRanges(updatedDiscountRanges);
      setMetaData((prevMetaData) => ({
        ...prevMetaData,
        discountRanges: updatedDiscountRanges,
      }));
      setIsChanged(true);

      await updateData("", { productTypes, discountRanges: updatedDiscountRanges }, "settings");

      alert("Discount range deleted successfully.");
    } catch (error) {
      console.error("Error deleting discount range:", error);
      alert("Failed to delete discount range. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      type: "",
      newType: "",
      image: null,
      price: "",
      discount: "",
      shippingInfo: "",
    });
    setImagePreview(null);
    setErrors({});
  };

  const isFormValid =
    formData.name.trim() &&
    striptags(formData.description).trim() &&
    formData.type &&
    (formData.type !== "Other" || formData.newType.trim()) &&
    (editingProduct || formData.image || imagePreview) &&
    parseFloat(formData.price) > 0 &&
    formData.shippingInfo.trim() &&
    (!formData.discount || (parseFloat(formData.discount) >= 0 && parseFloat(formData.discount) <= 100));

  const isDiscountFormValid =
    discountForm.discount &&
    parseFloat(discountForm.discount) >= 0 &&
    parseFloat(discountForm.discount) <= 100 &&
    (!discountForm.minPrice || parseFloat(discountForm.minPrice) >= 0) &&
    (!discountForm.maxPrice || !discountForm.minPrice || parseFloat(discountForm.maxPrice) > parseFloat(discountForm.minPrice));

    const formatPrice = (price) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };
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
      <div className="flex justify-end mt-2">
        <button
          onClick={handleOpenDiscountModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Manage Discount Ranges
        </button>
      </div>
      <div className="card mt-4">
        <div className="card-body p-0">
          <div className="relative h-fit w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Product</th>
                  <th className="table-head">Price</th>
                  <th className="table-head">Discount</th>
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
                        <div className="flex flex-col w-60 truncate">
                          <p className="truncate" title={product.name} >{product.name}</p>
                          <p>Type: {product.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      {formatPrice(product.price)}
                      {product.discount > 0 && (
                        <span className="text-red-500 ml-2">
                          (-{product.discount}%)
                        </span>
                      )}
                    </td>
                    <td className="table-cell">{product.discount || 0}%</td>
                    <td 
                      className="table-cell cursor-pointer hover:text-blue-500 dark:hover:text-blue-400"
                      onClick={() => handleToggleStatus(product)}
                    >
                      {product.status}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-2">
                        <Star size={18} className="fill-yellow-600 stroke-yellow-600" />
                        {product.rating}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-4">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-500 dark:text-blue-600"
                        >
                          <PencilLine size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-500"
                        >
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
        <div className="fixed inset-0 bg-black/60 flex max-h-[90%] overflow-y-scroll justify-center mt-20 z-50 transition-opacity duration-300">
          <div
            className={`relative bg-white dark:bg-slate-900 p-6 rounded-xl shadow-2xl max-w-7xl w-[90%] transform transition-transform duration-300 ${
              isModalOpen ? "scale-100" : "scale-0"
            }`}
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-700 dark:to-cyan-700 p-4 rounded-t-xl -m-6 mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                    errors.discount ? "border-red-500 dark:border-red-500" : ""
                  }`}
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="Enter discount (0-100, optional)"
                />
                {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
                <ReactQuill
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={quillModules}
                  theme="snow"
                  className={`bg-white dark:bg-slate-800 text-slate-900 dark:text-white [&_.ql-toolbar]:bg-slate-100 [&_.ql-container]:border-slate-300 dark:[&_.ql-container]:border-slate-600 [&_.ql-editor]:min-h-[100px] ${
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
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDiscountModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 transition-opacity duration-300">
          <div
            className={`relative bg-white dark:bg-slate-900 p-6 rounded-xl shadow-2xl max-w-lg w-[90%] transform transition-transform duration-300 ${
              isDiscountModalOpen ? "scale-100" : "scale-0"
            }`}
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-700 dark:to-cyan-700 p-4 rounded-t-xl -m-6 mb-4">
              <h2 className="text-xl font-bold text-white">Manage Discount Ranges</h2>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Current Discount Ranges</h3>
              {discountRanges.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {discountRanges.map((range) => (
                    <li key={range.id} className="flex justify-between items-center p-2 bg-slate-100 dark:text-white dark:bg-slate-800 rounded-lg">
                      <span>
                        {range.discount}% off for {range.minPrice} to {range.maxPrice === Infinity ? "Infinity" : `${range.maxPrice}`}
                      </span>
                      <button
                        onClick={() => handleDeleteDiscountRange(range.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No discount ranges set.</p>
              )}
            </div>
            <form onSubmit={handleDiscountSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Minimum Price (optional)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={discountForm.minPrice}
                  onChange={handleDiscountInputChange}
                  className={`w-full p-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                    discountErrors.minPrice ? "border-red-500 dark:border-red-500" : ""
                  }`}
                  step="0.01"
                  min="0"
                  placeholder="Leave blank for 0"
                />
                {discountErrors.minPrice && <p className="text-red-500 text-xs mt-1">{discountErrors.minPrice}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Maximum Price (optional)</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={discountForm.maxPrice}
                  onChange={handleDiscountInputChange}
                  className={`w-full p-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                    discountErrors.maxPrice ? "border-red-500 dark:border-red-500" : ""
                  }`}
                  step="0.01"
                  min="0"
                  placeholder="Leave blank for Infinity"
                />
                {discountErrors.maxPrice && <p className="text-red-500 text-xs mt-1">{discountErrors.maxPrice}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={discountForm.discount}
                  onChange={handleDiscountInputChange}
                  className={`w-full p-2 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                    discountErrors.discount ? "border-red-500 dark:border-red-500" : ""
                  }`}
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="Enter discount (0-100)"
                />
                {discountErrors.discount && <p className="text-red-500 text-xs mt-1">{discountErrors.discount}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseDiscountModal}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isDiscountFormValid}
                  className={`px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white rounded-lg transition-colors ${
                    isDiscountFormValid
                      ? "hover:from-blue-600 hover:to-cyan-600 dark:hover:from-blue-700 dark:hover:to-cyan-700"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  Add Discount Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}