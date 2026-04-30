from fastapi import FastAPI
from src.api.routes.auth import auth_router
from src.api.routes.user import user_router

app = FastAPI()

app.include_router(auth_router, prefix='/auth', tags=['Auth'])
app.include_router(user_router, prefix='/user', tags=['User'])