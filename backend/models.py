from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime
import secrets
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # Deprecated: api_key is now handled by ApiKey model
    api_key = Column(String, unique=True, index=True, nullable=True) 
    plan = Column(String, default="free")
    target_backend_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_admin = Column(Boolean, default=False)
    
    rate_limit_enabled = Column(Boolean, default=True)
    caching_enabled = Column(Boolean, default=False)
    idempotency_enabled = Column(Boolean, default=True)
    waf_enabled = Column(Boolean, default=False)
    
    # Referral System
    referral_code = Column(String, unique=True, index=True, default=lambda: secrets.token_hex(4))
    referred_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    referrals_count = Column(Integer, default=0) # Total signups
    total_paid_referrals = Column(Integer, default=0) # Actual conversions
    pending_referrals_count = Column(Integer, default=0) # Progress toward next reward
    has_received_first_reward = Column(Boolean, default=False)
    
    feedbacks = relationship("Feedback", back_populates="user")
    api_keys = relationship("ApiKey", back_populates="user", cascade="all, delete-orphan")
    
    referred_users = relationship("User", backref="referrer", remote_side=[id])

class ApiKey(Base):
    __tablename__ = "api_keys"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, default="Default Gateway")
    key = Column(String, unique=True, index=True, nullable=False, default=lambda: "bk_" + secrets.token_urlsafe(16))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="api_keys")

class Feedback(Base):
    __tablename__ = "feedbacks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String, default="general")
    message = Column(Text, nullable=False)
    rating = Column(Integer, nullable=True)
    status = Column(String, default="pending")
    admin_comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_email = Column(String, nullable=False)
    user = relationship("User", back_populates="feedbacks")

class ApiLog(Base):
    __tablename__ = "api_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    api_key_id = Column(Integer, ForeignKey("api_keys.id"), nullable=True)
    method = Column(String, nullable=False)
    path = Column(String, nullable=False)
    status_code = Column(Integer, nullable=False)
    latency_ms = Column(Integer, nullable=False)
    was_cached = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    user = relationship("User")
    api_key = relationship("ApiKey")
