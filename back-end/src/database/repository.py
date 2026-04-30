from src.core.security_password import creating_hash, authenticate_password, change_password
from src.core.token_jwt import decode_token
from src.database.connection import users_collection
from src.core.generate_id import generate_id
from src.utils.email import send_delete_confirmation
from datetime import datetime, timezone
import random

async def _get_full_user(id: str = None, email: str = None) -> dict:
    try:
        if id is not None:
            return await users_collection.find_one({'id': id})
        elif email is not None:
            return await users_collection.find_one({'email': email})
    except Exception as e:
        raise Exception(f'Error searching for user. {e}')

async def create_user(name: str, email: str, telephone: str, password: str):
    password_hash = creating_hash(password=password)

    data = {
        'id': generate_id(),
        'name': name,
        'email': email,
        'telephone': telephone,
        'password': password_hash,
        'created_at': datetime.now(timezone.utc),
        'is_active': True
    }

    try:
        await users_collection.insert_one(data)
        data.pop('_id', None)
        return data
    except Exception as e:
        raise Exception(f'Error creating user: {e}')

async def login_user(email: str, password: str):
    user = await _get_full_user(email=email)

    if not user:
        raise Exception('Invalid email error.')
    
    if not user['is_active']:
        raise Exception('Account is disabled.')
    
    valid_password = authenticate_password(password=password, hashed_password=user['password'])

    if not valid_password:
        raise Exception('Invalid password error.')
    
    return user

async def get_user(id: str = None, email: str = None) -> dict:
    try:
        if id is not None:
            user = await users_collection.find_one({'id': id})
        elif email is not None:
            user = await users_collection.find_one({'email': email})
        
        if user:
            user.pop('_id', None)
            user.pop('password', None)
        
        return user
    except Exception as e:
        raise Exception(f'Error searching for user. {e}')
        
async def update_name(token: str, new_name: str):
    token_decode = decode_token(token)

    if not token_decode:
        raise Exception('Invalid or expired token.')

    try:
        await users_collection.update_one({'id': token_decode['id']}, {'$set': {'name': new_name}})

        return await get_user(id=token_decode['id'])
    except Exception as e:
        raise Exception(f'Error updating username. {e}')
    
async def update_phone(token: str, new_phone: str):
    token_decode = decode_token(token=token)

    if not token_decode:
        raise Exception('Invalid or expired token.')

    try:
        await users_collection.update_one({'id': token_decode['id']}, {'$set': {'telephone': new_phone}})

        return await get_user(id=token_decode['id'])
    except Exception as e:
        raise Exception(f'Error updating user phone. {e}')

async def update_email(token: str, new_email: str, password: str):
    token_decode = decode_token(token=token)

    if not token_decode:
        raise Exception('Invalid or expired token.')

    user = await _get_full_user(id=token_decode['id'])
    correct_password = authenticate_password(password=password, hashed_password=user['password'])
    
    if not correct_password:
        raise Exception('Invalid password.')
    
    try:
        await users_collection.update_one({'id': token_decode['id']}, {'$set': {'email': new_email}})

        return await get_user(id=token_decode['id'])
    except Exception as e:
        raise Exception(f'Error updating users email. {e}')

async def update_password(token: str, old_password: str, new_password: str):
    token_decode = decode_token(token)

    if not token_decode:
        raise Exception('Invalid or expired token.')
    
    user = await _get_full_user(id=token_decode['id'])

    if not user:
        raise Exception('User not found.')
    
    new_password = change_password(old_password=old_password, new_password=new_password, hashed_password=user['password'])
    try:
        await users_collection.update_one({'id': user['id']}, {'$set': {'password': new_password}})

        return True
    except Exception as e:
        raise Exception(f'Error updating password. {e}')

async def request_delete_user(token: str, password: str):
    token_decode = decode_token(token=token)

    if not token_decode:
        raise Exception('Invalid or expired token.')
    
    user = await _get_full_user(id=token_decode['id'])
    correct_password = authenticate_password(password=password, hashed_password=user['password'])

    if not correct_password:
        raise Exception('Invalid password.')
    
    account_deletion_code = random.randint(100000, 999999)
    await users_collection.update_one({'id': token_decode['id']}, {'$set': {'account_deletion_code': account_deletion_code}})

    await send_delete_confirmation(email=user['email'], code=account_deletion_code)
    
    return True

async def confirm_delete_user(token: str, code: str):
    token_decode = decode_token(token=token)

    if not token_decode:
        raise Exception('Invalid or expired token.')
    
    user = await get_user(id=token_decode['id'])
    code_confirmation = user['account_deletion_code']

    if str(code_confirmation) != code:
        raise Exception('Invalid code error.')

    try:
        await users_collection.update_one({'id': token_decode['id']}, {'$set': {'is_active': False}})
        return True        
    except Exception as e:
        raise Exception('Error validating code.')
    
