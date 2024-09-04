import { generateImgLinks } from "./generateImgLink";

export const fetchData = async () => {
  const url = `${process.env.REACT_APP_API_URL}/api/shop/`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Error loading products");
  } else {
    let data = await response.json();
    let products = data.products;

    const updatedProducts = products.map((product) => {
      ["img1", "img2", "img3", "img4", "img5"].forEach((imgKey) => {
        if (product[imgKey]) {
          product[imgKey] = generateImgLinks(product[imgKey]);
        }
      });
      return product;
    });

    return updatedProducts;
  }
};
