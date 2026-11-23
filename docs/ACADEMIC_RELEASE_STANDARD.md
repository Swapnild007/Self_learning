# Self Learning: academic and engineering release standard

Status: working specification, not a completed curriculum or release certification. Updated 2026-11-23.

## Teaching contract
Each chapter must have (1) prerequisites and observable learning outcomes, (2) a motivating real problem, (3) an accurate conceptual model, (4) an annotated worked example, (5) a visual where it reduces cognitive load, (6) a runnable experiment with expected output and a deliberate failure, (7) retrieval questions, (8) an independently graded code task where appropriate, (9) a transfer exercise, (10) limitations and primary references.

Use an engaging, university-level voice without filler, fabricated results, gamified pressure, or false claims of certification. Distinguish illustrative toy numbers from measured data. Avoid repeating one industry example in every chapter; rotate science, creative coding, accessibility, finance, data, and real-world engineering. Introduce formulas with variable definitions and units.

## Visual editorial standard
Use diagrams for architecture and causal sequences; tables for tradeoffs; charts only for meaningful numeric comparisons or distributions. Charts must identify source, axes, units, scales, and uncertainty when relevant. Prefer accessible HTML/SVG visuals with text alternatives, responsive sizing, and reduced-motion behavior. Use images only when a genuine spatial/visual concept benefits; provide attribution, licensing and alt text. No decorative stock imagery.

## Curriculum sequencing and acceptance
Python track: syntax and types; decisions and loops; functions and scope; collections; strings and text; modules and packages; files/CSV/JSON; exceptions and validation; testing and debugging; typing; iterators/generators; object-oriented design; algorithms and complexity; numerical Python; data analysis; visualization; HTTP and automation; concurrency and performance; security and reliability; reproducible reporting capstone.

AI & LLM track: probability and statistics prerequisites; tokenization; n-gram language models; linear algebra and embeddings; gradient descent; neural networks; attention; transformers; training and evaluation; decoding; prompt engineering; retrieval augmented generation; tool use and agents; fine-tuning versus prompting; evaluation harnesses; security, privacy and safety; latency and cost; responsible deployment; reproducible capstone.

A course is not marked complete because a catalog card exists. Each chapter requires source review, assessment review, tested runnable examples, keyboard and mobile checks, and independent editorial acceptance. Record chapters as authored, reviewed, tested, or released separately.

## Engineering release gates
1. Fix CI regressions before expanding the course surface.
2. Run unit, TypeScript/build, browser desktop/mobile, keyboard and accessibility tests on the exact candidate SHA.
3. Verify all runnable examples and reference solutions, including intentional error cases.
4. Verify progress persistence, import/export validation, corrupted-state recovery, and offline behavior.
5. Test on a physical Android device; browser emulation is not a substitute.
6. Verify static hosting base paths and Pyodide asset loading on the actual deployment origin.
7. Do not merge draft PRs or claim a live deployment without successful evidence.

## Initial audit findings
- PR #1 contains the eight-screen LMS foundation; prior verification reported 10 unit and 22 browser checks.
- PR #2 adds three LLM chapters, but its 2026-10-31 workflow run 41199623511 failed on a stale test that asserted exactly one populated course.
- The feature branch is not release-ready until fresh CI passes.
- Main and review branches have an unusual history; preserve both PRs and do not force-push or merge blindly.
- Browser-local storage is not secure credential storage or cross-device sync; Pyodide is not a hostile-code sandbox.

## Research anchors
- ACM/IEEE-CS/AAAI CS2023 curricular guidance: https://csed.acm.org/wp-content/uploads/2024/04/1_Curricula_2023.pdf
- Python official tutorial: https://docs.python.org/3/tutorial/
- Hugging Face LLM course: https://huggingface.co/learn/llm-course/chapter1/1
- Liao & Ringler (2023), active-learning backward design: https://doi.org/10.1080/2331186X.2023.2204055
- Loeber et al. (2025), scaffolded programming activities: https://peer.asee.org/an-analysis-on-the-effectiveness-of-randomized-auto-graded-activities-in-introductory-programming-courses
