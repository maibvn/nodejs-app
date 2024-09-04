import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import classes from "../components/ShopPage/ShopPage.module.css";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [isNotLogin, setIsNotLogin] = useState(false);
  const { user } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    const getOrder = async () => {
      const url = "http://localhost:5000/api/shop/order";
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (!user) {
      setIsNotLogin(true);
      return;
    } else {
      getOrder();
    }
  }, []);

  const handleViewDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };
  if (isNotLogin) {
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        You need to log in to access this data!
      </p>
    );
  }
  return (
    <>
      {orders.length === 0 && <p>Loading..</p>}
      <div className={classes.banner}>
        <h1>HISTORY</h1>
        <h5 style={{ color: "grey" }}>HISTORY</h5>
      </div>
      <div>
        {orders.length > 0 && (
          <div className={classes.orderContainer}>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Total</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{user._id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td>{order.totalPrice.toLocaleString()} VND</td>
                    <td>{order.deliveryMethod || "Waiting for progressing"}</td>
                    {/* Adjust as needed */}
                    <td>{order.orderStatus}</td>
                    <td>
                      <div className={classes.orderBtnContainer}>
                        <button
                          className={classes.orderDetailBtn}
                          onClick={() => handleViewDetails(order._id)}
                        >
                          View <span>&#x2192;</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
export default OrderPage;
