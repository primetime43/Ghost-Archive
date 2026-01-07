// Ghost Archive - Popup Script

document.addEventListener('DOMContentLoaded', () => {
  // Archive button
  document.getElementById('btnArchive').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'archive' });
    window.close();
  });

  // Search button
  document.getElementById('btnSearch').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'search' });
    window.close();
  });

  // Options button
  document.getElementById('btnOptions').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    window.close();
  });
});
