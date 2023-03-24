if (!this.Wrm){
	Wrm = function () {};
}

Wrm.CommunicationAddress = function () {
    var onLoad = function () {
		if(Xrm.Page.getAttribute("wrmb_collaborationid") == null || Xrm.Page.getAttribute("wrmb_collaborationid").getValue() == null
		|| Xrm.Page.getControl("wrmb_addressid") == null){
			return;
		}
		var CollID = Xrm.Page.getAttribute("wrmb_collaborationid").getValue()[0].id;
		var RelatedIDs = new Array();
		XrmServiceToolkit.Rest.RetrieveMultiple(
			"wrmb_collaboration2accountSet",
			"$select=accountid&$filter=(wrmb_collaborationid eq (guid'" + CollID + "'))",
			function (results) {
				if(results != null && results.length > 0){
					for(var i = 0; i < results.length; i++){
						RelatedIDs.push(results[i].accountid);
					}
				}
			},
			function (error) {
				alert(error.message);
			},
			function onComplete() {},
			false
		);
		
		XrmServiceToolkit.Rest.RetrieveMultiple(
			"wrmb_collaboration2contactSet",
			"$select=contactid&$filter=(wrmb_collaborationid eq (guid'" + CollID + "'))",
			function (results) {
				if(results != null && results.length > 0){
					for(var i = 0; i < results.length; i++){
						RelatedIDs.push(results[i].contactid);
					}
				}
			},
			function (error) {
				alert(error.message);
			},
			function onComplete() {},
			false
		);
		
		Xrm.Page.getControl("wrmb_addressid").addPreSearch(function () {
			var customFetchFilter = "";  
			if(RelatedIDs.length > 0){
				customFetchFilter = "<filter type='or'>";
				for(var i = 0; i < RelatedIDs.length; i++){
					customFetchFilter += "<condition attribute='wrmb_companyid' operator='eq' value='" + RelatedIDs[i] + "' />"; 
					customFetchFilter += "<condition attribute='wrmb_contactid' operator='eq' value='" + RelatedIDs[i] + "' />"; 
				}
				customFetchFilter += "</filter>";
			}else{
				customFetchFilter = "<filter type='and'><condition attribute='wrmb_companyid' operator='eq' value='00000000-0000-0000-0000-000000000000' /></filter>";  
			}
			Xrm.Page.getControl("wrmb_addressid").addCustomFilter(customFetchFilter);
	   });

    };
	
    return {
        OnLoad: onLoad
    };
} ();
