import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from agents.base_agent import call_llm, make_thought
from typing import List

AGENT_NAME = "POLITICAL_RISK_AGENT"

SYSTEM_PROMPT = """You are the Political Risk Agent for Navix, a procurement risk analysis system.
Your role is to assess geopolitical, trade, and regulatory risks for countries involved in equipment supply chains.

You will be provided with:
1. A list of vendor countries from the equipment schedule
2. Recent news snippets and search results about political/trade risks for those countries

Based on this information, provide:
- A risk rating (1-5) for each country: 1=Very Low, 2=Low, 3=Medium, 4=High, 5=Critical
- Key risk factors (sanctions, trade wars, labor disputes, port disruptions, etc.)
- Specific citations from the news sources provided
- Recommended procurement actions

Format your response in Markdown with clear sections per country.
Always cite your sources with [Source: URL] format when referencing specific news."""

def _search_country_risks(countries: List[str]) -> dict:
    results = {}
    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            for country in countries[:5]:
                query = f"{country} trade sanctions supply chain risk 2024 2025"
                snippets = []
                try:
                    search_results = list(ddgs.text(query, max_results=3))
                    for r in search_results:
                        title = r.get("title", "")
                        body = r.get("body", "")[:300]
                        url = r.get("href", "")
                        if title and body:
                            snippets.append(f"**{title}**: {body} [Source: {url}]")
                except Exception:
                    pass
                results[country] = snippets if snippets else [
                    f"No specific news found for {country}. Using baseline risk assessment."
                ]
    except ImportError:
        for country in countries:
            results[country] = [f"Search unavailable. Using baseline risk assessment for {country}."]
    except Exception as e:
        for country in countries:
            results[country] = [f"Search error for {country}: {str(e)[:100]}"]
    return results

def _format_search_context(countries: List[str], search_results: dict) -> str:
    lines = ["# Political Risk Research Data\n\n"]
    for country in countries:
        lines.append(f"## {country}\n")
        snippets = search_results.get(country, [])
        if snippets:
            for s in snippets:
                lines.append(f"- {s}\n")
        else:
            lines.append(f"- No recent news found for {country}.\n")
        lines.append("\n")
    return "".join(lines)

def run(message: str, scheduler_metadata: dict = None) -> dict:
    thoughts = []

    countries = []
    if scheduler_metadata and "countries_at_risk" in scheduler_metadata:
        countries = scheduler_metadata["countries_at_risk"]

    if not countries:
        thoughts.append(make_thought(
            AGENT_NAME, "country_extraction",
            "No specific countries identified from schedule data. Analyzing high-risk regions generally."
        ))
        countries = ["China", "Russia", "Philippines"]
    else:
        thoughts.append(make_thought(
            AGENT_NAME, "country_extraction",
            f"Extracted {len(countries)} at-risk vendor countries from schedule analysis: {', '.join(countries)}",
            output=f"Countries to analyze: {', '.join(countries)}"
        ))

    thoughts.append(make_thought(
        AGENT_NAME, "web_search",
        f"Searching for recent geopolitical news, trade sanctions, and supply chain disruptions for: {', '.join(countries)}",
    ))

    search_results = _search_country_risks(countries)

    search_summary = []
    for country, snippets in search_results.items():
        found = len([s for s in snippets if "No specific" not in s and "unavailable" not in s])
        search_summary.append(f"{country}: {found} news sources found")

    thoughts.append(make_thought(
        AGENT_NAME, "search_complete",
        "Web search complete. Processing news snippets for risk assessment.",
        output="\n".join(search_summary)
    ))

    search_context = _format_search_context(countries, search_results)

    schedule_context = ""
    if scheduler_metadata and "equipment_context" in scheduler_metadata:
        schedule_context = f"\n## Equipment Schedule Context\n{scheduler_metadata['equipment_context'][:800]}\n"

    user_prompt = (
        f"{message}\n\n"
        f"Please analyze political and trade risks for the following vendor countries "
        f"that have delayed or at-risk equipment deliveries.\n\n"
        f"{search_context}"
        f"{schedule_context}"
    )

    response = call_llm(SYSTEM_PROMPT, user_prompt, max_tokens=900)

    thoughts.append(make_thought(
        AGENT_NAME, "risk_assessment_complete",
        f"Political risk assessment complete for {len(countries)} countries.",
        output=response
    ))

    return {
        "response": response,
        "thoughts": thoughts,
        "metadata": {
            "countries_analyzed": countries,
            "search_results": search_results,
        }
    }
