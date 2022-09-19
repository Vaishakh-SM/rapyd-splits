import http from "http";
import { Server, Socket } from "socket.io";
import crypto from "crypto";
import prisma from "./db/prisma";
import superagent from "superagent";
import CryptoJS from "crypto-js";
import { makeRequest } from "./utils";

export default function useSocketPath(server: http.Server) {
  const roomStore = new Map<string, { [key: string]: any }>();
  const userRoom = new Map();
  const transactionStore = new Map<string, any>();

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["*"],
    },
  });

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

          io.to(socket.id).emit("join-room-success", roomId, nickname);
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
    socket.on(
      "choose-amount",
      (amount, card_number, expiration_month, expiration_year, cvv, name) => {
        if (userRoom.has(socket.id)) {
          let roomId = userRoom.get(socket.id);
          let roomState = roomStore.get(roomId);

          if (roomState !== undefined) {
            roomState[socket.id]["amount"] = amount;
            roomState[socket.id]["ready"] = true;
            roomStore.set(roomId, roomState);
          } else {
            console.log("Error! Roomstate undefined in amount chosen");
          }

          let transactionState = transactionStore.get(roomId) as any;

          if (transactionState !== undefined) {
            transactionState.set(socket.id, {
              amount: amount,
              number: card_number,
              expiration_month: expiration_month,
              expiration_year: expiration_year,
              cvv: cvv,
              name: name,
            });

            transactionStore.set(roomId, transactionState);
          } else {
            transactionState = new Map<string, any>();
            transactionState.set(socket.id, {
              amount: amount,
              number: card_number,
              expiration_month: expiration_month,
              expiration_year: expiration_year,
              cvv: cvv,
              name: name,
            });
            transactionStore.set(roomId, transactionState);
          }

          io.to(roomId).emit("update-room", roomStore.get(roomId));
        }
      }
    );
  }

  function onPay(socket: Socket) {
    socket.on("pay", async () => {
      if (userRoom.has(socket.id)) {
        let roomId = userRoom.get(socket.id);
        io.to(roomId).emit("payment-redirect-start");

        const room = await prisma.room.findUnique({
          where: { id: roomId },
        });

        const totalAmount = room?.amount;

        let amount = 0;

        let transactionState = transactionStore.get(roomId);

        if (transactionState !== undefined) {
          transactionState.forEach((value: any, key: any, map: any) => {
            // Check is amount is an integer
            amount += Number(value["amount"]);
          });

          if (amount == totalAmount) {
            // RAPYD REQUEST

            let reqBody = { payments: [] as any };

            transactionState.forEach((value: any, key: any, map: any) => {
              // Check is amount is an integer
              let obj = {
                amount: Number(value["amount"]),
                ewallets: [
                  {
                    ewallet: room?.eWallet,
                  },
                ],
                currency: "INR",
                capture: true,
                payment_method: {
                  type: "in_visa_credit_card",
                  fields: {
                    number: value["number"],
                    expiration_month: value["expiration_month"],
                    expiration_year: value["expiration_year"],
                    cvv: value["cvv"],
                    name: value["name"],
                  },
                },
                payment_method_options: {
                  "3d_required": true,
                },
                error_payment_url: "https://rapydsplits.live/failure",
                complete_payment_url: "https://rapydsplits.live/success",
                metadata: {
                  socket_id: key,
                },
              };

              reqBody["payments"].push(obj);
            });

            // const salt = "dfsgsg";
            // const timestamp = Math.round(
            //   new Date().getTime() / 1000
            // ).toString(); // Current Unix time (seconds).
            // const access_key = process.env.RAPYD_ACCESS; // The access key from Client Portal.
            // const secret_key = process.env.RAPYD_SECRET; // Never transmit the secret key by itself.
            // const url_path = "/v1/data/countries"; // Portion after the base URL.
            // // Hardkeyed for this example.
            // const http_method = "post"; // get|put|post|delete - must be lowercase.
            // const data = JSON.stringify(reqBody);

            // const to_sign =
            //   http_method +
            //   url_path +
            //   salt +
            //   timestamp +
            //   access_key +
            //   secret_key +
            //   data;

            // let signature = CryptoJS.enc.Hex.stringify(
            //   CryptoJS.HmacSHA256(to_sign, secret_key as any)
            // );

            // signature = CryptoJS.enc.Base64.stringify(
            //   CryptoJS.enc.Utf8.parse(signature)
            // );
            // console.log("Req body is", JSON.stringify(reqBody));
            // console.log("Salt is ", salt);
            // const base_uri = "https://sandboxapi.rapyd.net/v1";
            // superagent
            //   .post(`${base_uri}/payments/group_payments`)
            //   .send(data) // sends a JSON post body
            //   .set("access_key", process.env.RAPYD_ACCESS as string)
            //   .set("salt", salt)
            //   .set("timestamp", timestamp)
            //   .set("signature", signature)
            //   .set("Content-Type", "application/json")

            //   .end((err, res) => {
            //     // Calling the end function will send the request
            //     console.log(res);
            //     console.log(err);
            //   });
            console.log("Sending req!");
            console.log(JSON.stringify(reqBody, null, 4));
            try {
              const {
                body: { data },
              } = await makeRequest(
                "POST",
                "/v1/payments/group_payments",
                reqBody
              );
              console.log(JSON.stringify(data, null, 4));

              data["payments"].forEach((payment: any) => {
                io.to(payment["metadata"]["socket_id"]).emit(
                  "payment-redirect",
                  {
                    message: "Done",
                    redirect_url: payment["redirect_url"],
                  }
                );
              });
            } catch (e) {
              console.log(e);
            }

            // io.to(socket.id).emit("payment-status", {
            //   message: "Done",
            // });
          } else {
            console.log("total", totalAmount, "calculated", amount);
            io.to(socket.id).emit("payment-status", {
              message: "Transaction amount do not add up",
            });
          }
        } else {
          io.to(socket.id).emit("payment-status", {
            message: "No transactions available",
          });
        }
      } else {
        io.to(socket.id).emit("payment-status", {
          message: "You are not in a room",
        });
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

    onJoinRoom(socket);

    onAmountChosen(socket);
    onPay(socket);
    onConfirmed(socket);
  });
}
