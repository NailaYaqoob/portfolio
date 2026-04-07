import os
import smtplib
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from http.server import BaseHTTPRequestHandler

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL", SMTP_USER)


class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))

            name = body.get("name", "").strip()
            email = body.get("email", "").strip()
            service = body.get("service", "Not specified").strip()
            message = body.get("message", "").strip()

            if not name or not email or not message:
                self._respond(400, {"error": "Name, email, and message are required."})
                return

            if not SMTP_USER or not SMTP_PASS:
                self._respond(500, {"error": "Email service not configured."})
                return

            subject = f"Portfolio Inquiry from {name}"
            body_text = f"""New contact form submission from your portfolio:

Name:    {name}
Email:   {email}
Service: {service}

Message:
{message}""".strip()

            msg = MIMEMultipart()
            msg["From"] = SMTP_USER
            msg["To"] = RECEIVER_EMAIL
            msg["Reply-To"] = email
            msg["Subject"] = subject
            msg.attach(MIMEText(body_text, "plain"))

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASS)
                server.sendmail(SMTP_USER, RECEIVER_EMAIL, msg.as_string())

            self._respond(200, {"message": "Email sent successfully."})

        except Exception as e:
            self._respond(500, {"error": str(e)})

    def _respond(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass
