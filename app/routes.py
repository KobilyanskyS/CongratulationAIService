from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_session
from app.models import User
from app.schemas import CongratulationSchema
from app.services import generate_congratulation

router = APIRouter()

@router.post("/generate-congratulation")
async def generate(info: CongratulationSchema):
    return generate_congratulation(info)

@router.post("/claim_phone")
def claim_phone(user: User, session: Session = Depends(get_session)):
    existing_user = session.query(User).filter(User.phone == user.phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail={"message": "Телефон уже зарегистрирован"})

    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "Телефон сохранён"}

@router.post("/claim_email")
def claim_email(user: User, session: Session = Depends(get_session)):
    existing_user = session.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail={"message": "Email уже зарегистрирован"})

    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "Email сохранён"}