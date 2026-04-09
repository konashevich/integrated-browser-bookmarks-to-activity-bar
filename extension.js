const path = require('path');
const vscode = require('vscode');

class Favorite extends vscode.TreeItem {
  constructor(label, url) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.url = url;
    this.tooltip = url;
    this.description = url;
    this.contextValue = 'favorite';
    this.iconPath = new vscode.ThemeIcon('world');
    this.command = {
      command: 'integratedBrowser.openFavorite',
      title: 'Open Favorite',
      arguments: [this]
    };
  }
}

class FavoriteProvider {
  constructor(context) {
    this.context = context;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element) {
    return element;
  }

  getChildren() {
    const favorites = this.context.globalState.get('favorites', []);
    return favorites.map(f => new Favorite(f.name, f.url));
  }
}

function isAbsoluteFilePath(target) {
  return path.isAbsolute(target) || /^[a-zA-Z]:[\\/]/.test(target);
}

function normalizeBrowserTarget(target) {
  if (!target) {
    return undefined;
  }

  if (target instanceof vscode.Uri) {
    return target.toString();
  }

  if (typeof target !== 'string') {
    return undefined;
  }

  const trimmedTarget = target.trim();
  if (!trimmedTarget) {
    return undefined;
  }

  if (isAbsoluteFilePath(trimmedTarget)) {
    return vscode.Uri.file(trimmedTarget).toString();
  }

  try {
    const parsedTarget = vscode.Uri.parse(trimmedTarget, true);
    if (parsedTarget.scheme) {
      return parsedTarget.toString();
    }
  } catch {
    // Leave non-URI strings unchanged and let the browser command handle them.
  }

  return trimmedTarget;
}

function looksLikeLocalFileTarget(target) {
  if (!target || typeof target !== 'string') {
    return false;
  }

  const trimmedTarget = target.trim();
  if (!trimmedTarget) {
    return false;
  }

  if (isAbsoluteFilePath(trimmedTarget)) {
    return true;
  }

  try {
    const parsedTarget = vscode.Uri.parse(trimmedTarget, true);
    return parsedTarget.scheme === 'file';
  } catch {
    return false;
  }
}

function activate(context) {
  const favoriteProvider = new FavoriteProvider(context);
  const treeView = vscode.window.createTreeView('integratedBrowser.view', {
    treeDataProvider: favoriteProvider,
    showCollapseAll: false
  });

  const openIntegratedBrowser = async (target) => {
    const normalizedTarget = normalizeBrowserTarget(target);

    try {
      if (normalizedTarget) {
        // Try simpleBrowser.show first as it's known to accept URL strings directly
        await vscode.commands.executeCommand('simpleBrowser.show', normalizedTarget);
      } else {
        await vscode.commands.executeCommand('workbench.action.browser.open');
      }
    } catch (error) {
      // Fallback: Try workbench.action.browser.open with the URL string
      try {
        await vscode.commands.executeCommand('workbench.action.browser.open', normalizedTarget);
      } catch (innerError) {
        const message = innerError instanceof Error ? innerError.message : String(innerError);
        void vscode.window.showErrorMessage(`Failed to open integrated browser: ${message}`);
      }
    }
  };

  const addFavorite = async () => {
    const url = await vscode.window.showInputBox({
      prompt: 'Enter the URL of the favorite',
      placeHolder: 'https://example.com',
      ignoreFocusOut: true,
      validateInput: text => {
        return text.trim() ? null : 'URL cannot be empty';
      }
    });
    if (url === undefined) return;

    const name = await vscode.window.showInputBox({
      prompt: 'Enter a name for the favorite',
      placeHolder: 'My Favorite Site',
      value: url,
      ignoreFocusOut: true,
      validateInput: text => {
        return text.trim() ? null : 'Name cannot be empty';
      }
    });
    if (name === undefined) return;

    const favorites = context.globalState.get('favorites', []);
    favorites.push({ name, url });
    await context.globalState.update('favorites', favorites);
    favoriteProvider.refresh();
  };

  const deleteFavorite = async (item) => {
    let favorites = context.globalState.get('favorites', []);
    favorites = favorites.filter(f => f.url !== item.url || f.name !== item.label);
    await context.globalState.update('favorites', favorites);
    favoriteProvider.refresh();
  };

  const openFavorite = async (favorite) => {
    if (favorite && favorite.url) {
      await openIntegratedBrowser(favorite.url);
    }
  };

  const openHtmlFile = async (resource) => {
    const activeDocument = vscode.window.activeTextEditor?.document;
    let resourceToOpen = resource instanceof vscode.Uri
      ? resource
      : activeDocument?.uri;

    if (!resourceToOpen) {
      void vscode.window.showInformationMessage('No HTML file is available to open in the integrated browser.');
      return;
    }

    if (resourceToOpen.scheme !== 'file') {
      if (!activeDocument) {
        void vscode.window.showInformationMessage('Save the HTML file before opening it in the integrated browser.');
        return;
      }

      const saved = await activeDocument.save();
      if (!saved || activeDocument.uri.scheme !== 'file') {
        void vscode.window.showInformationMessage('Save the HTML file before opening it in the integrated browser.');
        return;
      }

      resourceToOpen = activeDocument.uri;
    }

    await openIntegratedBrowser(resourceToOpen);
  };

  const openClipboardLocalFile = async () => {
    const clipboardText = await vscode.env.clipboard.readText();

    if (!looksLikeLocalFileTarget(clipboardText)) {
      void vscode.window.showInformationMessage(
        'Clipboard does not contain an absolute local file path or a file:// URL.'
      );
      return;
    }

    await openIntegratedBrowser(clipboardText);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('integratedBrowser.open', openIntegratedBrowser),
    vscode.commands.registerCommand('integratedBrowser.openHtmlFile', openHtmlFile),
    vscode.commands.registerCommand('integratedBrowser.openClipboardLocalFile', openClipboardLocalFile),
    vscode.commands.registerCommand('integratedBrowser.addFavorite', addFavorite),
    vscode.commands.registerCommand('integratedBrowser.deleteFavorite', deleteFavorite),
    vscode.commands.registerCommand('integratedBrowser.openFavorite', openFavorite)
  );

  let openedForCurrentVisibility = false;

  const openFromActivityBar = async () => {
    if (!treeView.visible || openedForCurrentVisibility) {
      return;
    }

    openedForCurrentVisibility = true;
    await openIntegratedBrowser();
  };

  context.subscriptions.push(
    treeView,
    treeView.onDidChangeVisibility(() => {
      if (treeView.visible) {
        void openFromActivityBar();
        return;
      }

      openedForCurrentVisibility = false;
    })
  );

  void openFromActivityBar();
}

function deactivate() {}

module.exports = { activate, deactivate };
