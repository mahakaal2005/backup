from pydantic import BaseModel
from typing import Optional, List

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    status: str = "success"

class Thought(BaseModel):
    thought_id: Optional[int] = None
    agent_name: str
    thinking_stage: str
    thought_content: str
    output_content: Optional[str] = None
    created_date: Optional[str] = None

class Conversation(BaseModel):
    conversation_id: str
    user_query: str
    thoughts: List[Thought] = []

class Session(BaseModel):
    session_id: str
    user_query: Optional[str] = None
    session_date: Optional[str] = None
    conversations: List[Conversation] = []

class ThinkingLogSummary(BaseModel):
    id: str
    session_id: str
    first_query: str

class Report(BaseModel):
    report_id: str
    session_id: str
    blob_url: str
    created_at: Optional[str] = None

class HeatmapEntry(BaseModel):
    country: str
    average_risk: str
    breakdown: str

class EquipmentItem(BaseModel):
    id: int
    item_name: str
    vendor_country: str
    project_country: str
    expected_date: str
    actual_date: str
    status: str
    risk_level: int
