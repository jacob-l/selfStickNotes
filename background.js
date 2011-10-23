//Show pageAction on all pages
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if (tab.url.match(/^http/i) && !tab.incognito && tab.status == "complete") {
		chrome.pageAction.show(tabId);
	}
});

chrome.pageAction.onClicked.addListener(function(tab) {
	chrome.tabs.sendRequest(tab.id, {
		event: "clickAction",
		obj: {
		}
	}, function(){});
});

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSettings")
      sendResponse({settings: JSON.parse(localStorage['settings'])});
    else
      sendResponse({});
});