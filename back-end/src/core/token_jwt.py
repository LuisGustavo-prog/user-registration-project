from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from jose import jwt
import os

load_dotenv()

TOKEN_SECRET_KEY = os.getenv('TOKEN_SECRET_KEY')
ALGORITHM = 'HS256'

def creating_token(data: dict):
    payload = data.copy()

    deadline_to_expires = datetime.now(timezone.utc) + timedelta(minutes=30)

    payload['exp'] = deadline_to_expires 

    return jwt.encode(claims=payload, key=TOKEN_SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    return jwt.decode(token=token, key=TOKEN_SECRET_KEY, algorithms=[ALGORITHM])
