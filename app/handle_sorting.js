function sortTabs(prop){
  prop = prop || "url";
  chrome.tabs.query({currentWindow: true}, function(tabs){
    tabs.sort(function(a,b){
      return a[prop] == b[prop] ? 0 : (a[prop] < b[prop] ? -1 : 1);
    });
    tabs.forEach(function(tab){
      chrome.tabs.move(tab.id, {index: -1});
      chrome.tabs.executeScript(tab.id,{code:"document.title = 'test'" });
      chrome.tabs.executeScript(tab.id,{code:"document.querySelectorAll(\"link[rel*='mask-icon']\")[0].href = 'http://www.google.com/favicon.ico'"});
      chrome.tabs.executeScript(tab.id,{code:"document.querySelectorAll(\"link[rel*='shortcut icon']\")[0].href = 'http://www.google.com/favicon.ico'"});
      chrome.tabs.executeScript(tab.id,{code:"document.querySelectorAll(\"link[rel*='icon']\")[0].href = 'http://www.google.com/favicon.ico'"});
    
    });
  });
}

chrome.tabs.onCreated.addListener(function(tab){
  console.log("hello");
  sortTabs("url");

});
