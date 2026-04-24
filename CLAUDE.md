# STAT GU4204 — Statistical Inference

**Course**: STAT GU4204, Columbia University, Spring 2026  
**Professor**: Banu Baydil  
**Textbook**: DeGroot & Schervish, *Probability and Statistics*, 4th ed.

## Homework

All graded HW assignments live in this repo root. Solutions are written in LaTeX and compiled to PDF.

| Assignment | Due | Status | File |
|---|---|---|---|
| HW1 | 02/06 | Submitted | `HW1_Sol.pdf` |
| HW3 | 04/28 | Complete | `hw3-solutions.tex` / `.pdf` |

Compile: `/Library/TeX/texbin/pdflatex -interaction=nonstopmode hw3-solutions.tex`

## Course Notes (RAG Chunks)

All course content is chunked in `chunks/` — read `README.md` for the full index. Key chunks:
- `chunks/homework-1-problems.md` — HW1 problems
- `chunks/13-confidence-intervals.md`, `chunks/14-cramer-rao-inequality.md` — HW3 topics
- `chunks/textbook-rag/` — full DeGroot & Schervish reference

## Grading

- HW: 10% (lowest dropped)
- Midterm 1 & 2: 25% each (in-class, no external help)
- Final: 40% (in-class)

---

## Connected Repos

When an assignment prompt isn't in this repo yet, check Courseworks first:

```bash
cd ~/dev/courseworks-parsing
source .venv/bin/activate
python main.py --categories assignments --json --dry-run
```

**Other Spring 2026 course repos:**

| Course | Repo | Notes |
|---|---|---|
| STAT W4207 — Elementary Stochastics | `~/dev/ElmStoch` | `INDEX.md` is the master index; homework in `homework/` |
| POLS-UN2601 — International Politics | `~/dev/International-politics` | Essays in `essays/`; prompts in `assignment-guidance/` |
| Canvas LMS poller | `~/dev/courseworks-parsing` | Fetches new assignments, files, announcements from Courseworks |
