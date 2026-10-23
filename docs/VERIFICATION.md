# Verification record — 24 October 2026

## Scope

Eight web screens implemented: dashboard, catalog, course overview, textbook reader, Python lab, assessment, My Learning and settings. This is a UI engineering foundation with one original Python chapter. The complete curriculum is outside this release. No native app, merge or public deployment is included.

## Local evidence

- TypeScript check and production build pass. Raw local results: [build](test-results/build.txt), [unit](test-results/unit.txt), [browser](test-results/browser.txt), [dependency audit](test-results/dependency-audit.json).
- 10 unit tests cover import schema validation, exact-set grading and sample content invariants.
- Playwright runs desktop Chromium (1440 × 1000) and Pixel 7 browser emulation, not a physical phone.
- End-to-end checks cover all screens, course search/filtering/navigation, reader content, notes/bookmarks/read persistence, theme/font preferences, actual Pyodide stdout, real SyntaxError tracebacks, infinite-loop cancellation and recovery, behavior-tested code assessment and persisted scores, dialog keyboard dismissal, export, invalid/valid import and confirmed reset.
- Axe checks target WCAG 2.2 AA rules in light and dark themes on all eight screens. Automated checks do not replace a manual screen-reader audit.
- Screen captures are in `docs/screenshots/`, including light desktop/mobile screens and dark dashboard captures. Reader captures show the initial viewport; all structured content is additionally checked through browser rendering.
- `npm audit` after upgrading Playwright reports 0 known vulnerabilities. This is dependency advisory coverage, not a complete security audit.
- Production JS: main ~97 kB gzip, dashboard animation chunk ~46 kB gzip, editor/lab shared chunk ~158 kB gzip. Python runtime assets total ~13 MB uncompressed, fetched only when Python starts.

## Findings repaired

The final local suite passed all 20 end-to-end flows across two viewports (1.1 minutes). An early PR-triggered CI run passed 19/20 and exposed a mobile large-output case. Console layout, output capping and interruption were repaired. Refer to the PR checks for the current commit-specific CI verdict. Local runtime regression checks passed on both viewports, and the complete local suite passed 20/20.

CodeMirror's inner editable field initially lacked its own accessible name; it now has an EditorView content attribute. Store writes were moved from state updater callbacks to an effect. The desktop syllabus collapses; the mobile syllabus uses a focus-managed Radix drawer with Escape dismissal. Content routes resolve stable chapter IDs through a registry; assessments are chapter-scoped. Editor changes are disabled during grading. Dark syntax highlighting uses an explicit high-contrast palette; the reset heading has a dark-mode override. Stale messages from terminated workers are ignored. Isolated contexts use a shared Python interrupt before termination. Console output scrolls internally rather than wrapping very long lines; output and tracebacks are capped at 50,000 characters. Invalid import object shapes are rejected. Playwright was updated after dependency audit identified its older browser installer advisory.

## Delivery constraints

The repository had no commits or `main` ref. An attempt to push an empty baseline to `main` was rejected by automatic approval review as an unauthorized default-branch mutation; it was not retried. Command-line git push also lacks credentials (`could not read Username for 'https://github.com': No such device or address`). The connected GitHub API supports writes, so delivery uses that connector.

To keep main untouched and still provide one draft PR, the non-application `codex/self-learning-review-base` branch serves as review base. It contains only ignore rules. The application lives on `codex/self-learning-foundation`. A draft PR targeting main returned GitHub 422 (base invalid), because main does not yet exist. Retargeting to main is a later authorized repository-initialization step.

## Limits

Only Chromium desktop/mobile emulation is verified locally. Safari/Firefox and physical Android testing remain unverified. No authenticated backend or cloud synchronization exists. Local results can be edited by the browser owner and are not certification evidence. Runtime cancellation/timeout destroys worker state. No performance benchmark is claimed for the uninstalled glass libraries. Vite emits browser-external warnings for Pyodide's Node branches; actual browser runtime paths are exercised successfully. Static subpath hosting needs a configured base before deployment. Clipboard access depends on a secure browser context.
