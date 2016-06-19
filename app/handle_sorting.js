/* INITIALIZATION */

clusters_data = {'clusters':[]}


/* 
 * DEBUG: generate random response of designated size to mimic backend response 
 */
function generateRandomResponse(size) {
  
  var res = []
  while (res.length < size) {
    var curr_val = Math.random();    
    res.push(curr_val);
  }
   
  return res;   
}

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

var sources = []
function getOtherTabSources() {
  sources = [];
  console.log("clear");
  var d = $.Deferred();
  chrome.tabs.query({currentWindow: true}, function(tabs){
    var numRemaining = tabs.length; 
    console.log("made it");
    tabs.forEach(function(tab){
      console.log("counting");
      
      var currentId = null; 
      chrome.tabs.getSelected(null, function(tab) {
        currentId = tab.id; 
      });
      
      // do not compare to yourself
      if (tab.id !== currentId) {
        chrome.tabs.executeScript(tab.id,
          { 
            code: "document.getElementsByTagName('html')[0].innerHTML;"
          }, 
          function (source) {
            sources.push(source[0]);
            // console.log(source[0]);
            console.log("Adding source");
            numRemaining--; 
            
            // resolve the promise when there are no more 
            if (numRemaining === 1) {
              d.resolve();
            }
            
          }
        );
      }
      
    });
        
  });
  
  return d.promise();

}

var current_tab_source = null; 
function getTabSource() {
  var d = $.Deferred();
  chrome.tabs.executeScript(
    { 
      code: "document.getElementsByTagName('html')[0].innerHTML;"
    }, 
    function (source) {
      current_tab_source = source[0];
      // console.log(current_tab_source);
      d.resolve();
    }
  );
  return d.promise();
}

function sendCurrentTabsInfo() {
  
  var currentTab = getTabSource(); 
  var otherTabs = getOtherTabSources();
  
  $.when(otherTabs, currentTab).done(function(){
    makePostRequest();
  })
}
  
function makePostRequest() {
  var payload = {
    docs: sources,
    input: current_tab_source
  }
  console.log("payload docs length: " + payload.docs.length);
  // console.log(payload);
  // TEST VALUES
  // var payload = {
  //   docs: ["hey there dir", "shopping amazon", "hey sir derp"],
  //   input: "hey there sir"
  // };

  console.log(payload.docs[0]);
    
  $.ajax({
    type: 'POST',
    url: "http://localhost:5000/cluster/",
    data: JSON.stringify(payload),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    traditional: true, 
    success: function(msg) {
      tabUpdated(clusters, msg)
    }
  });
}

/* 
 * Listens for page load 
 */ 
chrome.tabs.onUpdated.addListener(function(tabId , info) {
  
  // when page load completed
  if (info.status == "complete") {
    console.log("Page loaded")
    sortTabs("url");
    sendCurrentTabsInfo();
    getCurrentTab("url", 4); 
  }
});

function getCurrentTab(prop, num) {
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

      var favicon = favicons[num];

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


