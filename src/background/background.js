let contextMenuItem = {
  id: 'cari',
  title: 'Cari maksud "%s"',
  contexts: ['selection'],
};
chrome.contextMenus.create(contextMenuItem);

// Send empty messge to trigger main function in content.js
chrome.contextMenus.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {});
  });
});
