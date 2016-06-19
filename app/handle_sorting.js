function sortTabs(prop){
  /*
   * Sort tabs based on tab property  
   */  
   
  prop = prop || "url";
  chrome.tabs.query({currentWindow: true}, function(tabs){
    tabs.sort(function(a,b){
      return a[prop] == b[prop] ? 0 : (a[prop] < b[prop] ? -1 : 1);
    });
    tabs.forEach(function(tab){
      chrome.tabs.move(tab.id, {index: -1});
    });
  });
}

chrome.tabs.onUpdated.addListener(function(tabId , info) {
  // listens for page update event
  
  if (info.status == "complete") {
    // when page load completed
    sortTabs("url");
  }
});