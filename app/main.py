from os import access
from fastapi import FastAPI, Form
from .config import settings
from starlette.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import motor.motor_asyncio

app = FastAPI()
client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongodb_url)
db = client.hackathon

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/generate")
async def authorize_mediavalet(e_wallet: str = Form(), amount: str = Form()):

    print(f"FAf: {e_wallet}")

    trial_json = {"wallet_id": "afasfasfaf"}

    new_student = await db["transactions"].insert_one(trial_json)
    created_student = await db["transactions"].find_one(
        {"_id": new_student.inserted_id})

    print(created_student)
    print(f"New student is {new_student}, type: {type(new_student)}")
