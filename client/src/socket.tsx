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

export function joinRoom(roomId: string, name: string) {
  console.log("Emmiting for room id ", roomId);
  socket.emit("join-room", { roomId: roomId, name: name });

  socket.once("join-room-success", (roomId: string, nickname: string) => {
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("nickname", nickname);
    console.log("JOINED:", roomId);

    // setRoomId(socket.roomId);
    // socket.emit("host-fetch-components");
  });
}

export function chooseAmount(
  amount: number,
  cardNumber: string,
  expiration_month: string,
  expiration_year: string,
  cardCvc: string,
  cardName: string
) {
  socket.emit(
    "choose-amount",
    amount,
    cardNumber,
    expiration_month,
    expiration_year,
    cardCvc,
    cardName
  );
}

export function pay() {
  socket.emit("pay");

  socket.once("payment-status", (message) => {
    console.log(message);
  });
}

export function updateListener(setRoom: (roomState: any) => void) {
  socket.on("update-room", (roomState) => {
    let roomStateUpdate = [];
    for (let i of Object.keys(roomState)) {
      roomStateUpdate.push(roomState[i]);
    }
    console.log(roomStateUpdate);
    setRoom(roomStateUpdate);
  });
}
