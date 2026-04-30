import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

EMAIL = os.getenv('EMAIL')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

def build_delete_email(code: str) -> str:
    return f"""
    <html>
    <body style="margin:0;padding:0;background:#f1efe8;font-family:sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
            <tr>
                <td align="center">
                    <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #d3d1c7;">
                        <tr>
                            <td style="background:#185FA5;padding:24px 32px;">
                                <p style="margin:0;font-size:18px;font-weight:500;color:#ffffff;">User Registration Project</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:32px;">
                                <p style="font-size:15px;font-weight:500;color:#2c2c2a;margin:0 0 8px;">Account deletion request</p>
                                <p style="font-size:14px;color:#5f5e5a;margin:0 0 24px;line-height:1.6;">We received a request to permanently delete your account. This action is irreversible and all your data will be lost.</p>
                                <p style="font-size:13px;color:#5f5e5a;margin:0 0 12px;">Use the code below to confirm:</p>
                                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1efe8;border-radius:8px;border:1px solid #d3d1c7;margin-bottom:24px;">
                                    <tr>
                                        <td align="center" style="padding:16px;">
                                            <p style="font-size:32px;font-weight:500;letter-spacing:10px;color:#2c2c2a;margin:0;">{code}</p>
                                        </td>
                                    </tr>
                                </table>
                                <table width="100%" cellpadding="0" cellspacing="0" style="background:#faeeda;border-radius:8px;border:1px solid #ef9f27;margin-bottom:24px;">
                                    <tr>
                                        <td style="padding:12px 16px;">
                                            <p style="font-size:13px;color:#633806;margin:0;">This code expires in <strong>10 minutes</strong>.</p>
                                        </td>
                                    </tr>
                                </table>
                                <p style="font-size:13px;color:#888780;margin:0;line-height:1.6;">If you did not request account deletion, please ignore this email. Your account will remain active.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="border-top:1px solid #d3d1c7;padding:16px 32px;">
                                <p style="font-size:12px;color:#888780;margin:0;text-align:center;">User Registration Project — this is an automated email, please do not reply.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

async def send_delete_confirmation(email: str, code: str) -> None:
    message = MIMEMultipart('alternative')
    message['Subject'] = 'Account deletion confirmation'
    message['From'] = EMAIL
    message['To'] = email

    message.attach(MIMEText(build_delete_email(code), 'html', 'utf-8'))

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(EMAIL, EMAIL_PASSWORD)
        server.sendmail(EMAIL, email, message.as_bytes())
        