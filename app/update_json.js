function findClusterByTab(clustersObj, tabId){
    var clusters = clustersObj.clusters;
    for (var i = 0; i < clusters.length; i ++){
        var start = clusters[i].start;
        if (tabId >= start) {
            var end = clusters[i].end;
            if (tabId <= end) return clusters[i].id;
        }

    }
    return null;
}

/* Prerequesites: clusters must be a JSONArray (so the beginning "clusters" is already stripped), similarities must also be an array
*/
function computeMostSimilarCluster(clusters, similarities){
    var highest = [0, 0];
    console.log(clusters.length); 
    for (var i = 0; i < clusters.length; i ++){
        var sum = 0;
        for (var j = clusters[i].start; j <= clusters[i].end; j ++){
            sum += similarities[j];
        }
        console.log(sum); 
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
        console.log('1');
        clustersObj.clusters[highest[1]].end ++;
        for (var i = 0; i < clustersObj.clusters.length; i ++) {
            if (clustersObj.clusters[i].end > clustersObj.clusters[highest[1]].end) {
                clustersObj.clusters[i].start ++;
		        clustersObj.clusters[i].end ++;
            }
        }
        //move tab over
        console.log("moving this tab: " + activeTab);
        chrome.tabs.move(activeTab, {index: clustersObj.clusters[highest[1]].end})
        
    } else { //make a new cluster
        console.log("2");
        clustersObj['clusters'].push({"id": clustersObj.clusters.length, "start": similarities.length, "end": similarities.length});
    }
    return clustersObj;
}
