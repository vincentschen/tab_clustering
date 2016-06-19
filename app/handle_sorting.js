/*
 * Sort tabs based on tab property  
 */  
function sortTabs(prop){   
  prop = prop || "url";
  chrome.tabs.query({currentWindow: true}, function(tabs){
    tabs.sort(function(a,b){
      return a[prop] == b[prop] ? 0 : (a[prop] < b[prop] ? -1 : 1);
    });
    tabs.forEach(function(tab){
      chrome.tabs.move(tab.id, {index: -1});

      // http://www.claireshu.com/favicon1.ico
      var favicons = ["http://www.claireshu.com/favicon1.ico", 
                      "http://www.claireshu.com/favicon2.ico", 
                      "http://www.claireshu.com/favicon3.ico", 
                      "http://www.claireshu.com/favicon4.ico", 
                      "http://www.claireshu.com/favicon5.ico",
                      "http://www.claireshu.com/favicon6.ico", 
                      "http://www.claireshu.com/favicon7.ico", 
                      "http://www.claireshu.com/favicon8.ico", 
                      "http://www.claireshu.com/favicon9.ico", 
                      "http://www.claireshu.com/favicon0.ico"];
      var favicon = favicons[2]; 
      var string1 = "document.title = 'zoom zoom'";
      var string2 = "document.quuerySelectorAll(\"link[rel*='mask-icon']\")[0].href = '" + favicon + "'";
      var string3 = "document.querySelectorAll(\"link[rel*='shortcut icon']\")[0].href = '" + favicon + "'";
      var string4 = "document.querySelectorAll(\"link[rel*='icon']\")[0].href = '" + favicon + "'";
      var vlongstring = string1 + ", " + string2 + ", " + string3; 

      // Changes the title and favicon 
      chrome.tabs.executeScript(tab.id,{code: vlongstring});
      chrome.tabs.executeScript(tab.id,{code: string4});
    });
  });
}

/* 
 * Executes a script that retrieves the page source
 */ 
function getPageSource() {
  chrome.tabs.executeScript(
    { 
      code: "document.getElementsByTagName('html')[0].innerHTML;"
    }, 
    function (ps1) {
      console.log(ps1);
    }
  );
}

/* 
 * Listens for page load 
 */ 
chrome.tabs.onUpdated.addListener(function(tabId , info) {
  
  // when page load completed
  if (info.status == "complete") {
    sortTabs("url");
    getPageSource();
    getCurrentTab("url"); 
  }
});

function getCurrentTab(prop) {
  prop = prop || "url";
  chrome.tabs.query({currentWindow: true}, function(tabs){
    chrome.tabs.getSelected(null, function(tab){
      var favicons = ["http://www.claireshu.com/favicon1.ico", 
                      "http://www.claireshu.com/favicon2.ico", 
                      "http://www.claireshu.com/favicon3.ico", 
                      "http://www.claireshu.com/favicon4.ico", 
                      "http://www.claireshu.com/favicon5.ico",
                      "http://www.claireshu.com/favicon6.ico", 
                      "http://www.claireshu.com/favicon7.ico", 
                      "http://www.claireshu.com/favicon8.ico", 
                      "http://www.claireshu.com/favicon9.ico", 
                      "http://www.claireshu.com/favicon0.ico"];

      var favicon = favicons[5];

      var string1 = "document.title = 'zoom zoom'";
      var string2 = "document.quuerySelectorAll(\"link[rel*='mask-icon']\")[0].href = '" + favicon + "'";
      var string3 = "document.querySelectorAll(\"link[rel*='shortcut icon']\")[0].href = '" + favicon + "'";
      var string4 = "document.querySelectorAll(\"link[rel*='icon']\")[0].href = '" + favicon + "'";
      var vlongstring = string1 + ", " + string2 + ", " + string3; 

      chrome.tabs.executeScript(tab.id,{code: vlongstring});
      chrome.tabs.executeScript(tab.id,{code: string4});
    });
  });
}


