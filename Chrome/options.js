// Ghost Archive - Options Script

const DEFAULT_SETTINGS = {
  toolbarAction: 'menu',
  openIn: 'adjacent',
  activateOnArchive: true,
  activateOnSearch: true,
  activateOnButton: true
};

// Restore saved settings on page load
function restoreOptions() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    // Radio buttons
    document.querySelector(`input[name="toolbarAction"][value="${settings.toolbarAction}"]`).checked = true;
    document.querySelector(`input[name="openIn"][value="${settings.openIn}"]`).checked = true;

    // Checkboxes
    document.getElementById('activateOnArchive').checked = settings.activateOnArchive;
    document.getElementById('activateOnSearch').checked = settings.activateOnSearch;
    document.getElementById('activateOnButton').checked = settings.activateOnButton;
  });
}

// Save settings when changed
function saveOptions() {
  const settings = {
    toolbarAction: document.querySelector('input[name="toolbarAction"]:checked').value,
    openIn: document.querySelector('input[name="openIn"]:checked').value,
    activateOnArchive: document.getElementById('activateOnArchive').checked,
    activateOnSearch: document.getElementById('activateOnSearch').checked,
    activateOnButton: document.getElementById('activateOnButton').checked
  };

  chrome.storage.sync.set(settings, () => {
    // Show saved status
    const status = document.getElementById('status');
    status.classList.add('visible');
    setTimeout(() => {
      status.classList.remove('visible');
    }, 2000);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  restoreOptions();

  // Auto-save on any input change
  document.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', saveOptions);
  });

  // Close button
  document.getElementById('btnClose').addEventListener('click', () => {
    window.close();
  });

  // Uninstall button
  document.getElementById('btnRemove').addEventListener('click', () => {
    if (confirm('Are you sure you want to uninstall Ghost Archive?')) {
      chrome.management.uninstallSelf({ showConfirmDialog: true });
    }
  });

  // Help button
  document.getElementById('btnHelp').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/primetime43/Ghost-Archive' });
  });
});
