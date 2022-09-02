from os import access
from socket import socket
from tkinter import Entry
from fastapi import FastAPI, Form
from .config import settings
from starlette.middleware.cors import CORSMiddleware
from fastapi_socketio import SocketManager
import motor.motor_asyncio
import uuid
import socketio

client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongodb_url)
db = client.hackathon

room_store = set()
# REPLACE WITH REDIS/MONGO

app = FastAPI()

origins = [
    "http://localhost:5173", "http://localhost:3000", "http://localhost:3001"
]

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# sio = SocketManager(app=app)
# sio = socketio.AsyncServer(async_mode='asgi')
sio = socketio.Server()


@app.post("/api/generate")
async def generate_url(e_wallet: str, amount: str):

    entry = {"wallet_id": e_wallet, "amount": amount}

    new_transaction = await db["transactions"].insert_one(entry)

    # See what to return
    return new_transaction.inserted_id


@app.post("/api/initiate")
async def initiate_group_payment(e_wallet: str, amount: str):
    pass


@sio.on('c')
async def create_room(sid, *args, **kwargs):

    print("Creatinf room")
    room_id = uuid.uuid1()

    while room_id not in room_store:
        room_id = uuid.uuid1()

    sio.enter_room(sid, room_id)

    print("Emitted create-room-success")
    await sio.emit('create-room-success', room_id)


# Create socket kinda thing (private room)