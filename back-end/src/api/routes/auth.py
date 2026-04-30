from fastapi import APIRouter
from src.api.schemas.user_schemas import CreateUser, Login
from src.database.repository import create_user, login_user
from src.core.token_jwt import creating_token

auth_router = APIRouter()

@auth_router.post('/register')
async def register(data: CreateUser):
    user = await create_user(
        name=data.name,
        email=data.email,
        telephone=data.telephone,
        password=data.password
    )

    return user

@auth_router.post('/login')
async def login(data: Login):
    user = await login_user(email=data.email, password=data.password)

    token = creating_token(data={'id': user['id']})

    return {'token': token}
