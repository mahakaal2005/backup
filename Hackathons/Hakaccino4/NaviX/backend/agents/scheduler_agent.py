import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from agents.base_agent import call_llm, make_thought
from database import get_db
from datetime import datetime, date

AGENT_NAME = "SCHEDULER_AGENT"

SYSTEM_PROMPT = """You are the Scheduler Agent for Navix, a procurement risk analysis system.
You will be given pre-computed risk metrics and schedule data. Your role is to provide a
clear, professional narrative analysis based on the numbers already calculated.

Do NOT recalculate — the Python code has already categorized each item.
Your job is to interpret, explain, and recommend actions based on these figures.

Format your response in Markdown with:
## Schedule Risk Summary
## High-Risk Items (Detail)
## Medium-Risk Items (Detail)
## Country Analysis
## Recommendations

Be specific, reference actual item names and numbers from the data provided."""

def _get_equipment_data() -> list:
    conn = get_db()
    try:
        rows = conn.execute(
            "SELECT * FROM equipment_schedule ORDER BY risk_level DESC, item_name ASC"
        ).fetchall()
        return [dict(row) for row in rows]
    finally:
        conn.close()

def _calculate_variance(expected: str, actual: str) -> int:
    try:
        exp = datetime.strptime(expected, "%Y-%m-%d").date()
        act = datetime.strptime(actual, "%Y-%m-%d").date()
        return (act - exp).days
    except Exception:
        return 0

def _categorize_risk(item: dict) -> str:
    variance = _calculate_variance(item["expected_date"], item["actual_date"])
    status = item.get("status", "")
    risk_level = item.get("risk_level", 1)

    if risk_level >= 4 or status == "at_risk" or variance > 20:
        return "High"
    elif risk_level == 3 or status == "delayed" or 8 <= variance <= 20:
        return "Medium"
    else:
        return "Low"

def _compute_metrics(items: list) -> dict:
    total = len(items)
    categorized = []
    for item in items:
        variance = _calculate_variance(item["expected_date"], item["actual_date"])
        category = _categorize_risk(item)
        categorized.append({**item, "variance_days": variance, "risk_category": category})

    high = [i for i in categorized if i["risk_category"] == "High"]
    medium = [i for i in categorized if i["risk_category"] == "Medium"]
    low = [i for i in categorized if i["risk_category"] == "Low"]

    countries = {}
    for item in categorized:
        c = item["vendor_country"]
        if c not in countries:
            countries[c] = {"total": 0, "delayed": 0, "high": 0, "total_variance": 0, "risk_sum": 0}
        countries[c]["total"] += 1
        countries[c]["risk_sum"] += item["risk_level"]
        countries[c]["total_variance"] += max(item["variance_days"], 0)
        if item["status"] in ("delayed", "at_risk"):
            countries[c]["delayed"] += 1
        if item["risk_category"] == "High":
            countries[c]["high"] += 1

    total_delay_days = sum(max(i["variance_days"], 0) for i in categorized)

    return {
        "total": total,
        "categorized": categorized,
        "high": high,
        "medium": medium,
        "low": low,
        "countries": countries,
        "total_delay_days": total_delay_days,
        "high_pct": round(len(high) / total * 100) if total else 0,
        "medium_pct": round(len(medium) / total * 100) if total else 0,
        "low_pct": round(len(low) / total * 100) if total else 0,
    }

def _format_metrics_context(metrics: dict) -> str:
    today_str = date.today().strftime("%Y-%m-%d")
    lines = [
        f"# Pre-Computed Schedule Risk Metrics\n",
        f"Analysis date: {today_str}\n\n",
        f"## Summary Statistics\n",
        f"- Total equipment items: {metrics['total']}\n",
        f"- High risk: {len(metrics['high'])} items ({metrics['high_pct']}%)\n",
        f"- Medium risk: {len(metrics['medium'])} items ({metrics['medium_pct']}%)\n",
        f"- Low risk: {len(metrics['low'])} items ({metrics['low_pct']}%)\n",
        f"- Total accumulated delay: {metrics['total_delay_days']} days\n\n",
        f"## Item-Level Risk Breakdown\n",
        f"| Item | Vendor Country | Expected | Actual | Variance | Status | Risk Category |\n",
        f"|------|----------------|----------|--------|----------|--------|---------------|\n",
    ]

    for item in metrics["categorized"]:
        v = item["variance_days"]
        variance_str = f"+{v}d" if v > 0 else f"{v}d"
        lines.append(
            f"| {item['item_name']} | {item['vendor_country']} | "
            f"{item['expected_date']} | {item['actual_date']} | {variance_str} | "
            f"{item['status']} | **{item['risk_category']}** |\n"
        )

    lines.append("\n## Country Risk Breakdown\n")
    lines.append("| Country | Items | Delayed | High-Risk | Total Delay (days) | Avg Risk Score |\n")
    lines.append("|---------|-------|---------|-----------|--------------------|-----------------|\n")
    for country, stats in sorted(metrics["countries"].items(), key=lambda x: -x[1]["risk_sum"]):
        avg = stats["risk_sum"] / stats["total"] if stats["total"] else 0
        lines.append(
            f"| {country} | {stats['total']} | {stats['delayed']} | {stats['high']} | "
            f"{stats['total_variance']}d | {avg:.1f}/5 |\n"
        )

    return "".join(lines)

def run(message: str) -> dict:
    thoughts = []

    thoughts.append(make_thought(
        AGENT_NAME, "data_retrieval",
        "Fetching equipment schedule data from the database to analyze delivery risks."
    ))

    items = _get_equipment_data()

    thoughts.append(make_thought(
        AGENT_NAME, "data_analysis",
        f"Retrieved {len(items)} equipment items. Computing schedule variances deterministically.",
        output=f"Items loaded: {len(items)}."
    ))

    metrics = _compute_metrics(items)

    summary_output = (
        f"High risk: {len(metrics['high'])} ({metrics['high_pct']}%) | "
        f"Medium: {len(metrics['medium'])} ({metrics['medium_pct']}%) | "
        f"Low: {len(metrics['low'])} ({metrics['low_pct']}%) | "
        f"Total delay: {metrics['total_delay_days']} days"
    )

    thoughts.append(make_thought(
        AGENT_NAME, "risk_calculation",
        "Categorized all items as Low/Medium/High risk using deterministic thresholds: "
        "Low=0-7 days delay and risk_level<3; Medium=8-20 days or status=delayed; "
        "High=>20 days or at_risk status or risk_level≥4.",
        output=summary_output
    ))

    context = _format_metrics_context(metrics)

    user_prompt = f"{message}\n\n{context}"
    response = call_llm(SYSTEM_PROMPT, user_prompt, max_tokens=900)

    thoughts.append(make_thought(
        AGENT_NAME, "analysis_complete",
        "Schedule risk narrative analysis complete.",
        output=response
    ))

    countries_at_risk = [
        country for country, stats in metrics["countries"].items()
        if stats["delayed"] > 0 or stats["high"] > 0
    ]

    return {
        "response": response,
        "thoughts": thoughts,
        "metadata": {
            "items_analyzed": metrics["total"],
            "countries_at_risk": countries_at_risk,
            "equipment_context": context,
            "metrics_full": {
                "categorized": metrics["categorized"],
            },
            "metrics": {
                "high_count": len(metrics["high"]),
                "medium_count": len(metrics["medium"]),
                "low_count": len(metrics["low"]),
                "high_pct": metrics["high_pct"],
                "medium_pct": metrics["medium_pct"],
                "low_pct": metrics["low_pct"],
                "total_delay_days": metrics["total_delay_days"],
            },
        }
    }
