# STAT GU4204 — Statistical Inference

**Course**: STAT GU4204, Columbia University, Spring 2026  
**Professor**: Banu Baydil  
**Textbook**: DeGroot & Schervish, *Probability and Statistics*, 4th ed.

## Repo Layout

```
StatInference/
├── homework/        # Per-assignment subdirs (questions + solutions + submission)
│   ├── hw1/
│   └── hw3/
├── exam-prep/       # Cheatsheet, mock midterms, practice exams
├── reference/       # Master assignment PDF, terms-and-symbols glossary
├── chunks/          # RAG-chunked course notes (DO NOT split further)
├── README.md        # Source/chunk index
└── CLAUDE.md        # This file
```

## Homework

| Assignment | Due | Status | Path |
|---|---|---|---|
| HW1 | 02/06 | Submitted | `homework/hw1/HW1_Sol.pdf` |
| HW2 (unofficial) | n/a | Solutions in `reference/Additional_Ex_Sol.pdf` | `chunks/homework-2-additional-problems.md` |
| HW3 | 04/28 | Complete | `homework/hw3/hw3-{questions,solutions,submission}.{tex,pdf}` |
| HW4 (extra credit) | 05/05 | Complete | `homework/hw4/hw4-{questions,solutions,worksheet}.{tex,pdf}` |

Compile: `cd homework/hw3 && /Library/TeX/texbin/pdflatex -interaction=nonstopmode hw3-solutions.tex`

LaTeX artifacts (`*.aux`, `*.log`, etc.) are gitignored — clean rebuilds are safe.

## Course Notes (RAG Chunks)

All course content is chunked in `chunks/` — read `README.md` for the full index. Key chunks:
- `chunks/homework-{1,2,3,4}-problems.md` — Per-assignment problem chunks
- `chunks/13-confidence-intervals.md`, `chunks/14-cramer-rao-inequality.md` — HW3 topics
- `chunks/16-hypothesis-testing.md` — HW4 + final exam material (Neyman-Pearson, UMP, t/F-tests, LRT)
- `chunks/textbook-rag/` — full DeGroot & Schervish reference

Source PDFs in `reference/`:
- `HWs_Spring_2026.pdf` — master HW doc (current as of 5/2 update)
- `STAT_GU4204_08.pdf` — Sen notes Ch 10 (Hypothesis Testing)
- `Additional_Ex_Sol.pdf` — solutions to additional/HW2 exercises

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
