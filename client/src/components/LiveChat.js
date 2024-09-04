import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faPaperclip,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import io, { Socket } from "socket.io-client";
import classes from "./LiveChat.module.css";
import { v4 as uuidv4 } from "uuid";

const LiveChat = ({ isOpen }) => {
  const [roomId, setRoomId] = useState(() => {
    // Retrieve the roomId from local storage if it exists
    const savedRoomId = localStorage.getItem("roomId");
    if (savedRoomId) {
      return savedRoomId;
    }
    const newRoomId = uuidv4();
    // const newRoomId = "27985967-da16-4713-b41d-4f2abfa1d9e4";
    localStorage.setItem("roomId", newRoomId);
    return newRoomId;
  });
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const messageRef = useRef();
  const messageEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io.connect(`${process.env.REACT_APP_API_URL}`);
    // Register roomId
    const data = { roomId: roomId, from: "client" };
    socketRef.current.emit("register", data);
    // Listen to event
    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [socketRef, messages]);

  // Scroll to bottom of conversation
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/message/${roomId}`,
          {
            method: "GET",
            credentials: "include", // Ensure cookies are sent with the request
          }
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getMessages(); // Ensure the function is called
  }, [roomId]);

  const handleMessageSend = () => {
    const message = messageRef.current.value.trim();
    if (message.length === 0) {
      return;
    }
    // Remove roomId
    if (message === "/end") {
      localStorage.removeItem("roomId");
    }
    socketRef.current.emit("send_message", {
      message: message,
      from: "client",
      roomId: roomId,
    });
    messageRef.current.value = "";
  };

  return (
    <>
      {isOpen && (
        <div className={classes.liveChat}>
          <div className={classes.header}>
            <h6 style={{ fontWeight: 700 }}>Customer Support</h6>
            <p>Let's Chat App</p>
          </div>
          <div
            style={{
              height: "250px",
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              marginBottom: "1rem",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.from === "client" ? "right" : "left",
                  overflowX: "hidden",
                  margin: "5px",
                }}
              >
                <div
                  style={{
                    borderRadius: "10px",
                    maxWidth: "60%",
                    wordBreak: "break-word",
                    display: "inline-block",
                    padding: "10px",
                    textAlign: msg.from === "client" ? "right" : "left",
                    backgroundColor:
                      msg.from === "client" ? "#48B0F7" : "#F5F6F7",
                  }}
                >
                  {msg.from !== "client" ? "Cộng tác viên" : "You"}:{" "}
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          <div style={{ padding: 10, display: "flex", alignItems: "center" }}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/10015/10015677.png"
              alt="consultor-img"
              className={classes.supporterImg}
            />
            <input
              type="text"
              placeholder="Enter message!"
              ref={messageRef}
              onKeyPress={(e) => e.key === "Enter" && handleMessageSend()}
            />
            <FontAwesomeIcon icon={faPaperclip} className={classes.icon} />
            <FontAwesomeIcon icon={faSmile} className={classes.icon} />
            <FontAwesomeIcon
              icon={faPaperPlane}
              onClick={handleMessageSend}
              className={classes.icon}
              style={{ color: "#2fa3f0" }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChat;
