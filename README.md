# Incognito Link Opener - Chrome Extension

A Chrome extension that allows you to open links in incognito tabs using configurable keyboard shortcuts.

## Features

- Open links in incognito tabs by holding keyboard shortcuts while clicking
- Configure custom keyboard shortcuts
- Context menu option to open links in incognito
- Works on all websites

## Default Shortcut

By default, the extension uses `Command + Shift` (on Mac) or `Windows + Shift` (on Windows/Linux) while clicking a link to open it in an incognito tab.

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the extension:
   ```
   npm run build
   ```
4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder in this repository

## Configuration

1. Click on the extension icon in the Chrome toolbar
2. Select which keys you want to use for the keyboard shortcut
3. Click "Save Configuration"

## Development

- Run the development build with automatic rebuilding:
  ```
  npm run watch
  ```

## Technologies Used

- TypeScript
- React
- Material UI
- Styled Components
- Webpack 