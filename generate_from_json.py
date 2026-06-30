#!/usr/bin/env python3
"""Convert resume JSON to Resume 13.0 Markdown."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def json_to_markdown(data: dict) -> str:
    header = data.get("header", {})
    education = data.get("education", {})
    name = header.get("name", "Resume")
    links = " | ".join(link for link in header.get("links", []) if link)

    lines = [
        f"# {name} (generated from JSON)",
        "# Edit in the resume builder, then export MD for PDF generation.",
        "",
        "[header]",
        f"name: {header.get('name', '')}",
        f"location: {header.get('location', '')}",
        f"phone: {header.get('phone', '')}",
        f"email: {header.get('email', '')}",
        f"links: {links}",
        "",
        "[summary]",
        data.get("summary", ""),
        "",
        "[skills]",
        data.get("skills", ""),
        "",
        "[experience]",
    ]

    for job in data.get("experience", []):
        if not any([job.get("title"), job.get("company"), job.get("bullets")]):
            continue
        lines.extend(
            [
                f"title: {job.get('title', '')}",
                f"company: {job.get('company', '')}",
                f"dates: {job.get('dates', '')}",
                "bullets:",
            ]
        )
        for bullet in job.get("bullets", []):
            if bullet:
                lines.append(f"- {bullet}")
        lines.append("")

    lines.append("[projects]")
    for project in data.get("projects", []):
        if not any([project.get("name"), project.get("url"), project.get("bullets")]):
            continue
        lines.extend(
            [
                f"name: {project.get('name', '')}",
                f"url: {project.get('url', '')}",
                "bullets:",
            ]
        )
        for bullet in project.get("bullets", []):
            if bullet:
                lines.append(f"- {bullet}")
        lines.append("")

    lines.extend(
        [
            "[education]",
            f"school: {education.get('school', '')}",
            f"degree: {education.get('degree', '')}",
            f"year: {education.get('year', '')}",
            "",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(
            "Usage: python3 generate_from_json.py resume.json [output.md]\n"
            "  Without output.md, writes resume.md next to the JSON file."
        )

    json_path = Path(sys.argv[1]).resolve()
    if not json_path.exists():
        raise SystemExit(f"JSON file not found: {json_path}")

    data = json.loads(json_path.read_text(encoding="utf-8"))
    md_path = Path(sys.argv[2]).resolve() if len(sys.argv) >= 3 else json_path.with_suffix(".md")
    md_path.write_text(json_to_markdown(data), encoding="utf-8")
    print(f"Wrote Markdown: {md_path}")


if __name__ == "__main__":
    main()
