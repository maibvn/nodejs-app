import { useLoaderData, useLocation, useParams } from "react-router-dom";

import classes from "../components/ShopPage/ShopPage.module.css";
import { useEffect, useState } from "react";

const OrderDetailPage = () => {
  const [order, setOrder] = useState(null);
  const { user } = useLoaderData();
  const { orderId } = useParams();

  useEffect(() => {
    const getOrderDetail = async () => {
      const url = `${process.env.REACT_APP_API_URL}/api/shop/order/${orderId}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getOrderDetail();
  }, []);

  return (
    <>
      {order && user && (
        <div>
          <div className={classes.orderInfor}>
            <h2>INFORMATION ORDER</h2>
            <p>ID User: {user._id}</p>
            <p>Full Name: {user.fullName}</p>
            <p>Phone: {user.phone}</p>
            <p>Address: {user.address}</p>
            <p>Total: {order.totalPrice}</p>
          </div>

          <div>
            <div className={classes.orderContainer}>
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>ID Product</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((prod) => (
                    <tr key={prod.product._id}>
                      <td>{prod.product._id}</td>
                      <td>
                        <img src={prod.product.img1 || prod.product.img2}></img>
                      </td>
                      <td>{prod.product.name}</td>
                      <td>{prod.product.price.toLocaleString()} VND</td>
                      <td>{prod.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default OrderDetailPage;
