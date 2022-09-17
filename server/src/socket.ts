import http from "http";
import { Server, Socket } from "socket.io";
import crypto from "crypto";
import prisma from "./db/prisma";

export default function useSocketPath(server: http.Server) {
  const roomStore = new Map<string, { [key: string]: any }>();
  const userRoom = new Map();

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["*"],
    },
  });

  // function onCreateRoom(socket: Socket) {
  //   socket.on("create-room", () => {
  //     try {
  //       let roomId = crypto.randomBytes(16).toString("hex").substring(0, 8);

  //       while (roomStore.has(roomId))
  //         roomId = crypto.randomBytes(16).toString("hex").substring(0, 8);

  //       roomStore.add(roomId);

  //       socket.join(roomId);
  //       io.to(roomId).emit("create-room-success", roomId);
  //     } catch (e) {
  //       console.log("Error while creating room: ", e);
  //       io.to(socket.id).emit("create-room-fail");
  //     }
  //   });
  // }

  function onJoinRoom(socket: Socket) {
    socket.on("join-room", async ({ roomId, name }) => {
      try {
        const room = await prisma.room.findUnique({
          where: { id: roomId },
        });

        if (room === null || room?.status !== "PENDING") {
          io.to(socket.id).emit("join-room-fail", {
            message: "Room does not exist or room has finished transaction",
          });
        } else {
          let roomState = roomStore.get(roomId);
          let nickname =
            name + "#" + crypto.randomBytes(16).toString("hex").substring(0, 2);

          if (roomState === undefined) {
            roomState = {
              [socket.id]: { nickname: nickname, amount: 0, ready: false },
            };
          } else {
            roomState[socket.id] = {
              nickname: nickname,
              amount: 0,
              ready: false,
            };
          }

          roomStore.set(roomId, roomState);

          userRoom.set(socket.id, roomId);

          io.to(socket.id).emit("join-room-success", roomId);
          socket.join(roomId);

          io.to(roomId).emit("new-join");
          io.to(roomId).emit("update-room", roomStore.get(roomId));
        }
      } catch (e) {
        console.log("Error while joining room: ", e);
        io.to(socket.id).emit("join-room-fail", {
          message: "Unknown fatal error",
        });
      }
    });
  }

  function onAmountChosen(socket: Socket) {
    socket.on("choose-amount", (amount) => {
      if (userRoom.has(socket.id)) {
        let roomId = userRoom.get(socket.id);
        let roomState = roomStore.get(roomId);

        if (roomState !== undefined) {
          roomState[socket.id]["amount"] = amount;
          roomStore.set(roomId, roomState);
        } else {
          console.log("Error! Roomstate undefined in amount chosen");
        }

        io.to(roomId).emit("update-room", roomStore.get(roomId));
      }
    });
  }

  function onConfirmed(socket: Socket) {
    socket.on("confirm", () => {
      if (userRoom.has(socket.id)) {
        let roomId = userRoom.get(socket.id);
        let roomState = roomStore.get(roomId);

        if (roomState !== undefined) {
          roomState[socket.id]["ready"] = false;
          roomStore.set(roomId, roomState);
        } else {
          console.log("Error! Roomstate undefined in amount chosen");
        }

        io.to(roomId).emit("update-room", roomStore.get(roomId));
      }
    });
  }

  io.on("connection", (socket) => {
    console.log(socket.id + " connected ");

    // onCreateRoom(socket);

    onJoinRoom(socket);

    onAmountChosen(socket);

    onConfirmed(socket);
  });
}
