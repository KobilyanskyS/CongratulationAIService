from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from app.database import get_session
from app.models import User, FeedBack
from app.schemas import CongratulationSchema
from app.services import generate_congratulation

router = APIRouter()

@router.post("/generate_congratulation")
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

@router.post("/claim_feedback")
def claim_phone(feedback: FeedBack, session: Session = Depends(get_session)):
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    return {"message": "Отзыв сохранён"}

@router.get("/robots.txt", response_class=PlainTextResponse)
async def robots():
    data = "User-agent: *\nDisallow /"
    return data