import bcrypt
from bson import ObjectId
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from config.database import rolesCollection, userCollection
from models.UserModel import User, UserLogin, UserOut

async def getAllUsers():
    users = await userCollection.find().to_list()
    if not users:
        return JSONResponse(status_code=404, content={"detail": "No users found"})
    
    for user in users:
        user = await getRoleData(user)
    
    return [UserOut(**user) for user in users]

async def addUser(user: User):
    """ Registers a new user with hashed password. """
    existing_user = await userCollection.find_one({"email": user.email})
    
    if existing_user:
        return JSONResponse(status_code=400, content={"message": "User already exists"})

    hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    user_data = user.dict()
    user_data["password"] = hashed_password  # Store hashed password
    
    result = await userCollection.insert_one(user_data)
    return {"message": "User registered successfully", "user_id": str(result.inserted_id)}

async def loginUser(req: UserLogin):
    """ Authenticates user with bcrypt password verification. """
    print("Login request received:", req.email)

    foundUser = await userCollection.find_one({"email": req.email})
    
    if not foundUser:
        return JSONResponse(status_code=404, content={"message": "User not found"})

    stored_password = foundUser.get("password")

    if not stored_password:
        return JSONResponse(status_code=401, content={"message": "Invalid credentials"})

    # Ensure stored password is bytes before comparison
    if isinstance(stored_password, str):
        stored_password = stored_password.encode("utf-8")

    # Validate password
    if bcrypt.checkpw(req.password.encode("utf-8"), stored_password):
        foundUser = await getRoleData(foundUser)
        return JSONResponse(status_code=200, content=UserOut(**foundUser).dict())

    return JSONResponse(status_code=401, content={"message": "Incorrect password"})

async def getUserById(id: str):
    """ Fetches user details by ID. """
    user = await userCollection.find_one({"_id": ObjectId(id)})
    if user:
        user = await getRoleData(user)
        return JSONResponse(status_code=200, content=UserOut(**user).dict())

    raise HTTPException(status_code=404, detail=f"User with id {id} not found")

async def deleteUserById(id: str):
    """ Deletes a user by ID. """
    user = await userCollection.delete_one({"_id": ObjectId(id)})
    if user.deleted_count == 1:
        return {"message": "User deleted successfully"}

    raise HTTPException(status_code=404, detail=f"User with id {id} not found")

async def getUserByRoleId(roleId: str):
    """ Fetches users by Role ID. """
    users = await userCollection.find({"roleId": ObjectId(roleId)}).to_list()
    if not users:
        return JSONResponse(status_code=404, content={"message": "No users found for this role"})

    for user in users:
        user = await getRoleData(user)

    return [UserOut(**user) for user in users]

async def getRoleData(user):
    """ Fetches role details for a user. """
    if "roleId" in user:
        role = await rolesCollection.find_one({"_id": ObjectId(user["roleId"])})
        user["role"] = {"name": role["name"]} if role else None
    else:
        user["role"] = None
    return user
