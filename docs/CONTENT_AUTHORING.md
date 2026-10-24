# Authoring a real textbook chapter

The canonical contract is `src/content/schema.ts`. Content is typed data, not HTML. The renderer escapes all text; never add arbitrary HTML or JavaScript evaluation to content rendering.

1. Add a Course with a stable lowercase ID and integer version. Use `Catalog preview` until there is actual content. Estimate minutes honestly. Add prerequisites, learning outcomes, editorial attribution and primary references.
2. Add a Module and Chapter with stable IDs. Never recycle an ID for a different concept. A chapter contains objectives, prerequisites, sections, summary, glossary and references. Sections accept any number of blocks; there is no paragraph-count limit.
3. Compose blocks: paragraph, definition, syntax, code with expected output and explanation, semantic table, callout (note/mistake/debug), accessible flow diagram, and industry case study with assumptions and limitations. Use multiple sections for long chapters.
4. Add an Assessment with an ID and version. Supported questions: single choice, multiple select, short answer, Python code. Use question-specific hints and explanations. Code tests must check behavior with normal and boundary inputs. Tests run in the same Python globals as the solution, inside a disposable worker.
5. Preserve section IDs when editing wording. Reading progress is keyed by chapter and section IDs, so additions do not erase existing progress. Assessment score keys include assessment version: bump it whenever the grading contract changes. Course and chapter versions describe published content changes; content ID migrations must be explicit, never inferred from titles.
6. Link routes through stable IDs. The course registry automatically indexes authored chapters. Reader routes resolve chapter IDs, and assessment links carry `?chapter=ID`, so new chapters use the same renderer and grading interface. My Learning aggregates registry content. The standalone lab is an unrestricted scratchpad initialized with the sample, independent of chapter progress.

## Sample shape

```ts
const section: Section = {
  id: "boundary-cases",
  title: "Make boundary decisions explicit",
  blocks: [
    {
      type: "paragraph",
      text: "Explain the rule and its assumptions in full.",
    },
    {
      type: "code",
      example: {
        source: "print(7 / 2)",
        expectedOutput: "3.5",
        explanation: "Division produces a floating-point result.",
      },
    },
    {
      type: "callout",
      tone: "mistake",
      title: "A common misconception",
      text: "Explain why the mistake happens and how to diagnose it.",
    },
  ],
};
```

## Editorial gate

Verify examples in the real runtime. Distinguish undefined values from zero. State units, denominators, input contracts and operational assumptions. Use original explanations and cite authoritative references. Define terminology before relying on it. Include one meaningful industry example, debugging advice, worked output and practice. Never label reading completion as mastery. Learner-readable prose must not contain implementation notes.

## Progress and storage

Schema version 1 is stored under `self-learning-v1`. Reading acknowledgements are self-reported; assessment results are verified locally. These are learner aids, not tamper-resistant credentials. Browser storage is per-origin and per-device. Export/import is the supported transfer mechanism; imports replace data after validation. A later authentication/sync release needs conflict resolution and migration tests.
