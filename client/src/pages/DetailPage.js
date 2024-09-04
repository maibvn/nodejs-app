import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import Image from "../components/DetailPage/Image";
import classes from "../components/DetailPage/DetailPage.module.css";
import AddToCart from "../components/DetailPage/AddToCart";
import ProductItems from "../components/HomePage/ProductItems";

const DetailPage = () => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  // Set up to change product's image when clicking
  const [imgSrc, setImg] = useState(null);
  const params = useParams();
  // Get data from Redux and LS
  const products = useSelector((state) => state.shop.products);
  const productsLS = JSON.parse(localStorage.getItem("productArray"));

  useEffect(() => {
    //Use params (productID) to find the product and related products
    if (products.length !== 0) {
      const productArr = products.filter(
        // prod._id['$oid] to convert id string from mongoDB language
        (prod) => prod._id === params.productID
      );
      const relatedProd = products.filter(
        (prod) =>
          prod.category === productArr[0].category &&
          prod._id !== productArr[0]._id
      );
      setProduct(productArr[0]);
      setRelatedProduct(relatedProd);
    } else if (productsLS) {
      //No redux, GET data from Local Storage => For No error when RELOADING page
      const productArr = productsLS.filter(
        (prod) => prod._id === params.productID
      );
      const relatedProd = productsLS.filter(
        (prod) =>
          prod.category === productArr[0].category &&
          prod._id !== productArr[0]._id
      );
      setProduct(productArr[0]);
      setRelatedProduct(relatedProd);
    }
    //Smooth scrolling
    window.scrollTo({
      top: "100px",
      behavior: "smooth",
    });
  }, [params]);
  //Convert 100000 to 100.000
  const priceNum = Number(product.price).toLocaleString("id-ID");
  //Break description into lines
  const breakLine = (product) => {
    const longDesc = product.long_desc.split("\n");
    return longDesc;
  };

  useEffect(() => {
    setImg(product.img1);
  }, [product]);

  return (
    <>
      {Object.keys(product).length !== 0 && (
        <div className={classes.detailpage}>
          <div className={classes.detailContainer}>
            <div className={classes.imgContainer}>
              <img
                src={product.img1}
                alt="product-img"
                onClick={() => {
                  setImg(product.img1);
                }}
              />
              <img
                src={product.img2}
                alt="product-img"
                onClick={() => {
                  setImg(product.img2);
                }}
              />
              <img
                src={product.img3}
                alt="product-img"
                onClick={() => {
                  setImg(product.img3);
                }}
              />
              <img
                src={product.img4}
                alt="product-img"
                onClick={() => {
                  setImg(product.img4);
                }}
              />
            </div>
            <div>
              {!imgSrc && <img src={product.img1} alt="product-img" />}
              {imgSrc && <Image src={imgSrc} />}
            </div>
            <div>
              <h1>{product.name}</h1>
              {product.count === 0 && (
                <div className={classes.soldOutMessage}>Out of stock!</div>
              )}
              <h2>{priceNum} VND</h2>
              <p>{product.short_desc}</p>
              <h6>
                CATEGORY:
                <span
                  style={{
                    display: "inline-block",
                    color: "grey",
                    marginLeft: "8px",
                    marginBottom: "16px",
                  }}
                >
                  {product.category}s
                </span>
              </h6>

              <AddToCart product={product} />
            </div>
          </div>
          <div className={classes.description}>
            <button style={{ cursor: "default" }}>DESCRIPTION</button>
            <h3>PRODUCT DESCRIPTION</h3>
            <div>
              {product.long_desc &&
                breakLine(product).map((des, i) => <p key={i}>{des}</p>)}
            </div>
            <div className={classes.relatedProd}>
              <h3>RELATED PRODUCTS</h3>
              {relatedProduct.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "48px",
                    color: "purple",
                    fontSize: "18px",
                    fontWeight: "450",
                  }}
                >
                  No related products found! The product above is one of a kind!
                  😍
                </div>
              )}
              <div className={classes.prodContainer}>
                {relatedProduct.length > 0 &&
                  relatedProduct.map((prod, i) => {
                    return <ProductItems prod={prod} page="category" key={i} />;
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DetailPage;
