# Deploy Self Learning from GitHub in a browser

No local software or Codespaces are required for the repository owner.

## Before deploying

1. Review the feature pull request and confirm that automated verification passed for the final commit.
2. Merge it into the repository's actual default branch (`codex/self-learning-foundation` at the time this workflow was written). The Pages workflow only runs there.
3. In GitHub, open **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source. GitHub may require repository-owner permissions for this setting.
4. Open **Actions → Publish Self Learning to GitHub Pages** and check the deployment result. If needed, choose **Run workflow** on the default branch.
5. Once GitHub reports a successful Pages deployment, open the URL shown in that workflow. It is expected to be `https://swapnild007.github.io/Self_learning/`, but do not assume this URL is working until verified.

## Why the separate Pages build exists

The site uses a HashRouter so page refreshes do not need server-side application routing. Its Vite public base is `/Self_learning/` in `pages` mode. The Python laboratory also loads its Pyodide WebAssembly runtime from that base. A regular local build continues to use `/`.

## Validation checklist

- Open a lesson, then refresh and navigate back.
- Open the Python laboratory and run `print(2 + 2)`: it must display `4`.
- Open Visual concept studio and change a slider: figures must update.
- Verify the course library can search and filter on Android.
- Write a note, bookmark a chapter and refresh the browser to confirm persistence.
- Export learning data and validate import with a known-good backup.
- Check an offline revisit only after the assets have been loaded. This is **not** an installed fully offline PWA; initial Pyodide assets may require a network connection.

## Privacy and limitations

The deployed website is publicly reachable if GitHub Pages is enabled for the public repository. Learning data is stored in that device's browser storage and is **not synchronized between devices**, authenticated, encrypted as a service, or backed up automatically. Do not use the Python laboratory to run untrusted code or store secrets. A browser worker is not a security-isolated sandbox.

This is a prepared deployment workflow, **not proof of a live release**. Always rely on a completed GitHub deployment and physical-device checks.
