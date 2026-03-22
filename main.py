import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL", SMTP_USER)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not SMTP_USER or not SMTP_PASS:
        print("⚠️  Warning: SMTP_USER or SMTP_PASS not set in .env")
    yield


app = FastAPI(title="Portfolio API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    service: str = ""
    message: str


@app.post("/api/contact")
async def contact(form: ContactForm):
    if not SMTP_USER or not SMTP_PASS:
        raise HTTPException(status_code=500, detail="Email service not configured.")

    subject = f"Portfolio Inquiry from {form.name}"

    body = f"""
New contact form submission from your portfolio:

Name:    {form.name}
Email:   {form.email}
Service: {form.service or "Not specified"}

Message:
{form.message}
    """.strip()

    msg = MIMEMultipart()
    msg["From"] = SMTP_USER
    msg["To"] = RECEIVER_EMAIL
    msg["Reply-To"] = form.email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, RECEIVER_EMAIL, msg.as_string())
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(status_code=500, detail="Email authentication failed. Check your Gmail App Password.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

    return {"message": "Email sent successfully."}


# Serve the static portfolio at root
app.mount("/", StaticFiles(directory=".", html=True), name="static")
