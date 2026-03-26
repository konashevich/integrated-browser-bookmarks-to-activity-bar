# Publishing Updates

Automated publishing is configured via GitHub Actions. To push a new version to the VS Code Marketplace, follow these steps:

### 1. Update Version
Edit the `"version"` field in `package.json` to your new version number (e.g., `0.0.9`).

### 2. Create and Push a Tag
Run the following commands in your terminal:

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare version 0.0.9"

# Create a version tag (must start with 'v')
git tag v0.0.9

# Push the tag to GitHub
git push origin v0.0.9
```

### 3. Automatic Deployment
GitHub Actions will automatically pick up the tag, build the extension, and publish it to the Marketplace using your stored `VSCE_PAT` secret.

- **Monitor Status**: You can watch the progress in the [Actions tab](https://github.com/konashevich/integrated-browser-bookmarks-to-activity-bar/actions) of your repository.
- **Workflow Configuration**: Found in [.github/workflows/publish.yml](file:///mnt/merged_ssd/IDE%20Extensions/integrated-browser-bookmarks-to-activity-bar/.github/workflows/publish.yml)
