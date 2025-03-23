import logging
from datetime import datetime, timezone
from fastapi import Request
from fastapi.responses import StreamingResponse, Response, JSONResponse

logging.basicConfig(
    filename="server.log",
    level=logging.INFO, 
    format="%(asctime)s - %(levelname)s - %(message)s",
    encoding="utf-8",
)
logger = logging.getLogger(__name__)

async def log_requests(request: Request, call_next):
    """ Логирование запросов и ответов """
    start_time = datetime.now(timezone.utc)

    body = await request.body()
    body_str = body.decode("utf-8") if body else "No body"

    logger.info(f"📥 Request: {request.client.host} | {request.method} {request.url} | Body: {body_str}")

    try:
        response = await call_next(request)
        process_time = (datetime.now(timezone.utc) - start_time).total_seconds()

        if isinstance(response, StreamingResponse):
            logger.info(f"📤 Streaming Response: {response.status_code} | Time: {process_time:.4f}s")
            return response

        response_body = b"".join([chunk async for chunk in response.body_iterator])
        response_text = response_body.decode("utf-8") if response_body else "No content"

        log_text = response_text if len(response_text) < 1000 else response_text[:1000] + "... [truncated]"
        logger.info(f"📤 Response: {response.status_code} | Time: {process_time:.4f}s | Body: {log_text}")

        new_response = Response(content=response_body, status_code=response.status_code, headers=dict(response.headers))
        return new_response

    except Exception as e:
        logger.error(f"❌ Error: {e}", exc_info=True)
        return JSONResponse(status_code=500, content={"error": "Internal Server Error"})