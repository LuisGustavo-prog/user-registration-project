from passlib.context import CryptContext

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

def creating_hash(password: str):
    return pwd_context.hash(password)

def authenticate_password(password: str, hashed_password: str):
    return pwd_context.verify(password, hashed_password)

def change_password(old_password: str, new_password: str, hashed_password: str):
    if not pwd_context.verify(old_password, hashed_password):
        raise ValueError('Incorrect current password.')
    
    return creating_hash(new_password)
