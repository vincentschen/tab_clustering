function sortTabs(prop){
  prop = prop || "url";
  chrome.tabs.query({currentWindow: true}, function(tabs){
    tabs.sort(function(a,b){
      return a[prop] == b[prop] ? 0 : (a[prop] < b[prop] ? -1 : 1);
    });
    tabs.forEach(function(tab){
      chrome.tabs.move(tab.id, {index: -1});
      // chrome.tabs.update(tab.id, {}, function(tab) {
      //   console.log("initial" + tab.favIconUrl);
      //   tab.favIconUrl = "http://www.google.com/favicon.ico";
      //   tab.title = "hello"; 
      //   console.log("final" + tab.favIconUrl);
      // });
      chrome.tabs.executeScript(tab.id,{code:"document.title = 'test'" });
      //changeFavicon("url"); 
      chrome.tabs.executeScript(tab.id,{code:"document.querySelectorAll(\"link[rel*='mask-icon']\")[0].href = 'http://www.google.com/favicon.ico'"});
      chrome.tabs.executeScript(tab.id,{code:"document.querySelectorAll(\"link[rel*='shortcut icon']\")[0].href = 'http://www.google.com/favicon.ico'"});
      chrome.tabs.executeScript(tab.id,{code:"document.querySelectorAll(\"link[rel*='icon']\")[0].href = 'http://www.google.com/favicon.ico'"});
    

    });
    //chrome.tabs.create({url:"http://www.google.com"});
  });
}

chrome.tabs.onCreated.addListener(function(tab){
  console.log("hello");
  sortTabs("url");

});

function changeFavicon(src) {
 var link = document.createElement('link'),
     oldLink = document.getElementById('dynamic-favicon');
 link.id = 'http://www.google.com/favicon.ico';
 link.rel = 'http://www.google.com/favicon.ico';
 link.href = src;
 if (oldLink) {
  document.head.removeChild(oldLink);
 }
 document.head.appendChild(link);
}
