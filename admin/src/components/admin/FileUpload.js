import React, { useEffect, useState, useCallback } from "react";
import styles from "./FileUpload.module.css";

const FileUpload = ({ errors, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    onUpload(selectedFiles);
  }, [selectedFiles]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedFiles.length > 5) {
      alert("You can only upload a maximum of 5 images.");
      return;
    }
    setSelectedFiles((prevFiles) => [
      ...prevFiles,
      ...files.slice(0, 5 - prevFiles.length),
    ]);
  };
  const removeImage = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "50% 1fr",
        gap: "1rem",
      }}
    >
      <div>
        <label>Upload Image (5 images)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          disabled={selectedFiles.length >= 5}
        />
      </div>

      <div className={styles.previewContainer}>
        {selectedFiles.map((file, index) => (
          <div key={index} className={styles.preview}>
            <div>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview ${index}`}
                className={styles.previewImage}
              />
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => removeImage(index)}
              className={styles.removeButton}
            >
              ×
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
