import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from agents.base_agent import call_llm, make_thought
from typing import List

AGENT_NAME = "TARIFF_RISK_AGENT"

SYSTEM_PROMPT = """You are the Tariff Risk Agent for Navix, a procurement risk analysis system.
Your role is to identify and assess tariff, trade duty, and customs-related risks for equipment
moving between specific origin and destination countries in the supply chain.

You will be provided with:
1. A list of vendor (origin) countries and project (destination) countries
2. Recent news snippets about tariff changes, trade disputes, and duty updates

Based on this information, provide:
- Current or upcoming tariff risks for each country pair (origin → destination)
- Specific duty rates, trade agreements, or disputes that apply
- Likelihood rating (0-5) for each tariff risk: 0=No risk, 5=Critical
- Recommended procurement or contracting actions to mitigate costs

Format your response in Markdown with:
## Tariff Risk Summary
## Country-Pair Tariff Analysis (table with columns: Origin | Destination | Tariff Risk | Likelihood | Key Detail)
## High-Risk Trade Routes
## Mitigation Recommendations

Be specific, cite sources when available using [Source: URL] format."""

def _search_tariff_risks(country_pairs: List[tuple]) -> dict:
    results = {}
    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            searched = set()
            for origin, dest in country_pairs[:5]:
                key = f"{origin} -> {dest}"
                if key in searched:
                    continue
                searched.add(key)

                query = f"{origin} {dest} tariff import duty trade 2024 2025 equipment"
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
                    f"No specific tariff news found for {origin} → {dest}. Using baseline assessment."
                ]
    except ImportError:
        for origin, dest in country_pairs:
            results[f"{origin} -> {dest}"] = [
                f"Search unavailable. Using baseline tariff assessment for {origin} → {dest}."
            ]
    except Exception as e:
        for origin, dest in country_pairs:
            results[f"{origin} -> {dest}"] = [f"Search error: {str(e)[:100]}"]
    return results


def _format_search_context(country_pairs: List[tuple], search_results: dict) -> str:
    lines = ["# Tariff Risk Research Data\n\n"]
    for origin, dest in country_pairs:
        key = f"{origin} -> {dest}"
        lines.append(f"## {key}\n")
        snippets = search_results.get(key, [])
        for s in snippets:
            lines.append(f"- {s}\n")
        lines.append("\n")
    return "".join(lines)


def run(message: str, scheduler_metadata: dict = None) -> dict:
    thoughts = []

    country_pairs = []
    if scheduler_metadata and "country_pairs" in scheduler_metadata:
        country_pairs = scheduler_metadata["country_pairs"]
    elif scheduler_metadata and "countries_at_risk" in scheduler_metadata:
        countries = scheduler_metadata["countries_at_risk"]
        project_countries = scheduler_metadata.get("project_countries", ["United States"])
        for vc in countries:
            for pc in project_countries[:2]:
                if vc != pc:
                    country_pairs.append((vc, pc))

    if not country_pairs:
        thoughts.append(make_thought(
            AGENT_NAME, "pair_extraction",
            "No specific country pairs from schedule data. Using representative trade routes."
        ))
        country_pairs = [("China", "United States"), ("Germany", "United States"), ("Japan", "Australia")]
    else:
        thoughts.append(make_thought(
            AGENT_NAME, "pair_extraction",
            f"Extracted {len(country_pairs)} trade routes from schedule analysis.",
            output=", ".join(f"{o}→{d}" for o, d in country_pairs)
        ))

    thoughts.append(make_thought(
        AGENT_NAME, "tariff_research",
        f"Searching for current tariff rates, trade disputes, and duty changes for {len(country_pairs)} trade routes.",
    ))

    search_results = _search_tariff_risks(country_pairs)

    found_count = sum(
        1 for snippets in search_results.values()
        if any("No specific" not in s and "unavailable" not in s for s in snippets)
    )
    thoughts.append(make_thought(
        AGENT_NAME, "search_complete",
        f"Tariff research complete. Found relevant data for {found_count}/{len(country_pairs)} trade routes.",
        output="\n".join(f"{k}: {len(v)} sources" for k, v in search_results.items())
    ))

    search_context = _format_search_context(country_pairs, search_results)
    equipment_context = ""
    if scheduler_metadata and "equipment_context" in scheduler_metadata:
        equipment_context = f"\n## Equipment Schedule Context\n{scheduler_metadata['equipment_context'][:600]}\n"

    user_prompt = (
        f"{message}\n\n"
        f"Analyze tariff and trade duty risks for the following supply chain trade routes:\n\n"
        f"{search_context}"
        f"{equipment_context}"
    )

    response = call_llm(SYSTEM_PROMPT, user_prompt, max_tokens=900)

    thoughts.append(make_thought(
        AGENT_NAME, "assessment_complete",
        f"Tariff risk assessment complete for {len(country_pairs)} trade routes.",
        output=response
    ))

    return {
        "response": response,
        "thoughts": thoughts,
        "metadata": {
            "country_pairs_analyzed": [f"{o}→{d}" for o, d in country_pairs],
            "search_results": search_results,
        }
    }
