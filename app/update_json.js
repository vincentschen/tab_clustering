function findClusterByTab(clustersObj, tabId){
    var clusters = clustersObj.clusters;
    for (var i = 0; i < clusters.length; i++){
        var start = clusters[i].start;
        if (tabId >= start) {
            var end = clusters[i].end;
            if (tabId <= end) return i;
        }
    }
    return null;
}

/* Prerequesites: clusters must be a JSONArray (so the beginning "clusters" is already stripped), similarities must also be an array
*/
function computeMostSimilarCluster(clusters, similarities){
    var highest = [0, 0];
    for (var i = 0; i < clusters.length; i++){
        var sum = 0;
        for (var j = clusters[i].start; j <= clusters[i].end; j++){
            sum += similarities[j];
        }
        var average = sum/(clusters[i].end - clusters[i].start + 1);
	if (average > highest[0]) highest = [average, i];
    }
    return highest;
}

function tabUpdated(clustersObj, similarities, activeTab){
    var threshold = 0.5;
    var highest = computeMostSimilarCluster(clustersObj.clusters,similarities);
    
    console.log("highest similarity: " + highest);
    if (highest[0] > threshold){ //add new tab to existing cluster
        getCurrentTab()
        console.log('passes threshold');
        clustersObj.clusters[highest[1]].end ++;
 	clustersObj = shiftAllTabs(clustersObj, clustersObj.clusters[highest[1]].end, 1);
        //move tab over
        console.log("moving this tab: " + activeTab);
        chrome.tabs.move(activeTab, {index: clustersObj.clusters[highest[1]].end})
        
    } else { //make a new cluster
        console.log("fails threshold -- make a new cluster");
        console.log(similarities.length);
        clustersObj['clusters'].push({"id": clustersObj.clusters.length, "start": similarities.length, "end": similarities.length});
	chrome.tabs.move(activeTab.id, {index: similarities.length}
    }
    return clustersObj;
}

function tabRemoved(clustersObj, tabID) {
    //TODO: change json if start & end are the same (i.e. the tab was the only one in the cluster)
    var remove = findClusterByTab(clustersObj, tabID);
    if (remove != null) {
	clustersObj.clusters[remove].end--;
        clustersObj = shiftAllTabs(clustersObj, clustersObj.clusters[remove].end, -1);
    }
    return clustersObj;
}

function shiftAllTabs (clustersObj, target, shift) {
   for (var i = 0; i < clustersObj.clusters.length; i++) {
        if (clustersObj.clusters[i].end > target) {
            clustersObj.clusters[i].start = clustersObj.clusters[i].start + shift;
            clustersObj.clusters[i].end = clustersObj.clusters[i].end + shift;
        }
    }
    return clustersObj;
}

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

