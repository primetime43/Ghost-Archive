# Ghost Archive Browser Extension

A browser extension for archiving and searching webpages using [GhostArchive.org](https://ghostarchive.org/). 
<br>
<br>
I recently came across GhostArchive while searching for an alternative to the others, and noticed this one didn't have an extension to make it convenient to archive items, so I went ahead and created this open sourced extension.

## Features

- **Archive Pages** - Preserve any webpage instantly with GhostArchive
- **Search Archives** - Find previously archived versions of any webpage
- **Context Menu** - Right-click to archive or search pages and links
- **Keyboard Shortcuts** - Quick access with customizable hotkeys
- **Customizable** - Configure toolbar behavior and tab settings

## Installation

### Chrome / Edge / Brave / Opera / Vivaldi (Manual)

The `Chrome` folder works with all Chromium-based browsers.

1. Download or clone this repository
2. Open your browser's extension page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
   - Opera: `opera://extensions/`
   - Vivaldi: `vivaldi://extensions/`
3. Enable "Developer mode" (usually top right corner)
4. Click "Load unpacked" and select the `Chrome` folder

## Usage

### Toolbar Button
Click the Ghost Archive icon in your browser toolbar to:
- Archive the current page
- Search for the current page in GhostArchive
- Open extension options

### Context Menu
Right-click on any page or link to:
- Archive this page/link
- Search for this page/link

### Keyboard Shortcuts
- `Alt + Shift + A` - Archive current page
- `Alt + Shift + S` - Search for current page

Shortcuts can be customized in Chrome at `chrome://extensions/shortcuts`

## Options

Configure the extension behavior:

- **Toolbar Button Behavior** - Show menu, archive directly, or search directly
- **New Tab Position** - Adjacent, end of tab bar, or replace current tab
- **Tab Activation** - Control whether new tabs are focused

## Privacy

This extension:
- Only sends URLs to GhostArchive.org when you initiate an action
- Does not collect or store personal data
- Does not use cookies or tracking

## Credits

Inspired by [Archive-Page](https://github.com/JNavas2/Archive-Page) by John Navas.
