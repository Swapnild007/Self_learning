# Self Learning design decisions

## Identity and components

Pearl #f6f7fa, white #ffffff, ink #202b40, muted slate #626d80, blue #2558d9. Dark mode uses deep slate #151b27 and #1c2433 with light ink and a lighter blue. Borders replace noisy depth effects. Surface radius: 9–10px controls, 14–18px panels. Typography: native system UI for controls and Georgia for long-form reading, with a 17–23px reader preference. No proprietary fonts, copied branding or external artwork.

Desktop uses a sidebar, compact search header, useful continuation panel and deliberate data density. Mobile uses safe-area-aware bottom navigation. The reader uses opaque pages with bounded measure and optional sidebars. Focus is visible. Dialogs use Radix focus management, escape dismissal and accessible title/description. The local reusable control layer follows the composable, editable-source approach of shadcn/ui; this implementation uses Radix directly, not an installed shadcn component collection.

Motion for React provides one quiet entrance; CSS handles hover, progress, expansion and controls. All motion respects the system preference and the application override. Glass is confined to navigation, a toolbar and one decorative illustration. Without backdrop-filter support the translucent background remains functional. No shader, pointer tracking or DOM refraction library is installed.

## Reference evaluation (inspected 24 October 2026)

README, package metadata and license text were inspected where available. `reference-status.json` records API metadata retrieval, including any failures. Upstream claims below are not independent performance audits.

| Reference                                                                | Observations                                                                                                                                                                      | Decision                                                                                                    |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT. Design intelligence rather than a runtime component package; guidance includes resilient layout, accessibility and cancellable interaction.                                  | Reference for hierarchy, reduced motion and interaction checks. No runtime dependency or copied skill code. |
| [shadcn/ui](https://github.com/shadcn-ui/ui)                             | MIT per README/package. Source-owned composition rather than a black-box theme. Large multi-package repository; requirements depend on chosen components.                         | Use the composition model and Radix Dialog foundation; keep custom styles coherent.                         |
| [Liquid Glass React](https://github.com/rdev/liquid-glass-react)         | MIT, package 1.1.1 in inspected metadata, React/React DOM >=18 peers. Demo uses displacement, chromatic aberration and elasticity. README warns Safari/Firefox lack displacement. | Do not install. Uneven effects and continuous optics are unnecessary for reading.                           |
| [samasante/liquid-glass](https://github.com/samasante/liquid-glass)      | MIT, inspected package 0.1.1, React peer, zero runtime dependencies claimed. Headless DOM lens and optional WebGL media rendering; Safari needs special handling.                 | Do not install. A small surface does not justify rasterization/refraction complexity.                       |
| [Open Glass UI](https://github.com/moekoelueker/open-glass-ui)           | MIT. CSS-first materials, React peers; README claims component accessibility tests and browser checks. Inspected workspace requires Node >=22.                                    | CSS-first restraint informs our own materials. Avoid overlapping component libraries.                       |

Maintenance snapshot: UI UX Pro Max and shadcn/ui received pushes on 23 October 2026; Open Glass UI on 19 October 2026; samasante/liquid-glass on 23 June 2026; rdev/liquid-glass-react on 13 June 2025. None was archived at inspection. This favors the established composable component model and our small CSS material layer over adopting an older optical dependency.

All five were accessible during research. Repository activity is not a guarantee of compatibility or quality. The glass alternatives were evaluated from docs/examples and metadata, not benchmarked as installed packages. Actual performance tests apply to the chosen implementation only. No code was vendored from these repositories.

## Runtime and performance budgets

Route-level lazy imports keep CodeMirror and the Python loader out of the initial route. The browser downloads approximately 13 MB of uncompressed runtime assets on first Python execution, not on dashboard startup. Python assets are copied from the lockfile-pinned npm package at install time, so no third-party CDN is required at execution time. UI JS chunk warning threshold is 600 kB uncompressed. Keep initial JS gzip below 170 kB and editor bundle below 200 kB gzip. Reading surfaces do not blur; decoration is static. No performance score or physical-device claim is implied by browser viewport tests.
