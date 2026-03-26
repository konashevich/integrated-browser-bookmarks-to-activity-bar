# Integrated Browser Activity Bar Button with Bookmarks

Adds a `Browser` icon to the Activity Bar and opens VS Code's built-in Integrated Browser (introduced in v1.109, January 2026) with bookmark support.

![Demo Video](media/demo.gif)


### Features

- **Activity Bar integration**: Quick access to the browser from the sidebar.
- **Bookmarks**: Save favorite tabs with custom names.
- **Persistent storage**: Favorites persist across VS Code sessions.
- **One-click open**: Launch saved sites directly from the sidebar.

### Usage

1. Click the `Browser` icon in the Activity Bar.
2. Click the `+` button in the sidebar title to add a favorite.
    - Enter the URL (for example, `https://google.com`).
    - Enter a descriptive name (for example, `Google`).
3. Click any favorite to open it in the integrated browser.
4. Click the trash icon to delete a favorite.

### Testing & Packaging

- **To test**: Press `F5` to launch an Extension Development Host.
- **To package**:
   ```bash
   npx @vscode/vsce package --allow-missing-repository
   code --install-extension integrated-browser-on-activity-bar-0.0.3.vsix
   ```
