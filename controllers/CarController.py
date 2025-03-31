from bson import ObjectId

from config.database import carsCollection
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from models.CarModel import Car, CarOut


async def getAllCars():
    cars = await carsCollection.find().to_list()
    if len(cars) == 0:
        return JSONResponse(status_code=404, content={"message": "No car found"})
    return [CarOut(**category) for category in cars]


async def getCarById(id: str):
    car = await carsCollection.find_one({"_id": ObjectId(id)})
    if car:
        return JSONResponse(status_code=200, content=CarOut(**car).dict())
    else:
        raise HTTPException(
            status_code=404, content={"message": "Car with id {id} not found"}
        )


async def addCar(car: Car):
    newCar = await carsCollection.insert_one(car.dict())
    if newCar.inserted_id:
        return JSONResponse(status_code=200, content=car.dict())
    raise HTTPException(status_code=500, detail="Car doesnot added..")


async def deleteCarById(id: str):
    deleteCar = await carsCollection.delete_one({"_id": ObjectId(id)})
    if deleteCar.deleted_count == 1:
        return {"message": "Car deleted successfully"}
    else:
        raise HTTPException(
            status_code=404, content={"message": "Car with id {id} not found"}
        )
