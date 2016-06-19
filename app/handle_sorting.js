/* 
 * DEUG: generate random response of designated size to mimic backend response 
 */
function generateRandomResponse(size) {
  
  var res = []
  while (res.length < size) {
    var curr_val = Math.random();    
    res.push(curr_val);
  }
   
  return res;   
}

function findCategory() {}

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

function makeApiCall(url, type, data, callback) {
  var xhr = new XMLHttpRequest();

  xhr.open('POST',
  encodeURI('myservice/username?id=some-unique-id'));
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
      if (xhr.status === 200) {
          alert(xhr.responseText);
      }
      else if (xhr.status !== 200) {
          alert('Request failed.  Returned status of ' + xhr.status);
      }
  };
  xhr.send(encodeURI('name=' + newName));
}

/* 
 * Executes a script that retrieves the page source
 */ 
function getPageSource() {
  chrome.tabs.executeScript(
    { 
      code: "document.getElementsByTagName('html')[0].innerHTML;"
    }, 
    function (source) {
      console.log(source);
      
      apiUrl = "http://www.google.com/favicon.ico";
      makeApiCall(apiUrl, 'get', null, function(response){
        console.log(response)
      });
      
    }
  );
}

/* 
 * Listens for page load 
 */ 
chrome.tabs.onUpdated.addListener(function(tabId , info) {
  
  // when page load completed
  if (info.status == "complete") {
    console.log("Page loaded")
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


