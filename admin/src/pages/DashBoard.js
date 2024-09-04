import React, { useEffect, useState } from "react";
import styles from "./DashBoard.module.css"; // Assuming you're using CSS modules for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faDollarSign,
  faFileCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import ViewModal from "../components/admin/ViewOrderModal";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [viewOrder, setViewOrder] = useState(false);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalNewOrders: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/orders", {
          method: "GET",
          credentials: "include", // Ensure cookies are sent with the request
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
          setStats({
            totalEarnings: data.totalEarnings,
            totalNewOrders: data.totalNewOrders,
            totalUsers: data.totalUsers,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrder();
  }, []);
  const viewOrderHandler = (order) => {
    setSelectedOrder(order);
    setViewOrder(true);
  };
  return (
    <div className={`${styles.dashboard} ${styles.orderContainer}`}>
      {viewOrder && (
        <ViewModal
          isOpen={viewOrder}
          onClose={() => setViewOrder((prevState) => !prevState)}
          orderData={selectedOrder}
        />
      )}
      <h4>Orders</h4>

      <div className={styles.boxContainer}>
        <div className={styles.box}>
          <div>
            <h2 style={{ margin: 0 }}>{stats.totalUsers}</h2>
            <div style={{ color: "grey ", fontSize: "1rem" }}> Clients</div>
          </div>
          <FontAwesomeIcon
            icon={faUserPlus}
            className={styles.icon}
            style={{
              color: "grey",
              fontSize: "1.5rem",
              justifySelf: "end",
              alignSelf: "center",
            }}
          />
        </div>
        <div className={styles.box}>
          <div>
            <h2 style={{ margin: 0 }}>
              <div
                style={{
                  display: "inline-block",
                  fontSize: "24px",
                  position: "relative",
                }}
              >
                {stats.totalEarnings.toLocaleString()}
                <div
                  style={{
                    position: "absolute",
                    top: "-0.1em",
                    right: "-2.3em",
                    fontSize: "0.6em",
                  }}
                >
                  VND
                </div>
              </div>
            </h2>

            <div style={{ color: "grey ", fontSize: "1rem" }}>
              {" "}
              Earnings of Month
            </div>
          </div>
          <FontAwesomeIcon
            icon={faDollarSign}
            className={styles.icon}
            style={{
              color: "grey",
              fontSize: "1.5rem",
              justifySelf: "end",
              alignSelf: "center",
            }}
          />
        </div>
        <div className={styles.box}>
          <div>
            <h2 style={{ margin: 0 }}>{stats.totalNewOrders}</h2>
            <div style={{ color: "grey ", fontSize: "1rem" }}> New Order</div>
          </div>
          <FontAwesomeIcon
            icon={faFileCirclePlus}
            className={styles.icon}
            style={{
              color: "grey",
              fontSize: "1.5rem",
              justifySelf: "end",
              alignSelf: "center",
            }}
          />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID User</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Total</th>
            <th>Delivery</th>
            <th>Status</th>
            <th>Datail</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user._id}</td>
                <td>{order.user.fullName}</td>
                <td>{order.user.phone}</td>
                <td>{order.user.address}</td>
                <td>{order.totalPrice.toLocaleString()} VND</td>
                <td>Chưa vận chuyển</td>
                <td>{order.orderStatus}</td>

                <td>
                  <button
                    className={styles.viewBtn}
                    onClick={() => viewOrderHandler(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
