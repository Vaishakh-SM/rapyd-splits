import http from "http";
import { Server, Socket } from "socket.io";
import crypto from "crypto";
import prisma from "./db/prisma";

export default function useSocketPath(server : http.Server){

    const roomStore = new Set();
    const userStore = new Map();

    const io = new Server(server, {
        cors: {
          origin: "*",
          methods: ["*"],
        },
      });

      function onCreateRoom(socket: Socket) {
        socket.on("create-room", () => {
        try{
          let roomId = crypto.randomBytes(16).toString("hex").substring(0, 8);
      
          while (roomStore.has(roomId))
            roomId = crypto.randomBytes(16).toString("hex").substring(0, 8);
      
          roomStore.add(roomId);
      
          socket.join(roomId);
          io.to(roomId).emit("create-room-success", roomId);

        } catch(e) {
            console.log("Error while creating room: ", e);
            io.to(socket.id).emit('create-room-fail');
        }

        });
      }
      
      function onJoinRoom(socket: Socket) {
        socket.on("join-room", (roomId) => {
        try{
          if (roomStore.has(roomId)) {
            userStore.set(socket.id, {roomId:roomId, amount:"nan"})
      
            io.to(socket.id).emit("join-room-success", roomId);
            socket.join(roomId);
      
            io.to(roomId).emit("new-join");
          } else {
            io.to(socket.id).emit("join-room-fail" , ({message: "Room does not exist"}));
          }
        }catch(e){
            console.log("Error while joining room: ",e);
            io.to(socket.id).emit("join-room-fail" , ({message: "Unknown fatal error"}));
        }
        });
      }
      
      function onAmountChosen(socket: Socket) {
        socket.on("choose-amount", (amount) => {
          let initialData = userStore.get(socket.id);
          let newData = initialData["amount"] = amount;
          let roomId = userStore.get(socket.id)["roomId"]
          userStore.set(socket.id, newData);
      
          io.to(roomId).emit("amount-chosen", (socket.id, amount));
        });
      }
      
      
      function onConfirmed(socket: Socket) {
        socket.on("confirm", (amount) => {

          // Store this amount in DB and use it

          // if amount is -1 give error
          
          let roomId = userStore.get(socket.id)["roomId"]
      
      
          io.to(roomId).emit("confirmed", (socket.id));
        });
      }
      
      io.on("connection", (socket) => {
        console.log(socket.id + " connected ");
      
        onCreateRoom(socket);
      
        onJoinRoom(socket);
      });
}