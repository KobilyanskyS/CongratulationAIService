from pydantic import BaseModel

class CongratulationSchema(BaseModel):
    name: str
    holiday: str
    description: str = None
    style: str
