from fastapi import APIRouter
from src.api.schemas.user_schemas import CreateUser, Login
from src.database.repository import create_user, login_user
from src.core.token_jwt import creating_token
from src.api.schemas.user_schemas import CreateUser, Login, RequestResetPassword, ConfirmResetPassword
from src.database.repository import create_user, login_user, request_reset_password, confirm_reset_password

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

@auth_router.post('/password/reset/request')
async def reset_password_request(data: RequestResetPassword):
    await request_reset_password(email=data.email)
    return {'message': 'Reset code sent to your email.'}

@auth_router.post('/password/reset/confirm')
async def reset_password_confirm(data: ConfirmResetPassword):
    await confirm_reset_password(email=data.email, code=data.code, new_password=data.new_password)
    return {'message': 'Password updated successfully.'}