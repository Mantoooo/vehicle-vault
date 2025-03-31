from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId

class Car(BaseModel):
    Brand: str
    name: str
    model: str
    price: float
    engine_type: str
    cylinders: int
    mileage_city: int
    mileage_highway: int
    length: int
    width: int
    height: int
    ground_clearance: int
    body_type: str
    power_steering: bool
    ACC: bool

class CarOut(Car):
    id: str = Field(alias="_id")  # Convert ObjectId to string

    model_config = ConfigDict(arbitrary_types_allowed=True)

    @classmethod
    def convert_Objectid(cls, v):
        return str(v) if isinstance(v, ObjectId) else v

    def model_dump(self, **kwargs):
        data = super().model_dump(**kwargs)
        data["id"] = self.convert_Objectid(data["_id"])
        return data
