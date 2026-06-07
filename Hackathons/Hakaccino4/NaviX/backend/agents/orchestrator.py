import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import uuid
import asyncio
from datetime import datetime
from database import get_db

SCHEDULE_KEYWORDS = {
    "schedule", "delivery", "deliveries", "variance", "delay", "delayed",
    "on track", "at risk", "equipment", "risk level", "timeline", "lead time",
    "due date", "shipment", "procurement", "late", "overdue", "milestone",
}

POLITICAL_KEYWORDS = {
    "political", "geopolitical", "sanctions", "sanction", "government",
    "regulation", "war", "conflict", "embargo", "labor", "strike",
}

TARIFF_KEYWORDS = {
    "tariff", "tariffs", "duty", "duties", "trade", "import", "export",
    "customs", "trade war", "trade deal", "trade agreement",
}

LOGISTICS_KEYWORDS = {
    "logistics", "port", "shipping", "ship", "transport", "freight",
    "carrier", "route", "disruption", "congestion", "container",
}

FULL_RISK_KEYWORDS = {
    "full risk", "all risks", "comprehensive", "complete analysis",
    "all agents", "full analysis", "overall risk",
}


def _classify_query(message: str) -> str:
    lower = message.lower()

    if any(kw in lower for kw in FULL_RISK_KEYWORDS):
        return "full"

    has_political = any(kw in lower for kw in POLITICAL_KEYWORDS)
    has_tariff = any(kw in lower for kw in TARIFF_KEYWORDS)
    has_logistics = any(kw in lower for kw in LOGISTICS_KEYWORDS)
    has_schedule = any(kw in lower for kw in SCHEDULE_KEYWORDS)

    active_risk_types = sum([has_political, has_tariff, has_logistics])

    if active_risk_types >= 2:
        return "full"
    if has_political:
        return "political"
    if has_tariff:
        return "tariff"
    if has_logistics:
        return "logistics"
    if has_schedule:
        return "schedule"
    return "general"


def _extract_country_pairs(metrics: dict) -> list:
    pairs = []
    seen = set()
    items = metrics.get("categorized", [])
    for item in items:
        vendor = item.get("vendor_country", "")
        project = item.get("project_country", "")
        if vendor and project and vendor != project:
            key = (vendor, project)
            if key not in seen:
                seen.add(key)
                pairs.append(key)
    return pairs


def _extract_project_countries(metrics: dict) -> list:
    countries = set()
    for item in metrics.get("categorized", []):
        pc = item.get("project_country", "")
        if pc:
            countries.add(pc)
    return list(countries)


def _save_session(conn, session_id: str, user_query: str, now: str, is_new: bool):
    if is_new:
        conn.execute(
            "INSERT INTO sessions (session_id, user_query, session_date, created_at) VALUES (?, ?, ?, ?)",
            (session_id, user_query, now, now)
        )


def _save_conversation(conn, conversation_id: str, session_id: str,
                       user_query: str, agent_response: str, now: str):
    conn.execute(
        """INSERT INTO conversations
           (conversation_id, session_id, user_query, agent_response, created_at)
           VALUES (?, ?, ?, ?, ?)""",
        (conversation_id, session_id, user_query, agent_response, now)
    )


def _save_thoughts(conn, conversation_id: str, session_id: str, thoughts: list):
    for t in thoughts:
        conn.execute(
            """INSERT INTO thoughts
               (conversation_id, session_id, agent_name, thinking_stage,
                thought_content, output_content, created_date)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (
                conversation_id,
                session_id,
                t.get("agent_name", ""),
                t.get("thinking_stage", ""),
                t.get("thought_content", ""),
                t.get("output_content", ""),
                t.get("created_date", datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
            )
        )


async def _run_agent_async(fn, *args, **kwargs):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, lambda: fn(*args, **kwargs))


async def process_chat(message: str, session_id: str = None) -> dict:
    is_new_session = session_id is None
    if is_new_session:
        session_id = str(uuid.uuid4())

    conversation_id = str(uuid.uuid4())
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    query_type = _classify_query(message)

    all_thoughts = []
    final_response = ""
    report_content = None

    if query_type == "general":
        from agents import assistant_agent
        result = assistant_agent.run(message)
        final_response = result["response"]
        all_thoughts.extend(result["thoughts"])

    elif query_type == "schedule":
        from agents import scheduler_agent, reporting_agent

        sched_result = scheduler_agent.run(message)
        all_thoughts.extend(sched_result["thoughts"])

        rep_result = reporting_agent.run(
            message=message,
            scheduler_output=sched_result["response"],
            session_id=session_id,
            scheduler_metadata=sched_result.get("metadata", {}),
        )
        all_thoughts.extend(rep_result["thoughts"])
        final_response = rep_result["response"]
        report_content = rep_result.get("report_content")

    elif query_type == "political":
        from agents import scheduler_agent, political_risk_agent, reporting_agent

        sched_result = scheduler_agent.run(message)
        all_thoughts.extend(sched_result["thoughts"])

        pol_result = political_risk_agent.run(
            message=message,
            scheduler_metadata=sched_result.get("metadata", {}),
        )
        all_thoughts.extend(pol_result["thoughts"])

        rep_result = reporting_agent.run(
            message=message,
            scheduler_output=sched_result["response"],
            political_output=pol_result["response"],
            session_id=session_id,
            scheduler_metadata=sched_result.get("metadata", {}),
        )
        all_thoughts.extend(rep_result["thoughts"])
        final_response = rep_result["response"]
        report_content = rep_result.get("report_content")

    elif query_type == "tariff":
        from agents import scheduler_agent, tariff_risk_agent, reporting_agent

        sched_result = scheduler_agent.run(message)
        all_thoughts.extend(sched_result["thoughts"])

        sched_meta = sched_result.get("metadata", {})
        sched_meta["country_pairs"] = _extract_country_pairs(sched_meta.get("metrics_full", {}))
        sched_meta["project_countries"] = _extract_project_countries(sched_meta.get("metrics_full", {}))

        tariff_result = tariff_risk_agent.run(
            message=message,
            scheduler_metadata=sched_meta,
        )
        all_thoughts.extend(tariff_result["thoughts"])

        rep_result = reporting_agent.run(
            message=message,
            scheduler_output=sched_result["response"],
            tariff_output=tariff_result["response"],
            session_id=session_id,
            scheduler_metadata=sched_meta,
        )
        all_thoughts.extend(rep_result["thoughts"])
        final_response = rep_result["response"]
        report_content = rep_result.get("report_content")

    elif query_type == "logistics":
        from agents import scheduler_agent, logistics_risk_agent, reporting_agent

        sched_result = scheduler_agent.run(message)
        all_thoughts.extend(sched_result["thoughts"])

        sched_meta = sched_result.get("metadata", {})
        sched_meta["country_pairs"] = _extract_country_pairs(sched_meta.get("metrics_full", {}))
        sched_meta["project_countries"] = _extract_project_countries(sched_meta.get("metrics_full", {}))

        logistics_result = logistics_risk_agent.run(
            message=message,
            scheduler_metadata=sched_meta,
        )
        all_thoughts.extend(logistics_result["thoughts"])

        rep_result = reporting_agent.run(
            message=message,
            scheduler_output=sched_result["response"],
            logistics_output=logistics_result["response"],
            session_id=session_id,
            scheduler_metadata=sched_meta,
        )
        all_thoughts.extend(rep_result["thoughts"])
        final_response = rep_result["response"]
        report_content = rep_result.get("report_content")

    elif query_type == "full":
        from agents import scheduler_agent, political_risk_agent, tariff_risk_agent, logistics_risk_agent, reporting_agent

        sched_result = scheduler_agent.run(message)
        all_thoughts.extend(sched_result["thoughts"])

        sched_meta = sched_result.get("metadata", {})
        country_pairs = _extract_country_pairs(sched_meta.get("metrics_full", {}))
        project_countries = _extract_project_countries(sched_meta.get("metrics_full", {}))
        sched_meta["country_pairs"] = country_pairs
        sched_meta["project_countries"] = project_countries

        pol_task = _run_agent_async(political_risk_agent.run, message=message, scheduler_metadata=sched_meta)
        tar_task = _run_agent_async(tariff_risk_agent.run, message=message, scheduler_metadata=sched_meta)
        log_task = _run_agent_async(logistics_risk_agent.run, message=message, scheduler_metadata=sched_meta)

        pol_result, tariff_result, logistics_result = await asyncio.gather(pol_task, tar_task, log_task)

        all_thoughts.extend(pol_result["thoughts"])
        all_thoughts.extend(tariff_result["thoughts"])
        all_thoughts.extend(logistics_result["thoughts"])

        rep_result = reporting_agent.run(
            message=message,
            scheduler_output=sched_result["response"],
            political_output=pol_result["response"],
            tariff_output=tariff_result["response"],
            logistics_output=logistics_result["response"],
            session_id=session_id,
            scheduler_metadata=sched_meta,
        )
        all_thoughts.extend(rep_result["thoughts"])
        final_response = rep_result["response"]
        report_content = rep_result.get("report_content")

    conn = get_db()
    try:
        _save_session(conn, session_id, message, now, is_new_session)
        _save_conversation(conn, conversation_id, session_id, message, final_response, now)
        _save_thoughts(conn, conversation_id, session_id, all_thoughts)
        conn.commit()
    finally:
        conn.close()

    # Strip any map placeholders the LLM may hallucinate, since we render a real interactive map.
    import re as _re
    final_response = _re.sub(r'!\[.*?\]\(.*?\)', '', final_response)        # ![alt](url)
    final_response = _re.sub(r'!\[.*?\]', '', final_response)                # ![alt] (no url)
    # [Insert World Heat Map Image] / [World Heat Map] etc.
    final_response = _re.sub(r'\[Insert[^\]]*\]', '', final_response, flags=_re.IGNORECASE)
    final_response = _re.sub(r'\[.*?[Hh]eat\s*[Mm]ap.*?\]', '', final_response)
    final_response = _re.sub(r'\[.*?[Mm]ap\s*[Ii]mage.*?\]', '', final_response)
    # Remove section headings for the map we handle ourselves
    final_response = _re.sub(
        r'#+\s*(World Heat Map|Schedule Risk Heat Map|Country Risk Heat Map|Geographical Risk Map)[^\n]*\n?',
        '', final_response, flags=_re.IGNORECASE
    )
    # Remove leftover note lines about the heat map
    final_response = _re.sub(
        r'Note:\s*(The heat map|The heatmap|The map)[^\n]*\n?', '', final_response, flags=_re.IGNORECASE
    )
    final_response = final_response.strip()

    result = {
        "response": final_response,
        "session_id": session_id,
        "conversation_id": conversation_id,
        "query_type": query_type,
        "status": "success",
    }

    if report_content:
        result["has_report"] = True
        result["report_session_id"] = session_id

    return result
