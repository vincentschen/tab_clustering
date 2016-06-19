// defines favicons for use in marking tabs as part of a cluster
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

/* function: findClusterByTab(clustersObj, tabId)
   functionality: takes JSONObject of form {"clusters: []}, where the array is populated with objects that have an id, start, and end and a tabId that is the position of the tab, not the chrome-given id for the tab
   return: returns the index of the cluster
*/

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

/* function: computeMostSimilarCluster(cluster, similarities)
   prerequisites: clusters must be a JSONArray (so the beginning "clusters" is already stripped), similarities must also be an array
   return: returns an array with two numbers: the highest average and the index of the cluster with the highest average
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

/* function: tabUpdated(clustersObj, similarities, activeTabId)
   functionality: updates JSON and moves tab to appropriate location upon tab creation or loading
*/
function tabUpdated(clustersObj, similarities, activeTabId){
    var threshold = 0.8;
    var highest = computeMostSimilarCluster(clustersObj.clusters,similarities);
    
    console.log("highest similarity: " + highest);
    if (highest[0] > threshold){ //add new tab to existing cluster
        console.log('passes threshold');
        clustersObj.clusters[highest[1]].end++;
        var num = (findClusterByTab(clustersObj, highest[1].end))%10;
        setTitleAndIcon(num, activeTabId); 
        //getCurrentTab(activeTabId, findClusterByTab(clustersObj, highest[1].end)%10); 
 	    clustersObj = shiftAllTabs(clustersObj, clustersObj.clusters[highest[1]].end, 1);
        console.log("favicon num: " + num); 
        //move tab over
        console.log("moving this tab: " + activeTabId);
        chrome.tabs.move(activeTabId, {index: clustersObj.clusters[highest[1]].end})
        
    } else { //make a new cluster
        console.log("fails threshold -- make a new cluster");
        console.log(similarities.length);
        clustersObj['clusters'].push({"id": clustersObj.clusters.length, "start": similarities.length, "end": similarities.length});
        chrome.tabs.move(activeTabId, {index: similarities.length})
        //getCurrentTab(activeTabId, findClusterByTab(clustersObj, highest[1].end)%10); 
        var num = (findClusterByTab(clustersObj, highest[1].end))%10;
        setTitleAndIcon(num, activeTabId); 
        console.log("favicon num create: " + num); 

    }
    return clustersObj;
}

/* function: tabRemoved(clustersObj, tabId)
   functionality: updates JSON upon tab removal
*/
function tabRemoved(clustersObj, tabID) {
    var remove = findClusterByTab(clustersObj, tabID);
    if (remove != null) {
    	if (clustersObj.clusters[remove].end != clustersObj.clusters[remove].start){
    	    clustersObj.clusters[remove].end--;
            clustersObj = shiftAllTabs(clustersObj, clustersObj.clusters[remove].end, -1);
    	} else {
    	    clustersObj.clusters.splice(remove, 1);
        }
    }
    return clustersObj;
}

/* function: shiftAllTabs(clustersObj, target, shift)
   functionality: accounts for insertion or deletion of tab in middle of the tabs by shifting all tabs either one to the left or to the right
*/
function shiftAllTabs (clustersObj, target, shift) {
   for (var i = 0; i < clustersObj.clusters.length; i++) {
        if (clustersObj.clusters[i].end > target) {
            clustersObj.clusters[i].start = clustersObj.clusters[i].start + shift;
            clustersObj.clusters[i].end = clustersObj.clusters[i].end + shift;
        }
    }
    return clustersObj;
}


function setTitleAndIcon(num, tabId) {
    var favicon = favicons[num];

    //var string1 = "document.title = '" + title + "'";
    var string2 = "document.quuerySelectorAll(\"link[rel*='mask-icon']\")[0].href = '" + favicon + "'";
    var string3 = "document.querySelectorAll(\"link[rel*='shortcut icon']\")[0].href = '" + favicon + "'";
    var string4 = "document.querySelectorAll(\"link[rel*='icon']\")[0].href = '" + favicon + "'";
    var vlongstring = string2 + ", " + string3; 

    chrome.tabs.executeScript(tabId,{code: vlongstring});
    chrome.tabs.executeScript(tabId,{code: string4});
}
