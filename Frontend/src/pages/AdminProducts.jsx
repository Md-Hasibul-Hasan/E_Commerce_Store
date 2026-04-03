import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

const fieldClasses =
  "w-full rounded-2xl border border-white/10 bg-[#0d1118] px-4 py-3 text-sm text-white outline-none transition focus:border-orange-400/40";

const AdminProducts = () => {
  const { userInfo } = useSelector((state) => state.user);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    countInStock: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewImages, setViewImages] = useState([]);

  const authHeaders = {
    Authorization: `Bearer ${userInfo?.access}`,
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/products/?search=${search}&ordering=${ordering}&page=${page}`,
        {
          headers: authHeaders,
        }
      );

      setProducts(data.results || []);
      setPages(Math.ceil(data.count / 8));
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, ordering, page]);

  const syncProductInList = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const refreshSelectedProduct = async (productId) => {
    const { data } = await axios.get(`${API}/api/products/${productId}/`);
    setSelectedProduct(data);
    syncProductInList(data);
    return data;
  };

  const closeViewModal = () => {
    setViewModal(false);
    setSelectedProduct(null);
    setViewImages([]);
    setDeletingImageId(null);
  };

  const openProductModal = async (product) => {
    setSelectedProduct(product);
    setViewImages([]);
    setViewModal(true);

    try {
      await refreshSelectedProduct(product.id);
    } catch (err) {
      toast.error("Failed to load latest product details");
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await axios.delete(`${API}/api/products/${id}/`, {
      headers: authHeaders,
    });

    toast.success("Deleted");
    fetchProducts();
  };

  const createProduct = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API}/api/products/`,
        {
          name: newProduct.name,
          brand: newProduct.brand,
          category: newProduct.category,
          price: Number(newProduct.price),
          countInStock: Number(newProduct.countInStock),
          description: newProduct.description,
        },
        {
          headers: authHeaders,
        }
      );

      for (const img of images) {
        const imgData = new FormData();
        imgData.append("image", img);
        imgData.append("product", data.id);

        await axios.post(`${API}/api/productimages/`, imgData, {
          headers: authHeaders,
        });
      }

      toast.success("Product created");
      setShowModal(false);
      setImages([]);
      setNewProduct({
        name: "",
        brand: "",
        category: "",
        price: "",
        countInStock: "",
        description: "",
      });

      fetchProducts();
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Create failed");
    } finally {
      setLoading(false);
    }
  };

  const saveSelectedProduct = async () => {
    try {
      setSavingProduct(true);

      await axios.patch(
        `${API}/api/products/${selectedProduct.id}/`,
        selectedProduct,
        {
          headers: authHeaders,
        }
      );

      await refreshSelectedProduct(selectedProduct.id);
      toast.success("Product updated");
      closeViewModal();
      fetchProducts();
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setSavingProduct(false);
    }
  };

  const uploadProductImages = async () => {
    if (!viewImages.length) {
      toast.error("Select image files first");
      return;
    }

    try {
      setUploadingImages(true);

      for (const img of viewImages) {
        const fd = new FormData();
        fd.append("image", img);
        fd.append("product", selectedProduct.id);

        await axios.post(`${API}/api/productimages/`, fd, {
          headers: authHeaders,
        });
      }

      const updatedProduct = await refreshSelectedProduct(selectedProduct.id);
      setViewImages([]);
      toast.success("Images uploaded");
      setSelectedProduct(updatedProduct);
    } catch (err) {
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const deleteProductImage = async (imageId) => {
    try {
      setDeletingImageId(imageId);

      await axios.delete(`${API}/api/productimages/${imageId}/`, {
        headers: authHeaders,
      });

      const updatedProduct = await refreshSelectedProduct(selectedProduct.id);
      toast.success("Image deleted");
      setSelectedProduct(updatedProduct);
    } catch (err) {
      toast.error("Failed to delete image");
    } finally {
      setDeletingImageId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#12161f] p-5 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-orange-300">
              Catalog
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Products
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Manage products, stock, details, and media from one place.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center rounded-2xl bg-orange-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-500"
          >
            Add Product
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_220px]">
          <input
            placeholder="Search products..."
            className={fieldClasses}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className={fieldClasses}
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
          >
            <option value="-createdAt">Newest</option>
            <option value="-price">Price High</option>
            <option value="price">Price Low</option>
          </select>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#12161f]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-gray-500">
              <tr>
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Price</th>
                <th className="px-5 py-4 font-medium">Stock</th>
                <th className="px-5 py-4 font-medium">Rating</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-white/10 text-gray-200"
                >
                  <td
                    className="cursor-pointer px-5 py-4 font-medium text-blue-300 hover:text-blue-200"
                    onClick={() => openProductModal(p)}
                  >
                    {p.name}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">Tk {p.price}</td>
                  <td className="px-5 py-4">{p.countInStock}</td>
                  <td className="px-5 py-4">{p.rating}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteHandler(p.id)}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:flex-row">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-400">
            Page {page} of {pages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pages}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>

      {viewModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-3xl border border-white/10 bg-[#12161f] p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Product Details
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Update details, stock, and product images.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct({ ...selectedProduct, name: e.target.value })
                }
                className={fieldClasses}
              />

              <input
                type="number"
                value={selectedProduct.price}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    price: e.target.value,
                  })
                }
                className={fieldClasses}
              />

              <input
                type="number"
                value={selectedProduct.countInStock}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    countInStock: e.target.value,
                  })
                }
                className={`${fieldClasses} md:col-span-2`}
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
              <p className="mb-3 text-sm font-medium text-white">
                Current Images
              </p>
              <div className="flex flex-wrap gap-3">
                {selectedProduct.images?.map((img) => (
                  <div key={img.id} className="relative">
                    <img
                      src={img.image}
                      className="h-20 w-20 rounded-2xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => deleteProductImage(img.id)}
                      disabled={deletingImageId === img.id}
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow disabled:opacity-60"
                    >
                      {deletingImageId === img.id ? "..." : "X"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d1118] p-4">
              <input
                type="file"
                multiple
                className="block w-full text-sm text-gray-300"
                onChange={(e) => setViewImages([...e.target.files])}
              />

              <div className="mt-4 flex flex-wrap gap-3">
                {viewImages.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={closeViewModal}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white"
              >
                Close
              </button>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={saveSelectedProduct}
                  disabled={savingProduct}
                  className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {savingProduct ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={uploadProductImages}
                  disabled={uploadingImages}
                  className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {uploadingImages ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-3xl border border-white/10 bg-[#12161f] p-6 shadow-2xl">
            <div>
              <h2 className="text-2xl font-semibold text-white">Add Product</h2>
              <p className="mt-1 text-sm text-gray-400">
                Create a new catalog item with images.
              </p>
            </div>

            <input
              placeholder="Name"
              className={fieldClasses}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />

            <input
              placeholder="Brand"
              className={fieldClasses}
              onChange={(e) =>
                setNewProduct({ ...newProduct, brand: e.target.value })
              }
            />

            <input
              placeholder="Category"
              className={fieldClasses}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price"
              className={fieldClasses}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Stock"
              className={fieldClasses}
              onChange={(e) =>
                setNewProduct({ ...newProduct, countInStock: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-[#0d1118] p-4 text-sm text-white outline-none transition focus:border-orange-400/40"
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />

            <input
              type="file"
              multiple
              className="block w-full text-sm text-gray-300"
              onChange={(e) => setImages([...e.target.files])}
            />

            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ))}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white"
              >
                Cancel
              </button>

              <button
                onClick={createProduct}
                disabled={loading}
                className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
