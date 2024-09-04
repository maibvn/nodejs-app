import { useCallback, useEffect, useState } from "react";
import classes from "./AdminPage.module.css";
import axios from "axios"; // Import axios
import UpdateProduct from "../components/admin/UpdateProductModel";
import DeleteProductModal from "../components/admin/DeleteProductModal";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProd, setSelectedProd] = useState(null);
  const [modalState, setModalState] = useState({
    isUpdating: false,
    isAddingNew: false,
    isDeleting: false,
  });
  const [isReload, setReloadProd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/products",
          {
            withCredentials: true, // Ensure cookies are sent with the request
          }
        );
        setProducts(response.data.products);
      } catch (err) {
        console.error(err);
      }
    };

    getProducts();
  }, [isReload]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleModalClose = useCallback(() => {
    setModalState({
      isUpdating: false,
      isAddingNew: false,
      isDeleting: false,
    });
  }, []);

  const openUpdateProductModal = (prod) => {
    setSelectedProd(prod);
    setModalState({ ...modalState, isUpdating: true });
  };

  const openDeleteProductModal = (prod) => {
    setSelectedProd(prod);
    setModalState({ ...modalState, isDeleting: true });
  };

  const openAddProductModal = () => {
    setModalState({ ...modalState, isAddingNew: true });
  };
  const generateImgLinks = (path) => {
    const isAbsolutePath = path.startsWith("data");
    if (isAbsolutePath) {
      const formattedPath = `${process.env.REACT_APP_API_URL}/${path.replace(
        /\\/g,
        "/"
      )}`;
      return formattedPath;
    } else {
      return path;
    }
  };

  return (
    <div className={classes.adminContainer}>
      {modalState.isUpdating && (
        <UpdateProduct
          method="update"
          productId={selectedProd?._id}
          existingProductData={selectedProd}
          onClose={handleModalClose}
          onReload={() => setReloadProd((prevState) => !prevState)}
        />
      )}
      {modalState.isAddingNew && (
        <UpdateProduct
          method="add"
          onClose={handleModalClose}
          onReload={() => setReloadProd((prevState) => !prevState)}
        />
      )}
      {modalState.isDeleting && selectedProd && (
        <DeleteProductModal
          productId={selectedProd._id}
          productName={selectedProd.name}
          onClose={() =>
            setModalState((prevState) => ({
              ...prevState,
              isDeleting: false,
            }))
          }
          onReload={() => setReloadProd((prevState) => !prevState)}
        />
      )}
      <h4>Products</h4>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="text"
          placeholder="Enter search term"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          style={{ backgroundColor: "orange", color: "white" }}
          onClick={openAddProductModal}
        >
          Add new
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Image</th>
            <th>Category</th>
            <th>Count</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString()} VND</td>
              <td>
                <img
                  src={generateImgLinks(product.img1)}
                  alt={product.name}
                  width="60"
                  height="60"
                />
              </td>
              <td>{product.category}</td>
              <td>{product?.count}</td>
              <td>
                <button
                  className={classes.adminUpdateBtn}
                  onClick={() => openUpdateProductModal(product)}
                >
                  Update
                </button>
                <span> </span>
                <button
                  className={classes.adminDeleteBtn}
                  onClick={() => openDeleteProductModal(product)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
