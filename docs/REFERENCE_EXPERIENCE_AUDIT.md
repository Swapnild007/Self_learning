# Self Learning: reference-site research and implementation record

Updated: 2026-11-23. This is an engineering audit, not a production certification.

## Reference review

Reviewed https://www.allcsnotes.com/, https://www.allcsnotes.com/courses, https://www.allcsnotes.com/courses/python and https://www.allcsnotes.com/paths.

The useful pattern is visual first: a searchable library, subject filters, ordered curricula, short concept notes, practical demonstrations, and pathways that make prerequisites visible. The reference lists 36 course subjects and a substantial multi-level Python syllabus. Its separate payment, review and certificate features are not being reproduced.

## Implementation in Self Learning

| Capability | Implementation |
| --- | --- |
| Course discovery | 36 searchable subjects, category/level/content filters |
| Published learning | Original Python chapters and AI/LLM textbook chapters |
| Planned curriculum | Multi-module, topic-by-topic outlines for the other subjects, prominently labelled not yet published |
| Learning paths | Eight original sequences linking related courses |
| Visual notes | Interactive weighted average, token probability and algorithm growth experiments with limitations and live charts |
| Programming practice | Existing Pyodide Python lab, code checks and chapter assessments |
| Learning continuity | Existing local notes, bookmarks, progress, import and export |
| Deployment | GitHub Pages workflow prepared; requires repository Pages configuration and reviewed merge |
| Accessibility | Keyboard controls, semantic labels, responsive layout and automated axe checks; physical-device testing still required |

## Editorial integrity

- Course titles are general subject labels, not copied lesson text.
- All textbook content, module descriptions, examples, exercises, visualizations and code in this implementation are original.
- There are no fabricated student ratings, enrollments, salary promises or paid-course claims.
- The catalog does not silently treat syllabus ideas as lessons. Only authored chapters have reader routes or assessments.
- The detailed original curriculum outlines are an **authoring backlog**, not 34 completed courses.

## Remaining release gates

1. Obtain a green CI run on the exact final SHA, including browser tests on desktop and mobile emulation.
2. Review chapter explanations, references, graded solutions, and runnable code output.
3. Check actual Android keyboard use, reading ergonomics, code editor and progress persistence.
4. Configure GitHub Pages and verify Pyodide assets on the deployed subdirectory.
5. Complete and academically review the outstanding courses before describing this as a full 36-course library.

Do not merge, publish or certify until those checks are evidenced.
