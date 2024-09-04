import React, { useRef, useState, useEffect } from "react";
import classes from "./UpdatedProductModal.module.css";
import axios from "axios";
import FileUpload from "./FileUpload";

const UpdateProduct = ({
  method,
  existingProductData,
  onClose,
  onReload,
  productId,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  // Refs for form fields
  const nameRef = useRef(null);
  const countRef = useRef(null);
  const priceRef = useRef(null);
  const categoryRef = useRef(null);
  const shortDesRef = useRef(null);
  const longDesRef = useRef(null);

  // State for form errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Populate form fields with existing product data
    if (existingProductData) {
      nameRef.current.value = existingProductData.name || "";
      priceRef.current.value = existingProductData.price || "";
      categoryRef.current.value = existingProductData.category || "";
    }
  }, [existingProductData]);

  const fileUploadHandler = (images) => {
    setSelectedFiles(images);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!nameRef.current.value) newErrors.name = "Name is required";
    if (!countRef.current.value) newErrors.count = "Count is required";
    if (!priceRef.current.value) newErrors.price = "Price is required";
    if (!categoryRef.current.value) newErrors.category = "Category is required";
    if (method === "add") {
      if (!shortDesRef.current.value)
        newErrors.shortDesc = "Short description is required";
      if (!longDesRef.current.value)
        newErrors.longDesc = "Long description is required";
      if (selectedFiles.length !== 5)
        newErrors.images = "You need to upload 5 images";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const handleUpdate = async () => {
      try {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/admin/product/edit/${productId}`,
          formData,
          { withCredentials: true }
        );
        alert("Update Product successfully");
        if (onClose) onClose();
        if (onReload) onReload();
      } catch (error) {
        console.error("Update failed:", error.response?.data || error.message);
      }
    };

    const handleUploadImg = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/admin/upload`,
          imageData,
          { withCredentials: true }
        );
        const imgUrls = response.data.imgUrls.reverse();
        await handleAddNewProd(imgUrls);
      } catch (error) {
        console.error("Upload failed:", error.response?.data || error.message);
      }
    };

    const handleAddNewProd = async (imgUrls) => {
      imgUrls.forEach((path, index) => {
        formData.append(`img${index + 1}`, path);
      });
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/admin/add-product`,
          formData,
          { withCredentials: true }
        );
        alert("Add a new product sucessfully!");
        if (onClose) onClose();
        if (onReload) onReload();
      } catch (error) {
        console.error("Upload failed:", error.response?.data || error.message);
      }
    };

    let formData = new FormData();
    let imageData = new FormData();

    if (method === "update") {
      formData.append("_id", productId);
      formData.append("name", nameRef.current.value);
      formData.append("count", Number(countRef.current.value));
      formData.append("price", Number(priceRef.current.value));
      formData.append("category", categoryRef.current.value);
      await handleUpdate();
    } else if (method === "add") {
      formData.append("name", nameRef.current.value);
      formData.append("count", Number(countRef.current.value));
      formData.append("price", Number(priceRef.current.value));
      formData.append("category", categoryRef.current.value);
      formData.append("short_desc", shortDesRef.current.value);
      formData.append("long_desc", longDesRef.current.value);

      Array.from(selectedFiles).forEach((image) => {
        imageData.append("images", image);
      });
      await handleUploadImg();
    }
  };

  return (
    <div className={classes.editModal}>
      <div className={classes.editModalContent}>
        {method === "update" ? (
          <h2>Update Product</h2>
        ) : (
          <h2>Add a new product</h2>
        )}
        <form>
          {method === "update" && (
            <div>
              <label>ID</label>
              <input
                disabled
                type="text"
                defaultValue={existingProductData?._id || ""}
              />
            </div>
          )}
          {method === "update" && (
            <div>
              <label>Images</label>
              <textarea
                disabled
                rows={4} // Adjust the number of rows as needed
                value={[
                  existingProductData?.img1 || "",
                  existingProductData?.img2 || "",
                  existingProductData?.img3 || "",
                  existingProductData?.img4 || "",
                  existingProductData?.img5 || "",
                ]
                  .filter(Boolean)
                  .join("\n")} // Join non-empty image links with newline
                style={{ width: "100%", resize: "none" }} // Optional styling
              />
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "50% 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label>Product Name</label>
              <input
                type="text"
                ref={nameRef}
                placeholder="Enter Product Name"
                defaultValue={existingProductData?.name || ""}
              />
              {errors.name && <span>{errors.name}</span>}
            </div>
            <div>
              <label>Count</label>
              <input
                type="number"
                ref={countRef}
                placeholder="Enter Product Count"
                defaultValue={existingProductData?.count || ""}
              />
              {errors.count && <span>{errors.count}</span>}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "50% 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Enter price"
                ref={priceRef}
                defaultValue={existingProductData?.price || 0}
              />
              {errors.price && <span>{errors.price}</span>}
            </div>
            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="Enter Category"
                ref={categoryRef}
                defaultValue={existingProductData?.category || ""}
              />
              {errors.category && <span>{errors.category}</span>}
            </div>
          </div>
          {method === "add" && (
            <div>
              <label>Short description</label>
              <textarea
                type="text"
                ref={shortDesRef}
                placeholder="Enter short description"
              />
              {errors.shortDesc && <span>{errors.shortDesc}</span>}
            </div>
          )}
          {method === "add" && (
            <div>
              <label>Long description</label>
              <textarea
                type="text"
                ref={longDesRef}
                placeholder="Enter long description"
              />
              {errors.longDesc && <span>{errors.longDesc}</span>}
            </div>
          )}

          {method === "add" && (
            <div>
              <FileUpload errors="" onUpload={fileUploadHandler} />
              {errors.images && <span>{errors.images}</span>}
            </div>
          )}

          {method === "add" ? (
            <button onClick={submitHandler}>Add Product</button>
          ) : (
            <button onClick={submitHandler}>Update Product</button>
          )}
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              }
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
