import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from contextlib import asynccontextmanager

import aiosmtplib
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL") or SMTP_USER

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not SMTP_USER or not SMTP_PASS:
        print("⚠️  Warning: SMTP_USER or SMTP_PASS not set in .env")
    yield


app = FastAPI(title="Portfolio API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:8000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    service: str = ""
    message: str


@app.post("/api/contact")
@limiter.limit("3/hour")
async def contact(request: Request, form: ContactForm):
    if not SMTP_USER or not SMTP_PASS:
        raise HTTPException(status_code=500, detail="Email service not configured.")

    name = form.name.strip()[:100]
    message = form.message.strip()[:2000]
    service = form.service.strip()[:100] if form.service else "Not specified"

    if not name or not message:
        raise HTTPException(status_code=422, detail="Name and message cannot be empty.")

    subject = f"Portfolio Inquiry from {name}"

    body = f"""
New contact form submission from your portfolio:

Name:    {name}
Email:   {form.email}
Service: {service}

Message:
{message}
    """.strip()

    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = RECEIVER_EMAIL
    msg["Reply-To"] = form.email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        await aiosmtplib.send(
            msg,
            hostname=SMTP_HOST,
            port=SMTP_PORT,
            username=SMTP_USER,
            password=SMTP_PASS,
            start_tls=True,
        )
    except aiosmtplib.SMTPAuthenticationError:
        raise HTTPException(status_code=500, detail="Email authentication failed. Check your Gmail App Password.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

    return {"message": "Email sent successfully."}


# Serve the static portfolio at root
app.mount("/", StaticFiles(directory=".", html=True), name="static")
