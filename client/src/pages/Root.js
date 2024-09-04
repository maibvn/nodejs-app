import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoaderData, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import LiveChat from "../components/LiveChat";
import { login, logout } from "../store/login/actions";
import classes from "../components/LiveChat.module.css";

const Root = () => {
  //Livechat Modal
  const [openChat, setOpenChat] = useState(false);
  const dispatch = useDispatch();
  const { products, user } = useLoaderData();
  //Save loaded data to localStorage to enhance performance

  useEffect(() => {
    //Update Redux store with data loaded
    dispatch({ type: "UPDATE_SHOP", data: products });
    dispatch(login(user));
  }, [user]);

  const onLogout = () => {
    dispatch(logout(user));
  };

  return (
    <>
      <NavBar currentUser={user} onLogout={onLogout} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <div key={Math.random()} className={classes.livechatContainer}>
        <LiveChat isOpen={openChat} onClose={() => setOpenChat(false)} />
      </div>
      <div style={{ position: "fixed", bottom: 20, right: 20 }}>
        <div
          style={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "50%",
            padding: 17,
            paddingBottom: 12,
            cursor: "pointer",
          }}
          onClick={() => setOpenChat((prevState) => !prevState)}
        >
          <FontAwesomeIcon size="2x" icon={faMessage} />
        </div>
      </div>
    </>
  );
};

export default Root;
