import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from agents.base_agent import call_llm, make_thought
from typing import List

AGENT_NAME = "LOGISTICS_RISK_AGENT"

SYSTEM_PROMPT = """You are the Logistics Risk Agent for Navix, a procurement risk analysis system.
Your role is to identify and assess logistics, shipping, and transportation risks that could delay
equipment deliveries between origin and destination countries.

You will be provided with:
1. Shipping routes derived from the equipment schedule (vendor country → project country)
2. Recent news about port disruptions, shipping delays, carrier issues, or route closures

Based on this information, provide:
- Current logistics risks for each shipping route
- Affected shipping lanes, ports, or carriers
- Likelihood rating (0-5): 0=No risk, 5=Critical disruption
- Estimated impact on delivery timelines

Format your response in Markdown with:
## Logistics Risk Summary
## Shipping Route Analysis (table: Route | Risk Type | Likelihood | Estimated Delay | Detail)
## High-Risk Routes
## Mitigation Recommendations

Cite specific sources using [Source: URL] format when available."""

def _search_logistics_risks(routes: List[tuple]) -> dict:
    results = {}
    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            searched = set()
            for origin, dest in routes[:5]:
                key = f"{origin} -> {dest}"
                if key in searched:
                    continue
                searched.add(key)

                query = f"{origin} {dest} shipping port logistics delay disruption 2024 2025"
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
                results[key] = snippets if snippets else [
                    f"No specific logistics news found for {origin} → {dest}. Using baseline assessment."
                ]
    except ImportError:
        for origin, dest in routes:
            results[f"{origin} -> {dest}"] = [
                f"Search unavailable. Using baseline logistics assessment for {origin} → {dest}."
            ]
    except Exception as e:
        for origin, dest in routes:
            results[f"{origin} -> {dest}"] = [f"Search error: {str(e)[:100]}"]
    return results


def _format_search_context(routes: List[tuple], search_results: dict) -> str:
    lines = ["# Logistics Risk Research Data\n\n"]
    for origin, dest in routes:
        key = f"{origin} -> {dest}"
        lines.append(f"## Shipping Route: {key}\n")
        snippets = search_results.get(key, [])
        for s in snippets:
            lines.append(f"- {s}\n")
        lines.append("\n")
    return "".join(lines)


def run(message: str, scheduler_metadata: dict = None) -> dict:
    thoughts = []

    routes = []
    if scheduler_metadata and "country_pairs" in scheduler_metadata:
        routes = scheduler_metadata["country_pairs"]
    elif scheduler_metadata and "countries_at_risk" in scheduler_metadata:
        countries = scheduler_metadata["countries_at_risk"]
        project_countries = scheduler_metadata.get("project_countries", ["United States"])
        for vc in countries:
            for pc in project_countries[:2]:
                if vc != pc:
                    routes.append((vc, pc))

    if not routes:
        thoughts.append(make_thought(
            AGENT_NAME, "route_extraction",
            "No specific shipping routes from schedule data. Using representative global routes."
        ))
        routes = [("China", "United States"), ("Germany", "Canada"), ("Japan", "Australia")]
    else:
        thoughts.append(make_thought(
            AGENT_NAME, "route_extraction",
            f"Extracted {len(routes)} shipping routes from schedule data.",
            output=", ".join(f"{o}→{d}" for o, d in routes)
        ))

    thoughts.append(make_thought(
        AGENT_NAME, "logistics_research",
        f"Searching for port disruptions, carrier delays, and shipping lane issues for {len(routes)} routes.",
    ))

    search_results = _search_logistics_risks(routes)

    found_count = sum(
        1 for snippets in search_results.values()
        if any("No specific" not in s and "unavailable" not in s for s in snippets)
    )
    thoughts.append(make_thought(
        AGENT_NAME, "search_complete",
        f"Logistics research complete. Found relevant data for {found_count}/{len(routes)} routes.",
        output="\n".join(f"{k}: {len(v)} sources" for k, v in search_results.items())
    ))

    search_context = _format_search_context(routes, search_results)
    equipment_context = ""
    if scheduler_metadata and "equipment_context" in scheduler_metadata:
        equipment_context = f"\n## Equipment Schedule Context\n{scheduler_metadata['equipment_context'][:600]}\n"

    user_prompt = (
        f"{message}\n\n"
        f"Analyze logistics and shipping risks for the following supply chain routes:\n\n"
        f"{search_context}"
        f"{equipment_context}"
    )

    response = call_llm(SYSTEM_PROMPT, user_prompt, max_tokens=900)

    thoughts.append(make_thought(
        AGENT_NAME, "assessment_complete",
        f"Logistics risk assessment complete for {len(routes)} shipping routes.",
        output=response
    ))

    return {
        "response": response,
        "thoughts": thoughts,
        "metadata": {
            "routes_analyzed": [f"{o}→{d}" for o, d in routes],
            "search_results": search_results,
        }
    }
