---
description: How to package the Integrated Browser extension
---

Once you made a change, bump the version in `package.json` and create a new VSIX package.

### Packaging Instructions

All VSIX files must be stored in the `vsix/` directory.

1.  Create the `vsix/` directory (if it doesn't exist) and package the extension:
    // turbo
    `mkdir -p vsix && npx @vscode/vsce package --allow-missing-repository --out vsix/`

2.  Ensure only the last 5 versions are kept (automatically deleting older ones):
    // turbo
    `ls -t vsix/*.vsix | tail -n +6 | xargs rm -f -- || true`

### Versioning Policy

-   Always increment the version in `package.json` before packaging.
-   VSIX files are **not** gitignored in this project to maintain a history of builds.
-   Maintain only the last 5 versions in the `vsix/` folder.