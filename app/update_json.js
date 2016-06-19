function findClusterByTab(clustersObj, tabId){
    var clusters = clustersObj.clusters;
    for (var i = 0; i < clusters.length; i ++){
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
    for (var i = 0; i < clusters.length; i ++){
        var sum = 0;
        for (var j = clusters[i].start; j <= clusters[i].end; j ++){

            sum += similarities[j];
        }
        var average = sum/(clusters[i].end - clusters[i].start + 1);
	if (average > highest[0]) highest = [average, i];
    }
    return highest;
}

function tabUpdated(clustersObj, similarities, activeTabId){
    var threshold = 0.8;
    var highest = computeMostSimilarCluster(clustersObj.clusters,similarities);
    
    console.log("highest similarity: " + highest);
    if (highest[0] > threshold){ //add new tab to existing cluster
        console.log('passes threshold');
        clustersObj.clusters[highest[1]].end ++;

 	clustersObj = shiftAllTabs(clustersObj, clustersObj.clusters[highest[1]].end, 1);
        //move tab over
        console.log("moving this tab: " + activeTabId);
        chrome.tabs.move(activeTabId, {index: clustersObj.clusters[highest[1]].end})
        
    } else { //make a new cluster
        console.log("fails threshold -- make a new cluster");
        console.log(similarities.length);
        clustersObj['clusters'].push({"id": clustersObj.clusters.length, "start": similarities.length, "end": similarities.length});
	chrome.tabs.move(activeTabId, {index: similarities.length})
    }
    return clustersObj;
}

function tabRemoved(clustersObj, tabID) {
    var remove = findClusterByTab(clustersObj, tabID);
    if (remove != null) {
	if (clustersObj.clusters[remove].end != clustersObj.clusters[remove]start){
	    clustersObj.clusters[remove].end--;
            clustersObj = shiftAllTabs(clustersObj, clustersObj.clusters[remove].end, -1);
	} else {
	    clustersObj.clusters.splice(remove, 1);
        }
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
