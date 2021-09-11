let contextMenuItem = {
  id: 'cari',
  title: 'Cari maksud "%s"',
  contexts: ['selection'],
};
chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener((data) => {});
