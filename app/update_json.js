function findClusterByTab(clustersObj, tabId){
    var clusters = clustersObj.clusters;
    for (i = 0; i < clusters.length; i ++){
        var start = clusters[i].start;
        if (tabId >= start) {
            var end = clusters[i].end;
            if (tabId <= end) return clusters[i].id;
        }

    }
    return null;
}

function computeClusterSimilarities(clusters, similarities){
    var highest = [0, 0];
    for (i = 0; i < clusters.length; i ++){
        var sum = 0;
        for (j = clusters[i].start; i <= clusters[i].end; i ++){
            sum += similarities[j];
        }
        var average = sum/(clusters[i].start - clusters[i].end + 1);
	if (average > highest) highest = [average, i];
    }
    return highest;
}

function tabUpdated(clustersObj, similarities){
    const var threshold = 0.5;
    highest = computeClusterSimilarities(clustersObj.clusters,similarities);
    if (highest[0] > threshold){
        clustersObj.clusters[highest[1]].end ++;
        for (i = 0; i < clustersObj.clusters.length; i ++) {
            if (clustersObj.clusters[i].end > clustersObj.clusters[highest[1]].end) {
                clustersObj.clusters[i].start ++;
		clustersObj.clusters[i].end ++;
            }
        }
    } else {
        var clustersArray = JSON.parse(clustersObj);
	clustersArray['clusters'].push({"id": clustersObj.cluster.length, "start": clustersObj.clusters.length, "end": clustersObj.clusters.length});
        clustersObj = clustersArray.stringify();
    }
}
