/* INITIALIZATION */


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
      chrome.tabs.executeScript(tab.id,{code:"document.title = 'test'" });
      chrome.tabs.executeScript(tab.id,{code:"document.querySelectorAll(\"link[rel*='mask-icon']\")[0].href = 'http://www.google.com/favicon.ico'"});
      chrome.tabs.executeScript(tab.id,{code:"document.querySelectorAll(\"link[rel*='shortcut icon']\")[0].href = 'http://www.google.com/favicon.ico'"});
      chrome.tabs.executeScript(tab.id,{code:"document.querySelectorAll(\"link[rel*='icon']\")[0].href = 'http://www.google.com/favicon.ico'"});
    
    });
  });
}

var sources = []
function getOtherTabSources() {
  sources = getOtherTabSources
  promisesArr = []
  chrome.tabs.query({currentWindow: true}, function(tabs){
    tabs.forEach(function(tab){
      chrome.tabs.executeScript(
        { 
          code: "document.getElementsByTagName('html')[0].innerHTML;"
        }, 
        function (source) {
          sources.push(source);
          console.log(sources);
          promisesArr.push($.Deferred().promise());
        }
      );
    });
  });
  
  return promisesArr;

}

var current_tab_source = null; 
function getCurrentTabSource() {
  var d = $.Deferred();
  chrome.tabs.executeScript(
    { 
      code: "document.getElementsByTagName('html')[0].innerHTML;"
    }, 
    function (source) {
      current_tab_source = source;
      console.log(current_tab_source);
      d.resolve();
    }
  );
  return d.promise();
}

function sendCurrentTabsInfo() {
  sources = []
  source = ""
  
  var currentTab = getCurrentTabSource(); 
  currentTab.done(function(){
    console.log("currentTab done");
    
    
    sources = ["hey there dir", "shopping amazon", "hey sir derp"];
    
    var payload = {
      docs: sources,
      input: current_tab_source[0]
    }
    
    console.log(payload);
    // TEST VALUES
    // var payload = {
    //   docs: ["hey there dir", "shopping amazon", "hey sir derp"],
    //   input: "hey there sir"
    // };

      
    $.ajax({
      type: 'POST',
      url: "http://localhost:5000/cluster/",
      data: JSON.stringify(payload),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      traditional: true, 
      success: function(msg) {
          alert("Data Saved: " + msg);
        }
    });
    
  });
  
  // var otherTabsPromises = getOtherTabSources();
  // for (var i=0; i<otherTabsPromises.length; i++) {
  //   // all other tabs must complete before proceeding
  //   otherTabsPromises[i].done(function(){});
  // }

  
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

  }
});
