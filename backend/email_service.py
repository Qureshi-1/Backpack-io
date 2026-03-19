"""
Email sending via Resend API.
Uses plain httpx (no extra SDK needed).
"""
import httpx
from config import RESEND_API_KEY, FROM_EMAIL, FRONTEND_URL, APP_NAME
import logging

logger = logging.getLogger(__name__)


def send_email(to: str, subject: str, html: str) -> bool:
    """Send an email via Resend API. Returns True on success."""
    if not RESEND_API_KEY:
        logger.warning("⚠️  RESEND_API_KEY not set — skipping email send")
        return False
    try:
        resp = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": FROM_EMAIL,
                "to": [to],
                "subject": subject,
                "html": html,
            },
            timeout=10,
        )
        if resp.status_code >= 400:
            logger.error(f"❌ Resend API Error ({resp.status_code}): {resp.text}")
            return False
        
        logger.info(f"✅ Email sent to {to} | Response: {resp.text}")
        return True
    except Exception as e:
        logger.error(f"❌ Email exception: {e}")
        return False


def send_verification_email(to: str, token: str) -> bool:
    """Send the email verification link."""
    verify_url = f"{FRONTEND_URL}/auth/verify-email?token={token}"
    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                 background: #09090b; color: #e4e4e7; margin: 0; padding: 40px 20px;">
      <div style="max-width: 520px; margin: 0 auto; background: #18181b;
                  border: 1px solid #27272a; border-radius: 12px; padding: 40px;">

        <!-- Logo -->
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 32px;">
          <div style="width: 32px; height: 32px; background: #10b981;
                      border-radius: 8px; display: flex; align-items: center;
                      justify-content: center; font-weight: bold; color: black;">B</div>
          <span style="font-size: 18px; font-weight: 700; color: #fff;">Backport</span>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 8px;">
          Verify your email address
        </h1>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
          Thanks for signing up! Click the button below to verify your email and
          activate your Backport account. This link expires in <strong style="color:#e4e4e7">24 hours</strong>.
        </p>

        <!-- CTA Button -->
        <a href="{verify_url}"
           style="display: inline-block; background: #10b981; color: #000;
                  font-weight: 700; font-size: 15px; text-decoration: none;
                  padding: 12px 28px; border-radius: 8px; margin-bottom: 28px;">
          Verify Email →
        </a>

        <p style="color: #71717a; font-size: 13px; margin: 0 0 8px;">
          Or copy this link into your browser:
        </p>
        <p style="color: #10b981; font-size: 12px; word-break: break-all;
                  background: #0f172a; padding: 10px 12px; border-radius: 6px;
                  border: 1px solid #1e293b; margin: 0 0 28px;">
          {verify_url}
        </p>

        <hr style="border: none; border-top: 1px solid #27272a; margin: 0 0 20px;">
        <p style="color: #52525b; font-size: 12px; margin: 0;">
          If you didn't create a Backport account, you can safely ignore this email.<br>
          © 2026 Backport • MIT Licensed • Made with ❤️ in India
        </p>
      </div>
    </body>
    </html>
    """
    return send_email(to, f"Verify your {APP_NAME} email address", html)


def send_password_reset_email(to: str, token: str) -> bool:
    """Send a password reset link."""
    reset_url = f"{FRONTEND_URL}/auth/reset-password?token={token}"
    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                 background: #09090b; color: #e4e4e7; margin: 0; padding: 40px 20px;">
      <div style="max-width: 520px; margin: 0 auto; background: #18181b;
                  border: 1px solid #27272a; border-radius: 12px; padding: 40px;">

        <!-- Logo -->
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 32px;">
          <div style="width: 32px; height: 32px; background: #10b981;
                      border-radius: 8px; display: flex; align-items: center;
                      justify-content: center; font-weight: bold; color: black;">B</div>
          <span style="font-size: 18px; font-weight: 700; color: #fff;">Backport</span>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 8px;">
          Reset your Backport password
        </h1>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
          We received a request to reset the password for your Backport account.
          Click the button below to choose a new password. This link expires in <strong style="color:#e4e4e7">1 hour</strong>.
        </p>

        <!-- CTA Button -->
        <a href="{reset_url}"
           style="display: inline-block; background: #10b981; color: #000;
                  font-weight: 700; font-size: 15px; text-decoration: none;
                  padding: 12px 28px; border-radius: 8px; margin-bottom: 28px;">
          Reset Password →
        </a>

        <p style="color: #71717a; font-size: 13px; margin: 0 0 8px;">
          Or copy this link into your browser:
        </p>
        <p style="color: #10b981; font-size: 12px; word-break: break-all;
                  background: #0f172a; padding: 10px 12px; border-radius: 6px;
                  border: 1px solid #1e293b; margin: 0 0 28px;">
          {reset_url}
        </p>

        <hr style="border: none; border-top: 1px solid #27272a; margin: 0 0 20px;">
        <p style="color: #52525b; font-size: 12px; margin: 0;">
          If you didn't request a password reset, you can safely ignore this email.<br>
          © 2026 Backport • MIT Licensed • Made with ❤️ in India
        </p>
      </div>
    </body>
    </html>
    """
    return send_email(to, f"Reset your {APP_NAME} password", html)


def send_welcome_email(to: str, name: str = "") -> bool:
    """Send a welcome email after verification."""
    dashboard_url = f"{FRONTEND_URL}/dashboard"
    display = name or to.split("@")[0]
    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                 background: #09090b; color: #e4e4e7; margin: 0; padding: 40px 20px;">
      <div style="max-width: 520px; margin: 0 auto; background: #18181b;
                  border: 1px solid #27272a; border-radius: 12px; padding: 40px;">

        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 32px;">
          <div style="width: 32px; height: 32px; background: #10b981;
                      border-radius: 8px; font-weight: bold; color: black;
                      display: flex; align-items: center; justify-content: center;">B</div>
          <span style="font-size: 18px; font-weight: 700; color: #fff;">Backport</span>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 8px;">
          Welcome to Backport, {display}! 🎉
        </h1>
        <p style="color: #a1a1aa; font-size: 15px; line-height: 1.6; margin: 0 0 28px;">
          Your email is verified and your account is active. You can now shield any
          API backend with rate limiting, WAF, caching, and idempotency — in seconds.
        </p>

        <a href="{dashboard_url}"
           style="display: inline-block; background: #10b981; color: #000;
                  font-weight: 700; font-size: 15px; text-decoration: none;
                  padding: 12px 28px; border-radius: 8px; margin-bottom: 28px;">
          Go to Dashboard →
        </a>

        <hr style="border: none; border-top: 1px solid #27272a; margin: 0 0 20px;">
        <p style="color: #52525b; font-size: 12px; margin: 0;">
          Need help? Reply to this email or visit our docs.<br>
          © 2026 Backport • MIT Licensed
        </p>
      </div>
    </body>
    </html>
    """
    return send_email(to, f"Welcome to {APP_NAME} — you're all set! 🚀", html)
