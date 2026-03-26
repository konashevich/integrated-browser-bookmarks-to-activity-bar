Integrated Browser Activity Bar Button With Bookmarks

This extension adds a `Browser` icon to the Activity Bar and opens [VS Code's built-in integrated browser](https://code.visualstudio.com/docs/debugtest/integrated-browser) (introduced in version 1.109, January 2026) with support for saved **Favorite Tabs**.

### Features

-   **Activity Bar Integration**: Quick access to the browser from the sidebar.
-   **Favorite Tabs**: Save your frequently visited URLs with custom names.
-   **Persistent Storage**: Favorites are remembered across VS Code sessions.
-   **One-Click Open**: Launch your favorite sites directly from the sidebar.

### Usage

1.  Click the `Browser` icon in the Activity Bar.
2.  Use the `+` button in the sidebar title to add a new favorite URL.
    -   Enter the URL (e.g., `https://google.com`).
    -   Enter a descriptive name (e.g., `Google`).
3.  Click on any favorite to open it in the integrated browser.
4.  Use the trash icon to delete a favorite.

### Testing & Packaging

-   **To test**: Press `F5` to launch an Extension Development Host.
-   **To package**:
    ```bash
    npx @vscode/vsce package --allow-missing-repository
    code --install-extension integrated-browser-on-activity-bar-0.0.3.vsix
    ```
