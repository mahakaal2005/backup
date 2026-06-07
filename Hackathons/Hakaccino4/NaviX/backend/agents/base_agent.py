import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL
from datetime import datetime
from typing import Optional
import hashlib
import time

_llm_cache: dict = {}

def _cache_key(system_prompt: str, user_content: str) -> str:
    raw = f"{GROQ_MODEL}||{system_prompt}||{user_content}"
    return hashlib.md5(raw.encode()).hexdigest()


def get_groq_client() -> Optional[Groq]:
    if not GROQ_API_KEY:
        return None
    return Groq(api_key=GROQ_API_KEY)


def call_llm(system_prompt: str, user_content: str, max_tokens: int = 900) -> str:
    key = _cache_key(system_prompt, user_content)
    if key in _llm_cache:
        print(f"[LLM CACHE HIT] Returning cached response (key={key[:8]}…)")
        return _llm_cache[key]

    client = get_groq_client()
    if client is None:
        return (
            "GROQ_API_KEY is not configured. "
            "Please set the GROQ_API_KEY environment variable to enable AI analysis."
        )

    last_error = None
    for attempt in range(4):
        try:
            completion = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content},
                ],
                max_tokens=max_tokens,
                temperature=0.3,
            )
            result = completion.choices[0].message.content or ""
            _llm_cache[key] = result
            return result

        except Exception as e:
            last_error = e
            err_str = str(e).lower()
            is_rate_limit = "429" in err_str or "rate limit" in err_str or "rate_limit" in err_str
            if is_rate_limit and attempt < 3:
                wait = 20 * (attempt + 1)
                print(f"[RATE LIMIT] attempt {attempt + 1}/4 — waiting {wait}s before retry…")
                time.sleep(wait)
            else:
                break

    return f"AI analysis error: {str(last_error)}"


def clear_llm_cache():
    """Clear the in-memory LLM response cache."""
    _llm_cache.clear()
    print("[LLM CACHE] Cleared.")


def make_thought(agent_name: str, stage: str, content: str, output: str = "") -> dict:
    return {
        "agent_name": agent_name,
        "thinking_stage": stage,
        "thought_content": content,
        "output_content": output,
        "created_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
