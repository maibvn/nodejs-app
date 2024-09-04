// import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import ErrorPage from "./pages/ErrorPage";
import Homepage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import DetailPage from "./pages/DetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { fetchData as prodLoader } from "./utils/fetchData";
import { checkLoginStatus as userLoader } from "./utils/checkUser";
import OrderPage from "./pages/OrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import { useSelector } from "react-redux";

const rootLoader = async () => {
  const user = await userLoader();
  const products = await prodLoader();
  return { products, user };
};

//Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        path: "/",
        loader: rootLoader,
        element: <Homepage />,
        index: true,
      },
      {
        path: "/shop",
        element: <ShopPage />,
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/shop", element: <ShopPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/detail/:productID", element: <DetailPage /> },
      { path: "/cart", element: <CartPage />, loader: rootLoader },
      { path: "/checkout", element: <CheckoutPage />, loader: rootLoader },
      { path: "/order", element: <OrderPage />, loader: rootLoader },
      {
        path: "/order/:orderId",
        element: <OrderDetailPage />,
        loader: rootLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
