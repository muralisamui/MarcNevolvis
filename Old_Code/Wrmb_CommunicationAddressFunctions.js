if (!this.Wrm){
	"use strict";
	Wrm = function () {};
}

Wrm.CommunicationAddress = function (executionContext) {
	"use strict";
	debugger;
	var onLoad = function (executionContext) {
		"use strict";
		debugger;
		let formContext = executionContext.getFormContext();

		if (!formContext.getAttribute("wrmb_collaborationid") || !formContext.getAttribute("wrmb_collaborationid").getValue() || !formContext.getControl("wrmb_addressid")) {
			return;
		}
		
		var CollID = formContext.getAttribute("wrmb_collaborationid").getValue()[0].id;
		var RelatedIDs = [];
		
		Xrm.WebApi.retrieveMultipleRecords(
			// "wrmb_collaboration2account", 
			"wrmb_collaboration2accountSet",
			"?$select=accountid&$filter=wrmb_collaborationid eq " + CollID)
			.then(function (results) {
				debugger;
				if (results.entities.length > 0) {
					results.entities.forEach(function (entity) {
						RelatedIDs.push(entity.accountid);
					});
				}
			})
			.catch(function (error) {
				console.log(error.message);
			});
		
		Xrm.WebApi.retrieveMultipleRecords(
			"wrmb_collaboration2contactSet",
			"$select=contactid&$filter=(wrmb_collaborationid eq (guid'" + CollID + "'))"
		)
		.then(
			function (results) {
				debugger;
				if(results != null && results.length > 0){
					for(var i = 0; i < results.length; i++){
						RelatedIDs.push(results[i].contactid);
					}
				}
			}
		)
		.catch(function (error) {
			console.log(error.message);
		});

		formContext.getControl("wrmb_addressid").addPreSearch(function () {
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
			debugger;
			formContext.getControl("wrmb_addressid").addCustomFilter(customFetchFilter);
			debugger;
	   });

    };
	
    return {
        OnLoad: onLoad
    };
} ();
