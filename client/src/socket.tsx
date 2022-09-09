import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:4001";
// const ENDPOINT = "http://127.0.0.1:3001";
// const ENDPOINT = "http://192.168.43.44:4001";
// Set your network endpoint

if (ENDPOINT === null) console.log("Set your network endpoint in socket.js");

export let socket = socketIOClient(ENDPOINT);

export function createRoom() {
  console.log("Socket is: ", socket);
  socket.emit("create-room");

  socket.once("create-room-success", (roomId: string) => {
    localStorage.setItem("roomId", roomId);
    console.log("CREATED:", roomId);

    // setRoomId(socket.roomId);
    // socket.emit("host-fetch-components");
    // socket.off("create-room-success");
  });
}

export function joinRoom(roomId: string) {
  console.log("Emmiting for room id ", roomId);
  socket.emit("join-room", roomId);

  socket.once("join-room-success", (roomId: string) => {
    localStorage.setItem("roomId", roomId);
    console.log("JOINED:", roomId);

    // setRoomId(socket.roomId);
    // socket.emit("host-fetch-components");
  });
}

export function joinListener(ev?: () => void) {
  socket.on("new-join", (roomId: string) => {
    console.log("Someone joined the room", roomId);
	if (ev) {
		ev()
	}
  });
}
