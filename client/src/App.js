import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";

import "primereact/resources/themes/saga-green/theme.css"; // PrimeReact theme
import "primereact/resources/primereact.min.css"; // PrimeReact core styles
import "primeicons/primeicons.css"; // PrimeIcons

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const toast = useRef(null);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
      toast.current.show({
        severity: "success",
        summary: "Room Joined",
        detail: `You joined room ${room}`,
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Username and Room ID are required!",
        life: 3000,
      });
    }
  };

  return (
    <div className="App">
      <Toast ref={toast} />
      {!showChat ? (
        <Card
          className="joinChatContainer animated-card"
          title={
            <div>
              <i className="pi pi-comments" style={{ marginRight: "0.5rem" }}></i>
              Join A Chat
            </div>
          }
          style={{
            width: "20rem",
            margin: "auto",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            animation: "fadeIn 1.2s ease-in-out",
          }}
        >
          <div className="p-field">
            <InputText
              placeholder="Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-inputtext-lg"
              style={{ marginBottom: "1rem", width: "100%" }}
              tooltip="Enter your username"
            />
          </div>
          <div className="p-field">
            <InputText
              placeholder="Room ID..."
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="p-inputtext-lg"
              style={{ marginBottom: "1rem", width: "100%" }}
              tooltip="Enter the Room ID to join"
            />
          </div>
          <Button
            label="Join A Room"
            onClick={joinRoom}
            icon="pi pi-sign-in"
            className="p-button-success p-button-lg p-button-rounded"
            style={{ width: "100%" }}
          />
        </Card>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
