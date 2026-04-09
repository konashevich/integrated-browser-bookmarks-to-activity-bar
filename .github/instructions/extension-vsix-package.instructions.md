---
description: "Use when packaging the VS Code extension, bumping the extension version, creating a VSIX, preparing a release artifact, or publishing to the VS Code Marketplace. Covers the required vsix/ output path, version bump requirement, tag-based publish trigger, and retention of only the newest 5 VSIX files."
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
- Publishing to the VS Code Marketplace is tag-driven in this repository. Pushing to `main` is not enough.
- After the release commit is on `main`, create and push a matching version tag to trigger GitHub Actions publishing:

```bash
git tag vx.y.z
git push origin vx.y.z
```

- The tag must match the version in `package.json` and start with `v`, for example `v0.0.10`.
- After pushing the tag, verify that the `Publish Extension` workflow starts in GitHub Actions.