---
description: "Use when packaging the VS Code extension, bumping the extension version, creating a VSIX, or preparing a release artifact. Covers the required vsix/ output path, version bump requirement, and retention of only the newest 5 VSIX files."
name: "Extension VSIX Packaging"
---
# Extension VSIX Packaging

- Always increment the `version` field in `package.json` before packaging a new VSIX.
- Always write packaged artifacts directly into the `vsix/` directory.
- Use this packaging command:

```bash
mkdir -p vsix && npx @vscode/vsce package --allow-missing-repository --out vsix/
```

- After packaging, keep only the newest 5 VSIX files:

```bash
ls -t vsix/*.vsix | tail -n +6 | xargs rm -f -- || true
```

- Do not leave packaged `.vsix` files at the repository root.
- VSIX files are intentionally kept in git history in this project and are not treated as disposable local build artifacts.