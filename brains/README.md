# Brains

Durable product memory for ResumePilot. Skills and humans read this instead of re-deriving decisions from chat.

Do **not** add a catch-all `memory/` folder. Put living facts next to the domain that owns them (`seo/`, later `distribution/`, and so on). A generic memory dir becomes a junk drawer that no skill knows to open.

## Two kinds of folders

| Kind | What it is | How it changes |
|------|------------|----------------|
| **Living** | Lists and rules a skill must re-read every run (owned map, competitors, cooldown) | Update in the same PR as the work |
| **Research pack** | A finished investigation (report, evidence, checklist) | Leave it; derive a plan or living list from it |

## Contents

| Folder | Kind | Description |
|--------|------|-------------|
| [seo](./seo/) | Living | Keyword map, competitors, opportunity queue, and ship log for `seo-manager` |
| [plans](./plans/) | Living | Implementation checklists derived from research (what to build/operate next) |
| [traffic-growth-before-monetization](./traffic-growth-before-monetization/) | Research pack | How to grow traffic and usage before introducing a paid plan |

## When to add a folder

Add a **domain** folder when a skill or weekly habit needs the same facts every time (SEO, partnerships, activation). Add a **research pack** when a report is done and should stay citable. Do not dump chat recaps, Cursor transcripts, or one-off notes here.

Cross-cutting rules that already have a home stay there: SEO claims and cooldown in [`seo/README.md`](./seo/README.md); 90-day build order in [`plans/`](./plans/). Only split a new file when two domains would otherwise copy the same list.

## Skills

`seo-manager` must read and update [`seo/`](./seo/) every run. Do not stage research-pack dumps (`traffic-growth-before-monetization/` html/jsonl) on an SEO PR.
