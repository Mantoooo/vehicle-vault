from fastapi import FastAPI
from routes.RoleRoutes import router as role_router
from routes.CarRoutes import router as car_router
from fastapi.middleware.cors import CORSMiddleware
from routes.UserRoutes import router as User_router

app = FastAPI()
origins = [
    "http://localhost:5173",
      "http://127.0.0.1:5173"  # React frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(role_router)
app.include_router(car_router)
app.include_router(User_router)

@app.get("/")
def home():
    return {"message": "CORS enabled successfully!"}