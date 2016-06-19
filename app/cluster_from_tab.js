function findClusterByTab(clusters, tabId){
    for (i = 0; i < clusters.length; i ++){
	var start = clusters[i].start;
	if (tabId >= start) {
	    var end = clusters[i].end;
            if (tabId <= end) return clusters[i].id;
        }
        
    }
    return null;
}
