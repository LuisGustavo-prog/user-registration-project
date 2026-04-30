from pydantic import BaseModel, EmailStr, field_validator

class CreateUser(BaseModel):
    name: str
    email: EmailStr
    telephone: str
    password: str

    @field_validator('password')
    def validate_password(cls, value):
        if len(value) > 72:
            raise ValueError('Password cannot be longer than 72 characters.')
        if len(value) < 8:
            raise ValueError('Password must be at least 8 characters.')
        return value
    
class UpdateName(BaseModel):
    new_name: str

class UpdatePhone(BaseModel):
    new_phone: str

class UpdateEmail(BaseModel):
    password: str
    new_email: EmailStr

class RequestDeleteUser(BaseModel):
    password: str

class ConfirmDeleteUser(BaseModel):
    code: str

class Login(BaseModel):
    email: EmailStr
    password: str

class UpdatePassword(BaseModel):
    old_password: str
    new_password: str
