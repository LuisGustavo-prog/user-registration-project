from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI') 

client = AsyncIOMotorClient(MONGO_URI)
db = client['user_registration_db']
users_collection = db['users']

async def connect_db():
    try:
        await client.admin.command('ping')
        return True
    except Exception as e:
        print(f'Erro ao conectar ao banco. {e}')
        raise
