  /* INITIALIZATION */

  var clusters_data = {'clusters':[]}

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
      
      });
    });
  }

  var sources = []
  function getOtherTabSources(currentId) {
    sources = [];
    console.log("clear");
    var d = $.Deferred();
    chrome.tabs.query({currentWindow: true}, function(tabs){
      var numRemaining = tabs.length; 
      console.log("made it");
      tabs.forEach(function(tab){
        console.log("counting");
        
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
    
    // get the id of the current tab
    var currentId = null; 
    chrome.tabs.getSelected(null, function(tab) {
      currentId = tab.id; 
    });
    
    var currentTab = getTabSource(); 
    var otherTabs = getOtherTabSources(currentId);
    
    $.when(otherTabs, currentTab).done(function(){
      makePostRequest(currentId);
    })
  }

  /* 
   * Sends a post request to the server with payload information
   */ 
  function makePostRequest(currentId) {
    var payload = {
      docs: sources,
      input: current_tab_source
    }
    console.log("payload docs length: " + payload.docs.length);
      
    $.ajax({
      type: 'POST',
      url: "http://localhost:5000/cluster/",
      data: JSON.stringify(payload),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      traditional: true, 
      success: function(msg) {
        alert(msg);
        //console.log(clusters_data);
        clusters_data = tabUpdated(clusters_data, msg, currentId);
        //chrome.tabs.move(currentId, {index: 0})
        //console.log(clusters_data);
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
      
    }
  });
