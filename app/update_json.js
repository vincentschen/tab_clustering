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
    if (highest[0] > threshold){ //add new tab to existing cluster
        clustersObj.clusters[highest[1]].end ++;
 	clustersObj = shiftAllTabs(clustersObj, clustersObj.clusters[highest[1]].end, 1);
        //move tab over
        chrome.tabs.move(activeTab.id, {index: clustersObj.clusters[highest[1]].end}
    } else { //make a new cluster
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
