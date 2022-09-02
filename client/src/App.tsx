import { useState } from "react";
import "./App.css";
import { createRoom, joinRoom } from "./socket";

function App() {
  const [count, setCount] = useState(0);
  const [roomId, setroomId] = useState("");

  return (
    <div className="App">
      <div className="card">
        <button
          onClick={() => {
            createRoom();
          }}
        >
          create room
        </button>
        <input
          value={roomId}
          onChange={(e) => {
            setroomId(e.currentTarget.value);
          }}
        ></input>
        <button
          onClick={() => {
            joinRoom(roomId);
          }}
        >
          join room
        </button>

        <button
          onClick={() => {
            console.log("Lol", count);
            setCount(count + 1);
          }}
        >
          say lolk
        </button>
      </div>
    </div>
  );
}

export default App;
