from src.core.token_jwt import decode_token
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from src.api.schemas.user_schemas import UpdateName, UpdatePhone, UpdateEmail, UpdatePassword, RequestDeleteUser, ConfirmDeleteUser
from src.database.repository import get_user, update_name, update_phone, update_email, update_password, request_delete_user, confirm_delete_user

user_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login')

@user_router.get('/')
async def get_user_data(token: str = Depends(oauth2_scheme)):
    token_decode = decode_token(token)
    return await get_user(id=token_decode['id'])

@user_router.patch('/name')
async def change_name(data: UpdateName, token: str = Depends(oauth2_scheme)):
    return await update_name(token=token, new_name=data.new_name)

@user_router.patch('/phone')
async def change_phone(data: UpdatePhone, token: str = Depends(oauth2_scheme)):
    return await update_phone(token=token, new_phone=data.new_phone)

@user_router.patch('/email')
async def change_email(data: UpdateEmail, token: str = Depends(oauth2_scheme)):
    return await update_email(token=token, new_email=data.new_email, password=data.password)

@user_router.patch('/password')
async def change_password(data: UpdatePassword, token: str = Depends(oauth2_scheme)):
    return await update_password(token=token, old_password=data.old_password, new_password=data.new_password)

@user_router.post('/delete/request')
async def delete_request(data: RequestDeleteUser, token: str = Depends(oauth2_scheme)):
    return await request_delete_user(token=token, password=data.password)

@user_router.post('/delete/confirm')
async def delete_confirm(data: ConfirmDeleteUser, token: str = Depends(oauth2_scheme)):
    return await confirm_delete_user(token=token, code=data.code)
