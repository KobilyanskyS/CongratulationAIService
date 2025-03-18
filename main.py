import os
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from langchain_gigachat.chat_models import GigaChat
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Подключаем GigaChat
giga = GigaChat(
    credentials=os.getenv('GIGA_CHAT_API_KEY'),
    verify_ssl_certs=False,
)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Определяем модель данных для входящего запроса
class Info(BaseModel):
    name: str
    holiday: str
    description: str | None = None
    style: str

@app.post("/generate-congratulation")
async def generate_congratulation(info: Info):
    """
    Генерируем поздравление для указанного имени и праздника.
    """

    message_content = f"""
    Напиши поздравление для: {info.name}
    Поздравь с праздником: {info.holiday}
    Дополнительная информация о {info.name}: {info.description or ''}
    Стиль общения: {info.style}
    """
    
    response = giga.invoke([HumanMessage(content=message_content)])
    
    return {"congratulation": response.content}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)