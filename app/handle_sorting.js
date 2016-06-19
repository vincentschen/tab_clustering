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

/* 
 * Executes a script that retrieves the page source
 */ 
function getPageSource() {
  chrome.tabs.executeScript(
    { 
      code: "document.getElementsByTagName('html')[0].innerHTML;"
    }, 
    function (source) {
      return source;
    }
  );
}

/* 
 * Handles POST request
 */
function makePostRequest(url, type, data, callback) {
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
  xhr.send(encodeURI(data));
}


/* 
 * Listens for page load 
 */ 
chrome.tabs.onUpdated.addListener(function(tabId , info) {
  
  // when page load completed
  if (info.status == "complete") {
    console.log("Page loaded")
    sortTabs("url");
    
    sources = []
    chrome.storage.local.get('sources', function(result){      
      if (result.sources != null) {
        sources = result.sources;
      }
    });

    var current_tab_source = getPageSource();
    
    // makePostRequest("http://localhost:5000/clusters", 'post', data, function(response){
    //   console.log(response);
    // });
    
    var payload = {
      docs: ["hey there dir", "shopping amazon", "hey sir derp"],
      input: "hey there sir"
    };
    
    console.log(JSON.stringify(payload));
    
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
    
    // $.post("http://localhost:5000/cluster/", {docs: sources, input: current_tab_source}, function(response){
    //   console.log(response)
    // }).fail(function(){
    //   alert("failed");
    // });
      
    var updated_sources = sources.push(current_tab_source);
    chrome.storage.local.set({'sources': updated_sources});

  }
});
