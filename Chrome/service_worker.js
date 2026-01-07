// Ghost Archive - Service Worker
// Background script for the Ghost Archive browser extension

const GHOST_ARCHIVE_BASE = 'https://ghostarchive.org';
const ARCHIVE_ENDPOINT = `${GHOST_ARCHIVE_BASE}/archive2`;
const SEARCH_URL = `${GHOST_ARCHIVE_BASE}/search?term=`;

// Default settings
const DEFAULT_SETTINGS = {
  toolbarAction: 'menu',      // 'menu', 'archive', 'search'
  openIn: 'adjacent',         // 'adjacent', 'end', 'active'
  activateOnArchive: true,
  activateOnSearch: true,
  activateOnButton: true
};

// Initialize extension on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'welcome.html' });
  }
  createContextMenus();
});

// Create context menu items
function createContextMenus() {
  chrome.contextMenus.removeAll(() => {
    // Page context menu
    chrome.contextMenus.create({
      id: 'archivePage',
      title: 'Archive this page',
      contexts: ['page']
    });

    chrome.contextMenus.create({
      id: 'searchPage',
      title: 'Search for this page',
      contexts: ['page']
    });

    // Link context menu
    chrome.contextMenus.create({
      id: 'archiveLink',
      title: 'Archive this link',
      contexts: ['link']
    });

    chrome.contextMenus.create({
      id: 'searchLink',
      title: 'Search for this link',
      contexts: ['link']
    });
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const url = info.linkUrl || info.pageUrl;

  switch (info.menuItemId) {
    case 'archivePage':
    case 'archiveLink':
      doAction('archive', url, tab);
      break;
    case 'searchPage':
    case 'searchLink':
      doAction('search', url, tab);
      break;
  }
});

// Handle keyboard commands
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      const url = tabs[0].url;
      if (command === 'archive-page') {
        doAction('archive', url, tabs[0]);
      } else if (command === 'search-page') {
        doAction('search', url, tabs[0]);
      }
    }
  });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'archive' || message.action === 'search') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        doAction(message.action, tabs[0].url, tabs[0]);
      }
    });
  }
});

// Handle toolbar button click (when not using popup)
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    if (settings.toolbarAction === 'archive') {
      doAction('archive', tab.url, tab);
    } else if (settings.toolbarAction === 'search') {
      doAction('search', tab.url, tab);
    }
    // If 'menu', the popup handles it
  });
});

// Perform archive or search action
function doAction(action, url, tab) {
  // Check for restricted URLs
  if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') ||
      url.startsWith('edge://') || url.startsWith('about:') ||
      url.startsWith('moz-extension://') || url.startsWith('file://')) {
    console.log('Ghost Archive: Cannot archive restricted page');
    return;
  }

  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    const activate = action === 'archive'
      ? settings.activateOnArchive
      : settings.activateOnSearch;

    if (action === 'archive') {
      // Open GhostArchive homepage and inject script to fill/submit form
      const ghostUrl = `${GHOST_ARCHIVE_BASE}/?ghostarchive_url=${encodeURIComponent(url)}`;

      chrome.tabs.create({
        url: ghostUrl,
        active: activate,
        index: tab ? tab.index + 1 : undefined,
        openerTabId: tab ? tab.id : undefined
      }, (newTab) => {
        // Wait for page to load, then inject script to submit
        chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
          if (tabId === newTab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              func: autoSubmitArchive,
              args: [url]
            });
          }
        });
      });
    } else {
      // Search uses GET
      const targetUrl = SEARCH_URL + encodeURIComponent(url);
      openTab(targetUrl, tab, settings.openIn, activate);
    }
  });
}

// Function to inject into GhostArchive page to auto-submit
function autoSubmitArchive(urlToArchive) {
  const input = document.getElementById('archive');
  const form = input ? input.closest('form') : null;

  if (input && form) {
    input.value = urlToArchive;
    form.submit();
  }
}

// Open a new tab with specified options
function openTab(url, currentTab, openIn, activate) {
  const tabOptions = {
    url: url,
    active: activate
  };

  if (openIn === 'adjacent' && currentTab) {
    tabOptions.index = currentTab.index + 1;
    tabOptions.openerTabId = currentTab.id;
  }
  // 'end' uses default behavior (opens at end)
  // 'active' replaces current tab - we'll handle this differently

  if (openIn === 'active' && currentTab) {
    chrome.tabs.update(currentTab.id, { url: url });
  } else {
    chrome.tabs.create(tabOptions);
  }
}

// Update toolbar based on settings
function updateToolbar() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    if (settings.toolbarAction === 'menu') {
      chrome.action.setPopup({ popup: 'popup.html' });
    } else {
      chrome.action.setPopup({ popup: '' });
    }
  });
}

// Listen for settings changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    updateToolbar();
  }
});

// Initialize toolbar on startup
updateToolbar();
