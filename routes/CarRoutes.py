from controllers import CarController
from fastapi import APIRouter
from models.CarModel import Car

router = APIRouter()


@router.get("/cars")
async def getAllCars():
    return await CarController.getAllCars()


@router.get("/car/{id}")
async def getCarById(id: str):
    return await CarController.getCarById(id)


@router.post("/car")
async def addCar(car: Car):
    return await CarController.addCar(car)


@router.delete("/car/{id}")
async def deleteCarById(id: str):
    return await CarController.deleteCarById(id)
