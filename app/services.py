import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langchain_gigachat.chat_models import GigaChat

load_dotenv()

giga = GigaChat(
    credentials=os.getenv('GIGA_CHAT_API_KEY'),
    verify_ssl_certs=False,
)

def generate_congratulation(info):
    message_content = f"""
    Напиши поздравление для: {info.name}
    Поздравь с праздником: {info.holiday}
    Дополнительная информация о {info.name}: {info.description or ''}
    Стиль общения: {info.style}
    """
    
    response = giga.invoke([HumanMessage(content=message_content)])
    return {"congratulation": response.content}
