import React, { useState, useEffect, useRef } from "react";
import styles from "./ChatBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { getRoomIds } from "../../utils/getRoomIds";
import io from "socket.io-client";

const Chatbox = () => {
  const [search, setSearch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomIds, setRoomIds] = useState([]); // List of room IDs
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageEndRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    const fetchRoomIds = async () => {
      const rooms = await getRoomIds();
      if (rooms && rooms.length > 0) {
        setRoomIds(rooms);
      }
    };
    fetchRoomIds();
  }, []);

  useEffect(() => {
    socketRef.current = io.connect(`${process.env.REACT_APP_API_URL}`); // Update with your server URL

    socketRef.current.on("messageUpdate", (roomId) => {
      //Update new roomIDs if the user is new
      if (!roomIds.includes(roomId)) {
        const fetchRoomIds = async () => {
          const rooms = await getRoomIds();
          if (rooms && rooms.length > 0) {
            setRoomIds(rooms);
          }
        };
        fetchRoomIds();
      }
    });

    const data = { roomId: selectedRoom, from: "admin" };

    socketRef.current.emit("register", data);

    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.off("receive_message");
    };
  }, [socketRef, messages]);

  // Scroll to bottom of conversation
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/message/${selectedRoom}`,
          {
            method: "GET",
            credentials: "include", // Ensure cookies are sent with the request
          }
        );
        if (response.ok) {
          const data = await response.json();
          setIsLoading(false);
          setMessages(data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [selectedRoom]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleUserClick = (roomId) => {
    if (roomId === selectedRoom) return;
    setSelectedRoom(roomId);
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socketRef.current.emit("send_message", {
        message: newMessage,
        from: "admin",
        roomId: selectedRoom,
      });
      setNewMessage("");
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };
  let img = (
    <img
      src="https://www.pngall.com/wp-content/uploads/5/Profile-Transparent.png"
      alt="consultor-img"
      style={{
        width: "40px",
        height: "40px",
        // margin: "auto",
        // display: "block",
      }}
    />
  );
  return (
    <div className={styles.chatboxContainer}>
      <h4>Chat</h4>
      <div className={styles.links}>
        <span>Apps /</span> <span>Chat</span>{" "}
      </div>
      <div className={styles.chatbox}>
        <div className={styles.sidebar}>
          <input
            type="text"
            placeholder="Search by room Id"
            value={search}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <ul className={styles.userList}>
            {roomIds.length > 0 &&
              roomIds
                .filter((roomId) => roomId.includes(search))
                .map((roomId) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {img}
                    <li
                      style={{
                        backgroundColor:
                          roomId === selectedRoom ? "#D3D3D3" : "white",
                      }}
                      key={roomId}
                      onClick={() => handleUserClick(roomId)}
                      className={styles.userItem}
                    >
                      {roomId}
                    </li>
                  </div>
                ))}
          </ul>
        </div>
        <div className={styles.conversation}>
          {!selectedRoom && (
            <div style={{ marginTop: "15vw", color: "red", margin: "auto" }}>
              Please select a room!
            </div>
          )}
          {selectedRoom && (
            <div className={styles.messages}>
              {isLoading && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                  }}
                >
                  <img
                    src="https://i.gifer.com/ZKZg.gif"
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                    alt="Loading..."
                  />
                </div>
              )}
              {!isLoading &&
                messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      display: msg.from === "client" ? "flex" : "block",
                      gap: "4px",
                      overflowX: "hidden",
                      textAlign: msg.from === "admin" ? "right" : "left",
                      marginLeft: msg.from === "admin" ? "auto" : "0",
                      margin: "5px",
                    }}
                  >
                    {msg.from === "client" && img}

                    <div
                      style={{
                        maxWidth: "60%",
                        wordBreak: "break-word",
                        display: "inline-block",
                        padding: "10px",
                        textAlign: msg.from === "admin" ? "right" : "left",
                        backgroundColor:
                          msg.from === "admin" ? "#EEF5FF" : "#d0fff9",
                      }}
                    >
                      <span>
                        {msg.from === "client" ? "Client" : "You"}:{" "}
                        {msg.message}
                      </span>
                    </div>
                    {msg.from === "client" && msg.message === "/end" && (
                      <div
                        style={{
                          textAlign: "center",
                          fontStyle: "italic",
                          color: "red",
                          padding: "10px",
                          paddingTop: "2rem",
                        }}
                      >
                        User has ended this conversation!
                      </div>
                    )}
                  </div>
                ))}
              <div ref={messageEndRef} />
            </div>
          )}
          {selectedRoom && (
            <div className={styles.messageInput}>
              <input
                type="text"
                placeholder="Type and enter"
                value={newMessage}
                onKeyDown={handleKeyDown} // Listens for the Enter key press
                onChange={(e) => setNewMessage(e.target.value)}
                className={styles.input}
              />
              <button className={styles.sendButton}>
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  onClick={handleSendMessage}
                  className={styles.icon}
                  style={{ color: "white", fontSize: "1.5rem" }}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Chatbox);
